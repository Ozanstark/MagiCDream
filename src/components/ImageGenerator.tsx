import { useState } from "react";
import { useToast } from "./ui/use-toast";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Wand2, ChevronLeft, ChevronRight } from "lucide-react";
import ImageDisplay from "./ImageDisplay";
import ModelSelector from "./ModelSelector";
import { AVAILABLE_MODELS, ModelType } from "@/types/models";

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedModel, setSelectedModel] = useState<ModelType>(AVAILABLE_MODELS[0]);
  const { toast } = useToast();

  const generateImage = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt first",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        inputs: prompt,
      };

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
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold rainbow-text">
          AI Dream Text to Image
        </h1>
        <p className="text-lg md:text-xl text-gray-700 max-w-2xl">
          Materialize your ideas through text to transform them into images. Start dreaming.
        </p>
      </div>

      <div className="w-full max-w-2xl flex flex-col gap-2">
        <ModelSelector 
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
          disabled={isLoading}
        />
        
        <div className="flex flex-col md:flex-row gap-2">
          <Input
            placeholder="Describe in detail what image you want to dream"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 bg-white h-10"
          />
          <Button
            onClick={generateImage}
            disabled={isLoading}
            className="bg-primary hover:bg-primary/90 h-10"
          >
            <Wand2 className="mr-2 h-4 w-4" />
            {isLoading ? "Dreaming..." : "Dream Image"}
          </Button>
        </div>
      </div>

      <div className="relative w-full max-w-2xl flex items-center justify-center">
        {generatedImages.length > 1 && (
          <>
            <Button
              onClick={() => navigateImages('prev')}
              disabled={currentImageIndex === 0 || isLoading}
              className="absolute left-[-60px] top-1/2 transform -translate-y-1/2 bg-primary/80 hover:bg-primary"
              size="icon"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              onClick={() => navigateImages('next')}
              disabled={currentImageIndex === generatedImages.length - 1 || isLoading}
              className="absolute right-[-60px] top-1/2 transform -translate-y-1/2 bg-primary/80 hover:bg-primary"
              size="icon"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </>
        )}
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