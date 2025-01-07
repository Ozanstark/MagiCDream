import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageUrls, language = "tr" } = await req.json();

    if (!Array.isArray(imageUrls) || imageUrls.length !== 2) {
      throw new Error('Exactly 2 image URLs are required');
    }

    console.log('Analyzing images:', imageUrls);

    imageUrls.forEach((url, index) => {
      try {
        new URL(url);
      } catch (e) {
        throw new Error(`Invalid URL format for image ${index + 1}`);
      }
    });

    const results = await Promise.all(imageUrls.map(async (url, index) => {
      try {
        console.log(`Starting analysis for image ${index + 1}`);

        const systemPrompt = language === "tr" 
          ? "Sen bir Instagram uzmanısın. Verilen görseli analiz et ve Instagram'daki potansiyel başarısına göre 100 üzerinden bir puan ver. Kompozisyon, ışık, konu, renk uyumu ve genel görsel çekicilik gibi faktörleri değerlendir. Yanıtını tam olarak bu formatta ver: 'SKOR: [sayı]/100\n\nGERİBİLDİRİM: [detaylı analiz]'"
          : "You are an Instagram expert. Analyze the provided image and give a score out of 100 based on its potential success on Instagram. Consider factors like composition, lighting, subject matter, color harmony, and overall visual appeal. Format your response exactly like this: 'SCORE: [number]/100\n\nFEEDBACK: [detailed analysis]'";

        const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${openAIApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content: systemPrompt
              },
              {
                role: "user",
                content: [
                  {
                    type: "text",
                    text: language === "tr"
                      ? "Bu görseli Instagram potansiyeli açısından analiz et. Kompozisyon, ışık, konu ve genel çekicilik gibi faktörleri değerlendir. 100 üzerinden bir puan ve detaylı geri bildirim ver."
                      : "Analyze this image for Instagram potential. Consider factors like composition, lighting, subject matter, and overall appeal. Provide a score out of 100 and detailed feedback."
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
            max_tokens: 500
          }),
        });

        console.log(`OpenAI API response status for image ${index + 1}:`, openaiResponse.status);

        if (!openaiResponse.ok) {
          const errorData = await openaiResponse.json();
          console.error(`OpenAI API error for image ${index + 1}:`, errorData);
          throw new Error(`OpenAI API error: ${openaiResponse.statusText}`);
        }

        const openaiData = await openaiResponse.json();
        console.log(`OpenAI response data for image ${index + 1}:`, openaiData);

        const analysis = openaiData.choices[0].message.content;
        
        const scoreRegex = language === "tr" ? /SKOR:\s*(\d+)\/100/i : /SCORE:\s*(\d+)\/100/i;
        const scoreMatch = analysis.match(scoreRegex);
        const score = scoreMatch ? parseInt(scoreMatch[1]) : 75;

        const feedbackRegex = language === "tr" ? /GERİBİLDİRİM:\s*([\s\S]*)/i : /FEEDBACK:\s*([\s\S]*)/i;
        const feedbackMatch = analysis.match(feedbackRegex);
        const feedback = feedbackMatch ? feedbackMatch[1].trim() : analysis;

        return {
          score,
          caption: language === "tr" ? `Fotoğraf ${index + 1}` : `Photo ${index + 1}`,
          feedback
        };
      } catch (error) {
        console.error(`Error analyzing image ${index + 1}:`, error);
        throw error;
      }
    }));

    console.log('Analysis results:', results);

    return new Response(
      JSON.stringify(results),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in analyze-instagram-photos function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'An error occurred while analyzing the images', 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});