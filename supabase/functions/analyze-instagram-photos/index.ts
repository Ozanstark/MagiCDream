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

        if (!contentType?.startsWith('image/')) {
          throw new Error('Invalid image format');
        }

        // Calculate base score
        let score = 75; // Base score
        const sizeInMB = parseInt(contentLength || '0') / (1024 * 1024);

        // Size scoring (0-15 points)
        if (sizeInMB <= 0.2) score += 15;
        else if (sizeInMB <= 0.5) score += 12;
        else if (sizeInMB <= 1) score += 8;
        else if (sizeInMB > 2) score -= 5;

        // Format scoring (0-10 points)
        if (contentType === 'image/jpeg' || contentType === 'image/jpg') score += 8;
        else if (contentType === 'image/png') score += 5;
        else if (contentType === 'image/webp') score += 10;

        // Fetch image data for analysis
        const imageBlob = await response.blob();
        const arrayBuffer = await imageBlob.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);

        // Simple color analysis (0-10 points)
        let colorVariety = 0;
        const colorCounts = new Map();
        
        for (let i = 0; i < uint8Array.length; i += 4) {
          const r = uint8Array[i];
          const g = uint8Array[i + 1];
          const b = uint8Array[i + 2];
          const colorKey = `${Math.floor(r/32)},${Math.floor(g/32)},${Math.floor(b/32)}`;
          colorCounts.set(colorKey, (colorCounts.get(colorKey) || 0) + 1);
        }
        
        colorVariety = Math.min(10, colorCounts.size / 50);
        score += colorVariety;

        // Add some controlled randomization (±3 points)
        score += (Math.random() * 6 - 3);

        // Ensure score stays within bounds
        score = Math.min(100, Math.max(70, Math.round(score)));

        // Generate detailed feedback
        let feedback = `${sizeInMB.toFixed(1)}MB boyutunda, ${contentType.split('/')[1]} formatında. `;

        // Size feedback
        if (sizeInMB <= 0.2) {
          feedback += "Boyut Instagram için ideal. ";
        } else if (sizeInMB <= 0.5) {
          feedback += "Boyut uygun. ";
        } else if (sizeInMB <= 1) {
          feedback += "Boyut kabul edilebilir ancak optimize edilebilir. ";
        } else {
          feedback += "Dosya boyutu çok yüksek, optimize edilmeli. ";
        }

        // Color variety feedback
        if (colorVariety >= 8) {
          feedback += "Renk çeşitliliği çok iyi. ";
        } else if (colorVariety >= 5) {
          feedback += "Renk dengesi uygun. ";
        } else {
          feedback += "Daha fazla renk çeşitliliği eklenebilir. ";
        }

        // Format feedback
        if (contentType === 'image/webp') {
          feedback += "WebP formatı Instagram için ideal. ";
        } else if (contentType === 'image/jpeg' || contentType === 'image/jpg') {
          feedback += "JPEG formatı uygun. ";
        } else {
          feedback += "Farklı bir format denenebilir. ";
        }

        // Final score-based feedback
        if (score >= 90) {
          feedback += "Genel olarak mükemmel bir Instagram fotoğrafı!";
        } else if (score >= 85) {
          feedback += "Yüksek etkileşim potansiyeli var.";
        } else if (score >= 80) {
          feedback += "İyi bir Instagram paylaşımı olabilir.";
        } else {
          feedback += "Bazı iyileştirmeler yapılabilir.";
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