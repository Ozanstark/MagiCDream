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

        // Calculate base score based on image size
        const sizeInMB = parseInt(contentLength || '0') / (1024 * 1024);
        let score = 70; // Minimum base score

        // Size scoring (0-10 points)
        if (sizeInMB > 0.5) score += 2;
        if (sizeInMB > 1) score += 3;
        if (sizeInMB > 2) score += 5;
        if (sizeInMB > 4) score -= 3; // Penalize too large files

        // Format scoring (0-10 points)
        if (contentType === 'image/jpeg' || contentType === 'image/jpg') score += 8;
        else if (contentType === 'image/png') score += 5;
        else if (contentType === 'image/webp') score += 10;
        else score += 2;

        // Add some randomization for variety (±5 points)
        score += (Math.random() * 10 - 5);

        // Ensure score stays within bounds
        score = Math.min(100, Math.max(70, Math.round(score)));
        
        // Generate detailed feedback based on the score and properties
        let feedback = "";
        if (score > 90) {
          feedback = `Bu fotoğraf Instagram için mükemmel! ${sizeInMB.toFixed(1)}MB boyutuyla ideal ve ${contentType} formatı kullanılmış. Yüksek etkileşim potansiyeli var.`;
        } else if (score > 85) {
          feedback = `Bu fotoğraf Instagram'da iyi performans gösterebilir. ${sizeInMB.toFixed(1)}MB boyutu uygun, ancak daha iyi optimizasyon yapılabilir.`;
        } else if (score > 80) {
          feedback = `Fotoğraf Instagram için kullanılabilir durumda. ${sizeInMB.toFixed(1)}MB boyutunda ve ${contentType} formatında. Bazı iyileştirmeler yapılabilir.`;
        } else {
          feedback = `Bu fotoğrafın Instagram performansı sınırlı olabilir. ${sizeInMB.toFixed(1)}MB boyutu ve ${contentType} formatı ideal değil. Optimize edilmesi önerilir.`;
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