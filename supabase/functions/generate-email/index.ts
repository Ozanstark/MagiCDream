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
    const { subject, body } = await req.json()
    
    if (!subject || !body) {
      throw new Error('Subject and body are required')
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openAIApiKey) {
      console.error('OpenAI API key is not set')
      throw new Error('OpenAI API key is not configured')
    }

    console.log('Sending request to OpenAI')

    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: `You are an expert at writing professional emails in Turkish. Create formal and well-structured emails.`
          },
          {
            role: 'user',
            content: `
              Konu: ${subject}
              İçerik: ${body}
              
              Yukarıdaki konu ve içeriği kullanarak profesyonel bir e-posta oluştur. E-posta Türkçe olmalı ve resmi bir dil kullanmalı.
            `
          }
        ],
      }),
    })

    if (!openAIResponse.ok) {
      const errorData = await openAIResponse.json()
      console.error('OpenAI API error:', errorData)
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`)
    }

    const data = await openAIResponse.json()
    console.log('Received response from OpenAI')
    
    const email = data.choices[0].message.content

    return new Response(
      JSON.stringify({ email }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in generate-email function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})