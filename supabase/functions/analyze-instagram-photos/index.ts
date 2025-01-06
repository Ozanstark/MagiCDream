import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageUrls } = await req.json()

    if (!Array.isArray(imageUrls) || imageUrls.length !== 2) {
      throw new Error('Exactly 2 image URLs are required')
    }

    // Analyze both images
    const results = await Promise.all(imageUrls.map(async (url, index) => {
      try {
        console.log(`Analyzing image ${index + 1}...`);
        
        // Fetch the image
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch image');
        }

        // Get image data for analysis
        const imageBlob = await response.blob();
        const base64Image = await blobToBase64(imageBlob);

        // Analyze image using BLIP
        console.log(`Analyzing image ${index + 1} with BLIP...`);
        const blipResponse = await fetch("https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-large", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${Deno.env.get('HUGGINGFACE_API_KEY')}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inputs: base64Image,
          })
        });

        if (!blipResponse.ok) {
          throw new Error(`BLIP API error: ${blipResponse.statusText}`);
        }

        const blipData = await blipResponse.json();
        console.log(`BLIP analysis result:`, blipData);

        const imageDescription = Array.isArray(blipData) ? blipData[0] : blipData.generated_text;

        const contentType = response.headers.get('content-type');
        const contentLength = response.headers.get('content-length');
        const sizeInMB = parseInt(contentLength || '0') / (1024 * 1024);

        // Base score calculation using BLIP description
        let score = 75;
        let feedback = `Image Description: ${imageDescription}\n\nAnalysis:\n`;

        // Add feedback based on the image description
        if (imageDescription.toLowerCase().includes('person') || 
            imageDescription.toLowerCase().includes('people')) {
          score += 5;
          feedback += "✅ Including people in photos typically performs well on Instagram.\n";
        }

        if (imageDescription.toLowerCase().includes('outdoor') || 
            imageDescription.toLowerCase().includes('nature')) {
          score += 5;
          feedback += "✅ Outdoor/nature content tends to engage well with audiences.\n";
        }

        // Technical scoring
        if (sizeInMB <= 0.5) {
          score += 10;
          feedback += "\n✅ Perfect file size for Instagram.";
        } else if (sizeInMB <= 1) {
          score += 7;
          feedback += "\n✅ Good file size.";
        } else if (sizeInMB <= 2) {
          score += 3;
          feedback += "\n⚠️ File size could be optimized.";
        } else {
          score -= 5;
          feedback += "\n❌ File is too large for optimal performance.";
        }

        // Format scoring
        if (contentType === 'image/webp') {
          score += 5;
          feedback += "\n✅ Optimal WebP format.";
        } else if (contentType === 'image/jpeg' || contentType === 'image/jpg') {
          score += 3;
          feedback += "\n✅ Good JPEG format.";
        } else if (contentType === 'image/png') {
          score += 1;
          feedback += "\n⚠️ Consider converting to JPEG/WebP.";
        }

        // Add some controlled randomization
        score += (Math.random() * 6 - 3);
        score = Math.min(100, Math.max(0, Math.round(score)));

        // Technical details
        feedback += `\n\nTechnical Details:`;
        feedback += `\n• File Size: ${sizeInMB.toFixed(2)}MB`;
        feedback += `\n• Format: ${contentType}`;

        return {
          score: Math.round(score),
          caption: `Photo ${index + 1}`,
          feedback
        }
      } catch (error) {
        console.error('Error analyzing image:', error);
        return {
          score: 70,
          caption: `Photo ${index + 1}`,
          feedback: 'An error occurred while analyzing this image. Please ensure it\'s a valid image file.'
        }
      }
    }));

    return new Response(
      JSON.stringify(results),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
});

// Helper function to convert Blob to base64
async function blobToBase64(blob: Blob): Promise<string> {
  const buffer = await blob.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}