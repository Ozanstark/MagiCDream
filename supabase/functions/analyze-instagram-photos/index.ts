import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

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

        // Base score calculation
        let score = 75; // Start with a base score
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

        // Add some randomization for variety (±5 points)
        score += (Math.random() * 10 - 5);

        // Ensure score stays within bounds and round to nearest integer
        score = Math.min(100, Math.max(0, Math.round(score)));

        feedback += `\n\nTechnical Details:\n`;
        feedback += `• File Size: ${sizeInMB.toFixed(2)}MB\n`;
        feedback += `• Format: ${contentType}\n`;
        feedback += `\nRecommendations:\n`;
        if (sizeInMB > 1) {
          feedback += "• Consider compressing the image\n";
        }
        if (contentType === 'image/png') {
          feedback += "• Consider converting to JPEG for better compression\n";
        }

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