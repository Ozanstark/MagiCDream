import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { pipeline } from "https://cdn.jsdelivr.net/npm/@huggingface/transformers"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { imageUrls } = await req.json()

    if (!Array.isArray(imageUrls) || imageUrls.length !== 2) {
      throw new Error('Exactly 2 image URLs are required')
    }

    console.log("Initializing image-to-text pipeline...")
    const imageToText = await pipeline("image-to-text", "Salesforce/blip-image-captioning-base", {
      revision: "main"
    });

    // Analyze both images
    const results = await Promise.all(imageUrls.map(async (url, index) => {
      try {
        console.log(`Analyzing image ${index + 1}...`);
        
        // Fetch the image
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch image');
        }

        const contentType = response.headers.get('content-type');
        const contentLength = response.headers.get('content-length');
        const sizeInMB = parseInt(contentLength || '0') / (1024 * 1024);

        // Generate image description
        console.log(`Generating description for image ${index + 1}...`);
        const description = await imageToText(url);
        console.log(`Description generated: ${description[0].generated_text}`);

        // Base score calculation
        let score = 75;
        let feedback = '';

        // Size scoring (0-10 points)
        if (sizeInMB <= 0.5) {
          score += 10;
          feedback += "✅ Perfect file size for Instagram. ";
        } else if (sizeInMB <= 1) {
          score += 7;
          feedback += "✅ Good file size. ";
        } else if (sizeInMB <= 2) {
          score += 3;
          feedback += "⚠️ File size could be optimized. ";
        } else {
          score -= 5;
          feedback += "❌ File is too large for optimal performance. ";
        }

        // Format scoring (0-5 points)
        if (contentType === 'image/webp') {
          score += 5;
          feedback += "✅ Optimal WebP format. ";
        } else if (contentType === 'image/jpeg' || contentType === 'image/jpg') {
          score += 3;
          feedback += "✅ Good JPEG format. ";
        } else if (contentType === 'image/png') {
          score += 1;
          feedback += "⚠️ Consider converting to JPEG/WebP. ";
        }

        // Content analysis based on description (0-10 points)
        const positiveKeywords = ['beautiful', 'colorful', 'vibrant', 'stunning', 'amazing', 'perfect', 'professional'];
        const description_text = description[0].generated_text.toLowerCase();
        const keywordsFound = positiveKeywords.filter(keyword => description_text.includes(keyword)).length;
        const contentScore = Math.min(10, keywordsFound * 2);
        score += contentScore;

        if (contentScore > 5) {
          feedback += "✅ Strong visual content. ";
        } else {
          feedback += "⚠️ Content could be more engaging. ";
        }

        // Add controlled randomization (±3 points)
        score += (Math.random() * 6 - 3);

        // Ensure score stays within bounds and round to nearest integer
        score = Math.min(100, Math.max(70, Math.round(score)));

        feedback += `\n\nImage Description: ${description[0].generated_text}`;
        feedback += `\nFile Size: ${sizeInMB.toFixed(2)}MB`;
        feedback += `\nFormat: ${contentType}`;

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
})