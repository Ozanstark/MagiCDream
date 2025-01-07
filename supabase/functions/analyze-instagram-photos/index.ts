import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

console.log("Hello from analyze-instagram-photos!");

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { imageUrl, referenceUrls } = await req.json();

    if (!imageUrl) {
      throw new Error("No image URL provided");
    }

    console.log("Analyzing image:", imageUrl);
    console.log("Reference URLs:", referenceUrls);

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${Deno.env.get("OPENAI_API_KEY")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4-vision-preview",
          messages: [
            {
              role: "system",
              content: "You are an Instagram expert who analyzes photos and provides detailed feedback on their potential performance on Instagram.",
            },
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "Analyze this image and rate its potential performance on Instagram from 0-100. Consider factors like composition, lighting, subject matter, and overall appeal. Provide specific feedback on strengths and areas for improvement.",
                },
                {
                  type: "image_url",
                  image_url: imageUrl,
                },
                ...(referenceUrls || []).map((url: string) => ({
                  type: "image_url",
                  image_url: url,
                })),
              ],
            },
          ],
          max_tokens: 1000,
        }),
      });

      const data = await response.json();
      console.log("OpenAI API Response:", data);

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${data.error?.message || 'Unknown error'}`);
      }

      const analysis = data.choices[0].message.content;
      const scoreMatch = analysis.match(/(\d+)\/100/);
      const score = scoreMatch ? parseInt(scoreMatch[1]) : null;

      return new Response(
        JSON.stringify({
          score,
          feedback: analysis,
        }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.error("Error calling OpenAI API:", error);
      throw new Error(`OpenAI API error: ${error.message}`);
    }
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        error: "An error occurred while analyzing the images",
        details: error.message,
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});