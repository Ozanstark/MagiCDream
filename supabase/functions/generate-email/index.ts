import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { Configuration, OpenAIApi } from "https://esm.sh/openai@3.2.1"

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
    const { subject, body } = await req.json()
    
    if (!subject || !body) {
      return new Response(
        JSON.stringify({ error: 'Subject and body are required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const configuration = new Configuration({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    })
    const openai = new OpenAIApi(configuration)

    const prompt = `
    Konu: ${subject}
    İçerik: ${body}
    
    Yukarıdaki konu ve içeriği kullanarak profesyonel bir e-posta oluştur. E-posta Türkçe olmalı ve resmi bir dil kullanmalı.
    `

    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    })

    const email = completion.data.choices[0]?.message?.content || ''

    return new Response(
      JSON.stringify({ email }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})