import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { position, industry, skills, tone } = await req.json();

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a professional LinkedIn profile optimizer specializing in creating impactful headlines that help professionals stand out."
          },
          {
            role: "user",
            content: `Create a compelling LinkedIn headline for a ${position} in the ${industry} industry. Their key skills include: ${skills}. The tone should be: ${tone}. The headline should be concise (under 220 characters) and highlight their value proposition.`
          }
        ],
      }),
    });

    const data = await response.json();
    const headline = data.choices[0].message.content.trim();

    return new Response(
      JSON.stringify({ headline }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error generating LinkedIn headline:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});