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
    const { imageUrls } = await req.json();

    if (!Array.isArray(imageUrls) || imageUrls.length !== 2) {
      throw new Error('Exactly 2 image URLs are required');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an expert Instagram content analyzer. Analyze the two images provided and score them based on their potential performance on Instagram. Consider factors like composition, lighting, color harmony, and overall aesthetic appeal."
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Compare these two images and rate them for Instagram. For each image, provide a score out of 100 and specific feedback about why it would or wouldn't perform well on Instagram."
              },
              ...imageUrls.map(url => ({
                type: "image_url",
                image_url: url,
              }))
            ]
          }
        ],
        max_tokens: 1000,
      }),
    });

    const data = await response.json();
    const analysis = data.choices[0].message.content;

    // Parse the response to extract scores and feedback for each image
    const results = imageUrls.map((_, index) => {
      const scoreMatch = analysis.match(new RegExp(`Image ${index + 1}.*?(\\d+)/100`));
      const score = scoreMatch ? parseInt(scoreMatch[1]) : null;
      
      const feedbackMatch = analysis.match(new RegExp(`Image ${index + 1}[^]*?(?=Image ${index + 2}|$)`));
      const feedback = feedbackMatch ? feedbackMatch[0].trim() : null;

      return { score, feedback };
    });

    return new Response(
      JSON.stringify(results),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});