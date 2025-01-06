import { supabase } from "@/integrations/supabase/client";

export const analyzeInstagramPotential = async (imageUrl: string, referenceUrls: string[]) => {
  try {
    const response = await fetch("https://api.openai.com/v4/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4-vision-preview",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze this generated image and compare it to the reference images. Score it from 1-100 based on its Instagram potential, considering factors like composition, aesthetic appeal, and similarity to the reference style. Provide a brief explanation of the score.",
              },
              {
                type: "image_url",
                image_url: imageUrl,
              },
              ...referenceUrls.map(url => ({
                type: "image_url",
                image_url: url,
              })),
            ],
          },
        ],
      }),
    });

    const data = await response.json();
    const analysis = data.choices[0].message.content;
    
    // Extract score using regex
    const scoreMatch = analysis.match(/(\d+)\/100/);
    const score = scoreMatch ? parseInt(scoreMatch[1]) : null;

    return {
      score,
      feedback: analysis,
    };
  } catch (error) {
    console.error("Error analyzing image:", error);
    return {
      score: null,
      feedback: "Failed to analyze image",
    };
  }
};

export const updateImageInstagramScore = async (imageId: string, score: number, feedback: string) => {
  const { error } = await supabase
    .from("generated_images")
    .update({
      instagram_score: score,
      instagram_feedback: feedback,
    })
    .eq("id", imageId);

  if (error) {
    console.error("Error updating image score:", error);
  }
};