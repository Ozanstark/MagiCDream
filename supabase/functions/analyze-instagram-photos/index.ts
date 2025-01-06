import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageUrls } = await req.json()

    if (!Array.isArray(imageUrls) || imageUrls.length !== 2) {
      throw new Error('Exactly 2 image URLs are required')
    }

    // Analyze both images
    const results = await Promise.all(imageUrls.map(async (url, index) => {
      try {
        console.log(`Analyzing image ${index + 1}...`);
        
        // Fetch image metadata
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch image');
        }

        const contentType = response.headers.get('content-type');
        const contentLength = response.headers.get('content-length');
        const sizeInMB = parseInt(contentLength || '0') / (1024 * 1024);

        // Analyze image with OpenAI
        console.log(`Analyzing image ${index + 1} with OpenAI...`);
        const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
          },
          body: JSON.stringify({
            model: "gpt-4-vision-preview",
            messages: [
              {
                role: "system",
                content: "You are an Instagram expert who analyzes photos for their potential success on the platform. Focus on composition, lighting, subject matter, and overall appeal."
              },
              {
                role: "user",
                content: [
                  {
                    type: "text",
                    text: "Analyze this image for Instagram. Consider factors like composition, lighting, subject matter, and overall appeal. Provide a score out of 100 and detailed feedback."
                  },
                  {
                    type: "image_url",
                    image_url: url
                  }
                ]
              }
            ],
            max_tokens: 500
          })
        });

        if (!openaiResponse.ok) {
          const errorData = await openaiResponse.json();
          console.error('OpenAI API error:', errorData);
          throw new Error(`OpenAI API error: ${openaiResponse.statusText}`);
        }

        const openaiData = await openaiResponse.json();
        const analysis = openaiData.choices[0].message.content;
        
        // Extract score using regex
        const scoreMatch = analysis.match(/(\d+)\/100/);
        let score = scoreMatch ? parseInt(scoreMatch[1]) : 75; // Default score if not found

        // Adjust score based on technical factors
        if (sizeInMB <= 0.5) {
          score += 5;
        } else if (sizeInMB > 2) {
          score -= 5;
        }

        if (contentType === 'image/webp') {
          score += 3;
        }

        // Ensure score stays within bounds
        score = Math.min(100, Math.max(0, score));

        let feedback = analysis + "\n\nTechnical Analysis:\n";
        feedback += `• File Size: ${sizeInMB.toFixed(2)}MB `;
        feedback += sizeInMB <= 0.5 ? "(Optimal) ✅" : sizeInMB > 2 ? "(Too large) ❌" : "(Acceptable) ✓";
        feedback += `\n• Format: ${contentType} `;
        feedback += contentType === 'image/webp' ? "(Optimal) ✅" : "(Consider converting to WebP) ⚠️";

        return {
          score: Math.round(score),
          caption: `Photo ${index + 1}`,
          feedback
        }
      } catch (error) {
        console.error('Error analyzing image:', error);
        return {
          score: 70,
          caption: `Photo ${index + 1}`,
          feedback: 'An error occurred while analyzing this image. Please ensure it\'s a valid image file.'
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
});