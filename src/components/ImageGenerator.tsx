import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Wand2 } from "lucide-react";
import ImageDisplay from "./ImageDisplay";
import ImageGallery from "./ImageGallery";
import ModelSelector from "./ModelSelector";
import { AVAILABLE_MODELS, ModelType } from "@/types/models";
import { useApiLimits } from "@/hooks/useApiLimits";
import AdvancedSettings from "./AdvancedSettings";
import { uploadImageToStorage, fetchGeneratedImages } from "@/utils/imageStorage";

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
  const [generatedImages, setGeneratedImages] = useState<Array<{url: string; isNSFW: boolean}>>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedModel, setSelectedModel] = useState<ModelType>(AVAILABLE_MODELS[0]);
  const [advancedSettings, setAdvancedSettings] = useState<AdvancedSettingsConfig>({
    width: 512,
    height: 512
  });
  
  const { toast } = useToast();
  const { checkImageGenerationLimit, recordImageGeneration } = useApiLimits();

  const isUncensoredModel = (modelId: string) => {
    return ['berrys-taylor', 'harrys-torrance', 'realistic-five', 'realistic-six', 'realistic-seven'].includes(modelId);
  };

  useEffect(() => {
    loadGeneratedImages();
  }, []);

  const loadGeneratedImages = async () => {
    try {
      const images = await fetchGeneratedImages();
      setGeneratedImages(images.map(img => ({
        url: img.url,
        isNSFW: img.is_nsfw
      })));
    } catch (error) {
      console.error('Error loading images:', error);
      toast({
        title: "Error",
        description: "An error occurred while loading images",
        variant: "destructive",
      });
    }
  };

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
        title: "Hız Limiti",
        description: `${selectedModel.name} ile dakikada sadece 3 görsel oluşturabilirsiniz. Lütfen bekleyin veya başka bir model deneyin.`,
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

      const headers: Record<string, string> = {
        Authorization: "Bearer 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",
        "Content-Type": "application/json",
      };

      // Add special headers for NSFW models
      if (isUncensoredModel(selectedModel.id)) {
        headers["Cookie"] = "token_acceptance=true";
        headers["X-Use-Cache"] = "false";  // Disable caching for NSFW models
        headers["X-Wait-For-Model"] = "true";  // Wait for model to load if needed
        headers["X-Show-Adult-Content"] = "true";  // Explicitly allow adult content
      }

      const response = await fetch(
        selectedModel.apiUrl,
        {
          headers,
          method: "POST",
          body: JSON.stringify({ inputs: fullPrompt }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        // Model meşgul durumu kontrolü
        if (response.status === 503 || errorData.error?.includes("model is loading")) {
          toast({
            title: "Model Meşgul",
            description: "Model şu anda meşgul. Lütfen birkaç saniye bekleyip tekrar deneyin.",
            variant: "destructive",
          });
          return;
        }

        // Diğer API hataları için
        if (response.status === 429) {
          toast({
            title: "Hız Limiti Aşıldı",
            description: "Çok fazla istek gönderildi. Lütfen birkaç dakika bekleyin.",
            variant: "destructive",
          });
          return;
        }

        if (response.status === 413) {
          toast({
            title: "Prompt Çok Uzun",
            description: "Lütfen daha kısa bir prompt girin.",
            variant: "destructive",
          });
          return;
        }

        throw new Error(errorData.error || 'Görsel oluşturulamadı');
      }

      const blob = await response.blob();
      const isNSFW = isUncensoredModel(selectedModel.id);

      const { publicUrl } = await uploadImageToStorage(blob, prompt, selectedModel.id, isNSFW);
      
      const newImage = {
        url: publicUrl,
        isNSFW
      };

      setGeneratedImages(prev => [...prev, newImage]);
      setCurrentImage(publicUrl);
      setCurrentImageIndex(generatedImages.length);
      recordImageGeneration(selectedModel.id);

      toast({
        title: "Başarılı",
        description: "Görsel başarıyla oluşturuldu!",
      });

    } catch (error) {
      console.error('API Error:', error);
      toast({
        title: "Hata",
        description: error instanceof Error 
          ? error.message 
          : "Görsel oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.",
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
      <div className="text-center space-y-4 sm:space-y-6">
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold rainbow-text tracking-tight leading-tight">
          Unleash Your Imagination
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-3 sm:px-4 border border-primary/20 py-2 sm:py-3 rounded-lg bg-card/50 backdrop-blur-sm">
          Transform your wildest dreams into stunning visuals. Where words become reality, and imagination knows no bounds.
        </p>
      </div>

      <ModelSelector 
        selectedModel={selectedModel}
        onModelChange={setSelectedModel}
      />
      
      <div className="flex flex-col gap-3">
        <Input
          placeholder="Describe in detail what image you want to dream"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="flex-1 input-premium"
        />
        <Button
          onClick={generateImage}
          disabled={isLoading}
          className="button-primary w-full sm:w-auto"
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
          isNSFW={currentImage ? generatedImages[currentImageIndex]?.isNSFW : false}
        />
      </div>

      <ImageGallery 
        images={generatedImages}
        onImageSelect={handleImageSelect}
      />
    </div>
  );
};

export default ImageGenerator;