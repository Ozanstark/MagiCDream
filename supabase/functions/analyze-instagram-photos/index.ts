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
      ? "Sen profesyonel bir Instagram danışmanısın. Her fotoğraf için farklı bir puan ver ve kısa, öz geri bildirimler sağla. Kompozisyon, renk ve ışık açısından değerlendir. Her geri bildirim 3 mini başlık altında kısa cümleler halinde olmalı: 'Güçlü Yönler:', 'Geliştirilebilir:', 'Öneriler:'. Tüm yanıtlar Türkçe olmalı."
      : "You are a professional Instagram consultant. Give different scores for each photo and provide concise feedback. Evaluate composition, color, and lighting. Each feedback should be in short sentences under 3 mini headings: 'Strengths:', 'Areas for Improvement:', 'Suggestions:'"

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openAIApiKey) {
      throw new Error('OpenAI API key is not configured')
    }

    const responses = await Promise.all(imageUrls.map(async (url, index) => {
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
                    ? `Bu fotoğrafı analiz et ve Instagram potansiyelini değerlendir. Diğer fotoğraftan farklı bir puan ver (${index === 0 ? '60-100' : '0-59'} arası).`
                    : `Analyze this photo and evaluate its Instagram potential. Give a different score than the other photo (between ${index === 0 ? '60-100' : '0-59'}).`,
                },
                {
                  type: "image_url",
                  image_url: {
                    url: url
                  }
                }
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
      return data.choices[0].message.content
    }))

    // Parse the responses to extract scores and feedback
    const results = responses.map(analysis => {
      const scoreMatch = analysis.match(/(\d+)\/100/)
      return {
        score: scoreMatch ? parseInt(scoreMatch[1]) : null,
        caption: "",
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