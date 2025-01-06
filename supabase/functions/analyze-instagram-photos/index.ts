import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
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
        
        // Fetch the image to check its validity and get basic info
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch image');
        }

        const contentType = response.headers.get('content-type');
        const contentLength = response.headers.get('content-length');

        // Basic image validation
        if (!contentType?.startsWith('image/')) {
          throw new Error('Invalid image format');
        }

        // Calculate a score based on basic image properties
        let score = 85; // Base score
        
        // Adjust score based on image size (assuming larger images are better quality)
        const sizeInMB = parseInt(contentLength || '0') / (1024 * 1024);
        if (sizeInMB > 1) score += 5;
        if (sizeInMB > 2) score += 5;
        
        // Generate feedback based on the score
        let feedback = "";
        if (score > 90) {
          feedback = "Bu fotoğraf Instagram için mükemmel görünüyor! Yüksek kaliteli bir görsel.";
        } else if (score > 85) {
          feedback = "Bu fotoğraf Instagram'da iyi performans gösterebilir. Kalite seviyesi uygun.";
        } else {
          feedback = "Bu fotoğraf Instagram için uygun ancak daha yüksek çözünürlüklü bir versiyon kullanılabilir.";
        }

        return {
          score: Math.round(score),
          caption: `Fotoğraf ${index + 1}`,
          feedback
        }
      } catch (error) {
        console.error('Error analyzing image:', error);
        return {
          score: 70,
          caption: `Fotoğraf ${index + 1}`,
          feedback: 'Fotoğraf analiz edilirken bir hata oluştu. Lütfen geçerli bir görsel kullandığınızdan emin olun.'
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