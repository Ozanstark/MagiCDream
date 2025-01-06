import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Wand2 } from "lucide-react";
import ImageDisplay from "./ImageDisplay";
import ModelSelector from "./ModelSelector";
import { AVAILABLE_MODELS, ModelType } from "@/types/models";
import { useApiLimits } from "@/hooks/useApiLimits";
import AdvancedSettings from "./AdvancedSettings";

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
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedModel, setSelectedModel] = useState<ModelType>(AVAILABLE_MODELS[0]);
  const [advancedSettings, setAdvancedSettings] = useState<AdvancedSettingsConfig>({
    width: 512,
    height: 512
  });
  
  const { toast } = useToast();
  const { checkImageGenerationLimit, recordImageGeneration } = useApiLimits();

  const generateImage = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Hata",
        description: "Lütfen önce bir prompt girin",
        variant: "destructive",
      });
      return;
    }

    if (!checkImageGenerationLimit(selectedModel.id)) {
      toast({
        title: "Rate Limit",
        description: `${selectedModel.name} ile dakikada en fazla 3 görsel oluşturabilirsiniz. Lütfen biraz bekleyin veya başka bir model deneyin.`,
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

      const response = await fetch(
        selectedModel.apiUrl,
        {
          headers: {
            Authorization: "Bearer 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",
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({ inputs: fullPrompt }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Görsel oluşturulamadı');
      }

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setGeneratedImages(prev => [...prev, imageUrl]);
      setCurrentImage(imageUrl);
      setCurrentImageIndex(generatedImages.length);
      recordImageGeneration(selectedModel.id);

    } catch (error) {
      console.error('API Error:', error);
      toast({
        title: "Hata",
        description: error instanceof Error ? error.message : "Görsel oluşturulurken bir hata oluştu",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
    <div className="w-full max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-6">
        <h1 className="text-5xl md:text-6xl font-extrabold rainbow-text tracking-tight">
          AI Dream Text to Image
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4 border border-primary/20 py-3 rounded-lg bg-card/50 backdrop-blur-sm">
          Materialize your ideas through text to transform them into images. Start dreaming.
        </p>
      </div>

      <ModelSelector 
        selectedModel={selectedModel}
        onModelChange={setSelectedModel}
      />
      
      <div className="flex flex-col md:flex-row gap-3">
        <Input
          placeholder="Describe in detail what image you want to dream"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="flex-1 input-premium"
        />
        <Button
          onClick={generateImage}
          disabled={isLoading}
          className="button-primary"
        >
          <Wand2 className="mr-2 h-4 w-4" />
          {isLoading ? "Dreaming..." : "Dream Image"}
        </Button>
      </div>

      <AdvancedSettings
        settings={advancedSettings}
        onSettingsChange={setAdvancedSettings}
      />

      <div className="relative w-full flex items-center justify-center">
        <ImageDisplay
          currentImage={currentImage}
          isLoading={isLoading}
          onNavigate={navigateImages}
          canNavigatePrev={currentImageIndex > 0 && !isLoading}
          canNavigateNext={currentImageIndex < generatedImages.length - 1 && !isLoading}
        />
      </div>
    </div>
  );
};

export default ImageGenerator;