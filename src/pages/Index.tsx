import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Wand2, ChevronLeft, ChevronRight } from "lucide-react";
import ImageDisplay from "@/components/ImageDisplay";

const Index = () => {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { toast } = useToast();

  const generateImage = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Por favor, introduce un prompt primero",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/ZB-Tech/Text-to-Image",
        {
          headers: {
            Authorization: "Bearer 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",
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({ inputs: prompt }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate image");
      }

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setGeneratedImages(prev => [...prev, imageUrl]);
      setCurrentImage(imageUrl);
      setCurrentImageIndex(generatedImages.length);
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al generar la imagen. Por favor, inténtalo de nuevo.",
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
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center gap-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold rainbow-text">
          AI Dream Image Generator
        </h1>
        <p className="text-lg md:text-xl text-gray-700 max-w-2xl">
          Create images of all styles in an unlimited way, without censorship,
          privately without an internet connection.
        </p>
      </div>

      <div className="w-full max-w-2xl flex flex-col md:flex-row gap-4">
        <Input
          placeholder="An old tape 80s style ultra-realistic nude aesthetic man posing in a lake"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 bg-white border-primary focus:ring-primary"
        />
        <Button
          onClick={generateImage}
          disabled={isLoading}
          className="bg-primary hover:bg-primary/90"
        >
          <Wand2 className="mr-2 h-4 w-4" />
          {isLoading ? "Dreaming..." : "Generate Image"}
        </Button>
      </div>

      <div className="relative w-full max-w-2xl flex items-center justify-center">
        {generatedImages.length > 1 && (
          <>
            <Button
              onClick={() => navigateImages('prev')}
              disabled={currentImageIndex === 0}
              className="absolute left-[-60px] top-1/2 transform -translate-y-1/2 bg-primary/80 hover:bg-primary"
              size="icon"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              onClick={() => navigateImages('next')}
              disabled={currentImageIndex === generatedImages.length - 1}
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
        />
      </div>
    </div>
  );
};

export default Index;