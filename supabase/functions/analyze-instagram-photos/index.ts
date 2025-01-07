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
    const { imageUrls, language } = await req.json()

    if (!imageUrls || !Array.isArray(imageUrls)) {
      throw new Error('Image URLs are required and must be an array')
    }

    console.log('Analyzing images:', imageUrls)

    const systemPrompt = language === 'tr' 
      ? "Sen profesyonel bir Instagram danışmanısın. Fotoğrafları analiz et ve Instagram'da ne kadar etkileşim alabileceklerini değerlendir. Kompozisyon, renk kullanımı, ışık ve genel estetik açısından değerlendir. Puanı 100 üzerinden ver ve detaylı geri bildirim sağla. Tüm yanıtlar Türkçe olmalı."
      : "You are a professional Instagram consultant. Analyze the photos and evaluate their potential engagement on Instagram. Consider composition, color usage, lighting, and overall aesthetics. Provide a score out of 100 and detailed feedback."

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openAIApiKey) {
      throw new Error('OpenAI API key is not configured')
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: language === 'tr' 
                  ? 'Bu fotoğrafları analiz et ve Instagram potansiyellerini değerlendir.'
                  : 'Analyze these photos and evaluate their Instagram potential.',
              },
              ...imageUrls.map(url => ({
                type: "image_url",
                image_url: {
                  url: url
                }
              }))
            ]
          }
        ],
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('OpenAI API error:', error)
      throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`)
    }

    const data = await response.json()
    console.log('OpenAI response:', data)

    // Parse the response to extract scores and feedback
    const results = imageUrls.map((_, index) => {
      const analysis = data.choices[0].message.content
      // Extract score using regex (assuming the score is mentioned as X/100)
      const scoreMatch = analysis.match(/(\d+)\/100/)
      return {
        score: scoreMatch ? parseInt(scoreMatch[1]) : null,
        caption: language === 'tr' ? "AI tarafından oluşturulan başlık burada olacak" : "AI-generated caption will be here",
        feedback: analysis
      }
    })

    return new Response(
      JSON.stringify(results),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in analyze-instagram-photos function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Beklenmeyen bir hata oluştu',
        details: error.toString()
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})