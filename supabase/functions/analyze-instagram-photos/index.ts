import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2'

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

    const hf = new HfInference("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")
    
    // Analyze both images
    const results = await Promise.all(imageUrls.map(async (url) => {
      try {
        console.log('Analyzing image:', url);
        
        // Use vit-gpt2-image-captioning to analyze the image
        const result = await hf.imageToText({
          model: 'nlpconnect/vit-gpt2-image-captioning',
          inputs: url,
        });

        console.log('Analysis result:', result);

        // Calculate score based on caption analysis
        const caption = result.generated_text.toLowerCase();
        
        // Define positive keywords that indicate good Instagram content
        const positiveKeywords = [
          'beautiful', 'stunning', 'colorful', 'vibrant', 'scenic',
          'perfect', 'amazing', 'gorgeous', 'lovely', 'aesthetic',
          'nature', 'landscape', 'portrait', 'style', 'fashion'
        ];

        // Count how many positive keywords appear in the caption
        const keywordMatches = positiveKeywords.filter(keyword => 
          caption.includes(keyword)
        ).length;

        // Calculate base score (70-100)
        const baseScore = 70 + (keywordMatches * 2);
        const finalScore = Math.min(100, Math.max(70, baseScore));

        // Generate feedback based on the caption and score
        let feedback = `AI Caption: ${result.generated_text}. `;
        
        if (finalScore > 85) {
          feedback += "This image has excellent visual elements that should perform very well on Instagram!"
        } else if (finalScore > 75) {
          feedback += "This image has good potential for Instagram with its appealing characteristics."
        } else {
          feedback += "This image could perform well on Instagram with some minor adjustments to enhance its appeal."
        }

        return {
          score: Math.round(finalScore),
          feedback
        }
      } catch (error) {
        console.error('Error analyzing image:', error);
        return {
          score: 0,
          feedback: 'Failed to analyze image'
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