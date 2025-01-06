import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useGeneratedImages = () => {
  const [generatedImages, setGeneratedImages] = useState<Array<{url: string; isNSFW: boolean}>>([]);

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
          isNSFW: img.is_nsfw || false
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