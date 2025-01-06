import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2'
import { pipeline } from "https://esm.sh/@huggingface/transformers@2.3.2"

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

    // Initialize the feature extraction pipeline with InternViT
    console.log("Initializing feature extraction pipeline...");
    const extractor = await pipeline("feature-extraction", "internvit-base-224", {
      revision: "main",
    });

    // Analyze both images
    const results = await Promise.all(imageUrls.map(async (url, index) => {
      try {
        console.log(`Analyzing image ${index + 1}...`);
        
        // Extract features from the image
        const features = await extractor(url, {
          pooling: "mean",
          normalize: true,
        });

        // Calculate a score based on the feature vector's properties
        const featureArray = features.tolist()[0];
        const magnitude = Math.sqrt(featureArray.reduce((sum: number, val: number) => sum + val * val, 0));
        const coherence = featureArray.reduce((sum: number, val: number) => sum + Math.abs(val), 0) / featureArray.length;
        
        // Calculate score (70-100 range)
        const baseScore = 70 + (magnitude * 10) + (coherence * 20);
        const finalScore = Math.min(100, Math.max(70, baseScore));
        
        // Generate feedback based on the score
        let feedback = "";
        if (finalScore > 90) {
          feedback = "Bu fotoğraf Instagram için mükemmel görünüyor! Kompozisyon ve görsel etki çok güçlü.";
        } else if (finalScore > 80) {
          feedback = "Bu fotoğraf Instagram'da iyi performans gösterebilir. Renk ve detaylar etkileyici.";
        } else {
          feedback = "Bu fotoğraf Instagram için uygun ancak bazı iyileştirmeler yapılabilir.";
        }

        return {
          score: Math.round(finalScore),
          caption: `Image ${index + 1} Analysis`,
          feedback
        }
      } catch (error) {
        console.error('Error analyzing image:', error);
        return {
          score: 0,
          caption: '',
          feedback: 'Fotoğraf analiz edilemedi'
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