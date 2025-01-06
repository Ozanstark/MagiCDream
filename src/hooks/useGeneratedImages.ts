import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { GeneratedImage } from "@/types/generated-image";

export const useGeneratedImages = () => {
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);

  const loadGeneratedImages = async () => {
    try {
      const { data, error } = await supabase
        .from('generated_images')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading images:', error);
        return;
      }

      if (data) {
        setGeneratedImages(data.map(img => ({
          url: img.url,
          isNSFW: img.is_nsfw || false,
          instagramScore: img.instagram_score,
          instagramFeedback: img.instagram_feedback
        })));
      }
    } catch (error) {
      console.error('Error loading images:', error);
    }
  };

  return {
    generatedImages,
    setGeneratedImages,
    loadGeneratedImages
  };
};