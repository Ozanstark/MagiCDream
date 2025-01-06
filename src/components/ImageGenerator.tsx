import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import ImageDisplay from "./ImageDisplay";
import ImageGallery from "./ImageGallery";
import { AVAILABLE_MODELS, ModelType } from "@/types/models";
import { useApiLimits } from "@/hooks/useApiLimits";
import { uploadImageToStorage } from "@/utils/imageStorage";
import GeneratorHeader from "./generator/GeneratorHeader";
import GeneratorControls from "./generator/GeneratorControls";
import ReferenceImageUpload from "./generator/ReferenceImageUpload";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { isUncensoredModel } from "@/utils/modelUtils";
import { useGeneratedImages } from "@/hooks/useGeneratedImages";

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
  const [referenceImages, setReferenceImages] = useState<File[]>([]);
  const [activeTab, setActiveTab] = useState("dream");
  
  const { toast } = useToast();
  const { checkImageGenerationLimit, recordImageGeneration } = useApiLimits();
  const { generatedImages, setGeneratedImages, loadGeneratedImages } = useGeneratedImages();

  useEffect(() => {
    loadGeneratedImages();
  }, []);

  const handleReferenceImagesSelected = (files: File[]) => {
    if (files.length + referenceImages.length > 2) {
      toast({
        title: "Maximum 2 reference images",
        description: "Please select up to 2 reference images",
        variant: "destructive",
      });
      return;
    }
    setReferenceImages([...referenceImages, ...files]);
  };

  const handleRemoveReferenceImage = (index: number) => {
    setReferenceImages(referenceImages.filter((_, i) => i !== index));
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
      
      if (activeTab === "instagram" && referenceImages.length > 0) {
        fullPrompt += ` Style reference: ${referenceImages.length} uploaded images. Please create an image that matches their style and composition.`;
      }
      
      const headers: Record<string, string> = {
        Authorization: "Bearer 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",
        "Content-Type": "application/json",
      };

      if (isUncensoredModel(selectedModel.id)) {
        headers["Cookie"] = "token_acceptance=true";
        headers["X-Use-Cache"] = "false";
        headers["X-Wait-For-Model"] = "true";
        headers["X-Show-Adult-Content"] = "true";
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
        
        if (response.status === 503 || errorData.error?.includes("model is loading")) {
          toast({
            title: "Model Meşgul",
            description: "Model şu anda meşgul. Lütfen birkaç saniye bekleyip tekrar deneyin.",
            variant: "destructive",
          });
          return;
        }

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
      <GeneratorHeader
        title="Unleash Your Imagination"
        description="Transform your wildest dreams into stunning visuals. Where words become reality, and imagination knows no bounds."
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="dream">Dream AI</TabsTrigger>
          <TabsTrigger value="instagram">Instagram Style</TabsTrigger>
        </TabsList>
        <TabsContent value="dream">
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
        </TabsContent>
        <TabsContent value="instagram">
          <div className="space-y-4">
            <ReferenceImageUpload
              onImagesSelected={handleReferenceImagesSelected}
              selectedImages={referenceImages}
              onRemoveImage={handleRemoveReferenceImage}
            />
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
        </TabsContent>
      </Tabs>

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
