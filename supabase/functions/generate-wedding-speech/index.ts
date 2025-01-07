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
    const { role, coupleNames, relationship, memories, tone } = await req.json();

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    const systemPrompt = `You are an expert wedding speech writer who creates personalized, 
    heartfelt speeches that perfectly balance emotion and entertainment. Create a wedding speech based 
    on the provided information, maintaining the specified tone while incorporating personal stories 
    and memories naturally. The speech should be well-structured, engaging, and appropriate for a 
    wedding celebration.`;

    const userPrompt = `Please write a wedding speech with the following details:
    - Speaking as: ${role}
    - For the couple: ${coupleNames}
    - Relationship context: ${relationship}
    - Key memories/stories to include: ${memories}
    - Desired tone: ${tone}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      throw new Error('Failed to generate speech');
    }

    const data = await response.json();
    const speech = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ speech }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-wedding-speech function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});