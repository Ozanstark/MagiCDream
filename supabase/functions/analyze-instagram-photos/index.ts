import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const analyzeImage = async (imageUrl: string) => {
  const hf = new HfInference(Deno.env.get('HUGGINGFACE_API_KEY'))
  
  try {
    // Use image-classification model to analyze the image
    const result = await hf.imageClassification({
      model: 'microsoft/resnet-50',
      data: imageUrl,
    })

    // Calculate Instagram score based on classification confidence
    const score = Math.round(result[0].score * 100)
    
    // Generate feedback based on classification
    const feedback = `This image appears to be of ${result[0].label} with ${score}% confidence. ` +
      (score > 75 ? 'This type of content typically performs well on Instagram!' :
       score > 50 ? 'This image could perform moderately well on Instagram.' :
       'This image might need improvement for better Instagram performance.')

    return { score, feedback }
  } catch (error) {
    console.error('Analysis error:', error)
    return { score: 0, feedback: 'Failed to analyze image' }
  }
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
    const results = await Promise.all(imageUrls.map(url => analyzeImage(url)))

    return new Response(
      JSON.stringify(results),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})