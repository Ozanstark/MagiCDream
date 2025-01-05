import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { AVAILABLE_MODELS, ModelType } from "@/types/models";
import ImageDisplay from "@/components/ImageDisplay";
import Header from "@/components/Header";
import PromptInput from "@/components/PromptInput";

interface AdvancedSettings {
  guidance_scale?: number;
  negative_prompt?: string;
  num_inference_steps?: number;
  width?: number;
  height?: number;
  scheduler?: string;
  seed?: number;
}

const Index = () => {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedModel, setSelectedModel] = useState<ModelType>(AVAILABLE_MODELS[0]);
  const [advancedSettings, setAdvancedSettings] = useState<AdvancedSettings>({
    width: 512,
    height: 512
  });
  const { toast } = useToast();

  const handleAdvancedSettingChange = (key: keyof AdvancedSettings, value: string | number) => {
    setAdvancedSettings(prev => ({
      ...prev,
      [key]: value
    }));
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

    if (generatedImages.length >= 3) {
      toast({
        title: "Rate Limit",
        description: "You can only generate 3 images per minute. Please wait.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      let fullPrompt = prompt;
      
      if (Object.keys(advancedSettings).length > 0) {
        if (advancedSettings.guidance_scale) {
          fullPrompt += ` --guidance_scale ${advancedSettings.guidance_scale}`;
        }
        if (advancedSettings.negative_prompt) {
          fullPrompt += ` --negative_prompt ${advancedSettings.negative_prompt}`;
        }
        if (advancedSettings.num_inference_steps) {
          fullPrompt += ` --steps ${advancedSettings.num_inference_steps}`;
        }
        if (advancedSettings.width && advancedSettings.height) {
          fullPrompt += ` --width ${advancedSettings.width} --height ${advancedSettings.height}`;
        }
        if (advancedSettings.scheduler) {
          fullPrompt += ` --scheduler ${advancedSettings.scheduler}`;
        }
        if (advancedSettings.seed) {
          fullPrompt += ` --seed ${advancedSettings.seed}`;
        }
      }

      const payload = {
        inputs: fullPrompt,
      };

      console.log('Sending payload:', payload);

      const response = await fetch(
        selectedModel.apiUrl,
        {
          headers: {
            Authorization: "Bearer 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",
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate image');
      }

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setGeneratedImages(prev => [...prev, imageUrl]);
      setCurrentImage(imageUrl);
      setCurrentImageIndex(generatedImages.length);
    } catch (error) {
      console.error('API Error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error generating image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      generateImage();
    }
  };

  const navigateImages = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1);
      setCurrentImage(generatedImages[currentImageIndex - 1]);
    } else if (direction === 'next' && currentImageIndex < generatedImages.length - 1) {
      setCurrentImageIndex(prev => prev + 1);
      setCurrentImage(generatedImages[currentImageIndex + 1]);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center gap-4">
      <Header />
      
      <PromptInput 
        prompt={prompt}
        setPrompt={setPrompt}
        isLoading={isLoading}
        generateImage={generateImage}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        advancedSettings={advancedSettings}
        handleAdvancedSettingChange={handleAdvancedSettingChange}
        handleKeyPress={handleKeyPress}
      />

      <div className="relative w-full max-w-2xl flex items-center justify-center">
        <ImageDisplay
          currentImage={currentImage}
          isLoading={isLoading}
          onNavigate={navigateImages}
          canNavigatePrev={currentImageIndex > 0}
          canNavigateNext={currentImageIndex < generatedImages.length - 1}
        />
      </div>
    </div>
  );
};

export default Index;