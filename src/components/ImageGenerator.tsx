import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import ImageDisplay from "./ImageDisplay";
import ImageGallery from "./ImageGallery";
import { AVAILABLE_MODELS, ModelType } from "@/types/models";
import { useApiLimits } from "@/hooks/useApiLimits";
import { uploadImageToStorage } from "@/utils/imageStorage";
import GeneratorHeader from "./generator/GeneratorHeader";
import GeneratorControls from "./generator/GeneratorControls";
import { useGeneratedImages } from "@/hooks/useGeneratedImages";
import { supabase } from "@/integrations/supabase/client";

interface AdvancedSettingsConfig {
  guidance_scale?: number;
  negative_prompt?: string;
  num_inference_steps?: number;
  width?: number;
  height?: number;
  scheduler?: string;
  seed?: number;
}

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedModel, setSelectedModel] = useState<ModelType>(AVAILABLE_MODELS[0]);
  const [advancedSettings, setAdvancedSettings] = useState<AdvancedSettingsConfig>({
    width: 512,
    height: 512
  });
  
  const { toast } = useToast();
  const { checkImageGeneration } = useApiLimits();
  const { generatedImages, setGeneratedImages, loadGeneratedImages } = useGeneratedImages();

  useEffect(() => {
    loadGeneratedImages();
  }, []);

  const handleImageDelete = (index: number) => {
    setGeneratedImages(prev => {
      const newImages = [...prev];
      newImages.splice(index, 1);
      return newImages;
    });

    if (currentImageIndex === index) {
      setCurrentImage(null);
      setCurrentImageIndex(0);
    } else if (currentImageIndex > index) {
      setCurrentImageIndex(prev => prev - 1);
    }
  };

  const consumeCredits = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.rpc('update_user_credits', {
      user_id: user.id,
      amount: -20, // Deduct 20 credits for image generation
      action_type: 'image_generation',
      description: `Generated image with prompt: ${prompt}`
    });

    if (error) {
      console.error('Error consuming credits:', error);
      toast({
        title: "Error",
        description: "Failed to consume credits",
        variant: "destructive",
      });
    }
  };

  const generateImage = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt first",
        variant: "destructive",
      });
      return;
    }

    // Check if user has enough credits
    const canProceed = await checkImageGeneration();
    if (!canProceed) return;

    setIsLoading(true);
    try {
      let fullPrompt = prompt;
      
      const headers: Record<string, string> = {
        Authorization: "Bearer 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",
        "Content-Type": "application/json",
      };

      const response = await fetch(
        selectedModel.apiUrl,
        {
          headers,
          method: "POST",
          body: JSON.stringify({ inputs: fullPrompt }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const blob = await response.blob();
      const isNSFW = false;

      const { publicUrl } = await uploadImageToStorage(blob, prompt, selectedModel.id, isNSFW);

      // Consume credits after successful generation
      await consumeCredits();

      const newImage = {
        url: publicUrl,
        isNSFW,
      };

      setGeneratedImages(prev => [...prev, newImage]);
      setCurrentImage(publicUrl);
      setCurrentImageIndex(generatedImages.length);

      toast({
        title: "Success",
        description: "Image generated successfully!",
      });

    } catch (error) {
      console.error('API Error:', error);
      toast({
        title: "Error",
        description: error instanceof Error 
          ? error.message 
          : "An error occurred while generating the image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageSelect = (image: string, index: number) => {
    setCurrentImage(image);
    setCurrentImageIndex(index);
  };

  const navigateImages = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1);
      setCurrentImage(generatedImages[currentImageIndex - 1].url);
    } else if (direction === 'next' && currentImageIndex < generatedImages.length - 1) {
      setCurrentImageIndex(prev => prev + 1);
      setCurrentImage(generatedImages[currentImageIndex + 1].url);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4 px-4 sm:px-6 sm:space-y-8">
      <GeneratorHeader
        title="Unleash Your Imagination"
        description="Transform your wildest dreams into stunning visuals. Where words become reality, and imagination knows no bounds."
      />

      <div className="space-y-4">
        <GeneratorControls
          prompt={prompt}
          onPromptChange={setPrompt}
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
          isLoading={isLoading}
          onGenerate={generateImage}
          advancedSettings={advancedSettings}
          onAdvancedSettingsChange={setAdvancedSettings}
        />
      </div>

      <div className="relative w-full flex items-center justify-center">
        <ImageDisplay
          currentImage={currentImage}
          isLoading={isLoading}
          onNavigate={navigateImages}
          canNavigatePrev={currentImageIndex > 0 && !isLoading}
          canNavigateNext={currentImageIndex < generatedImages.length - 1 && !isLoading}
          isNSFW={currentImage ? generatedImages[currentImageIndex]?.isNSFW : false}
        />
      </div>

      <ImageGallery 
        images={generatedImages}
        onImageSelect={handleImageSelect}
        onImageDelete={handleImageDelete}
      />
    </div>
  );
};

export default ImageGenerator;