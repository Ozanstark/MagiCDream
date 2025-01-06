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

        // Fetch image data for additional analysis
        const imageBlob = await response.blob();
        const imageData = await createImageBitmap(imageBlob);
        
        // Create canvas for image analysis
        const canvas = new OffscreenCanvas(imageData.width, imageData.height);
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Failed to get canvas context');
        
        ctx.drawImage(imageData, 0, 0);
        const imageDataArray = ctx.getImageData(0, 0, imageData.width, imageData.height).data;

        // Analyze brightness (0-10 points)
        let totalBrightness = 0;
        for (let i = 0; i < imageDataArray.length; i += 4) {
          const r = imageDataArray[i];
          const g = imageDataArray[i + 1];
          const b = imageDataArray[i + 2];
          totalBrightness += (r + g + b) / 3;
        }
        const avgBrightness = totalBrightness / (imageDataArray.length / 4);
        const brightnessScore = Math.min(10, Math.max(0, 
          avgBrightness > 127 ? (255 - avgBrightness) / 6 : avgBrightness / 6
        ));
        score += brightnessScore;

        // Analyze contrast (0-10 points)
        let minBrightness = 255;
        let maxBrightness = 0;
        for (let i = 0; i < imageDataArray.length; i += 4) {
          const brightness = (imageDataArray[i] + imageDataArray[i + 1] + imageDataArray[i + 2]) / 3;
          minBrightness = Math.min(minBrightness, brightness);
          maxBrightness = Math.max(maxBrightness, brightness);
        }
        const contrast = maxBrightness - minBrightness;
        const contrastScore = Math.min(10, contrast / 25);
        score += contrastScore;

        // Aspect ratio scoring (0-5 points)
        const aspectRatio = imageData.width / imageData.height;
        const aspectRatioScore = Math.min(5, 
          Math.max(0, 5 - Math.abs(aspectRatio - 1) * 3)
        );
        score += aspectRatioScore;

        // Add some randomization for variety (±3 points)
        score += (Math.random() * 6 - 3);

        // Ensure score stays within bounds
        score = Math.min(100, Math.max(70, Math.round(score)));
        
        // Generate detailed feedback based on the score and properties
        let feedback = `${sizeInMB.toFixed(1)}MB boyutunda, ${contentType} formatında. `;
        
        // Add brightness feedback
        if (avgBrightness < 85) {
          feedback += "Fotoğraf biraz karanlık görünüyor. ";
        } else if (avgBrightness > 170) {
          feedback += "Fotoğraf biraz fazla parlak olabilir. ";
        } else {
          feedback += "Işık seviyesi dengeli. ";
        }

        // Add contrast feedback
        if (contrast < 100) {
          feedback += "Kontrast düşük, daha canlı renkler kullanılabilir. ";
        } else if (contrast > 200) {
          feedback += "Kontrast seviyesi çok iyi. ";
        } else {
          feedback += "Kontrast seviyesi uygun. ";
        }

        // Add aspect ratio feedback
        if (Math.abs(aspectRatio - 1) > 0.2) {
          feedback += "Instagram için kare format önerilir. ";
        } else {
          feedback += "Görsel oranları Instagram için uygun. ";
        }

        // Final score-based feedback
        if (score > 90) {
          feedback = `Mükemmel! ${feedback}Yüksek etkileşim potansiyeli var.`;
        } else if (score > 85) {
          feedback = `İyi performans gösterebilir. ${feedback}`;
        } else if (score > 80) {
          feedback = `Kullanılabilir durumda. ${feedback}Bazı iyileştirmeler yapılabilir.`;
        } else {
          feedback = `Sınırlı performans gösterebilir. ${feedback}Optimize edilmesi önerilir.`;
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