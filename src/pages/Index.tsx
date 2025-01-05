import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Wand2, ChevronLeft, ChevronRight, Settings } from "lucide-react";
import ImageDisplay from "@/components/ImageDisplay";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";

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
  const [advancedSettings, setAdvancedSettings] = useState<AdvancedSettings>({});
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
      const payload: any = {
        inputs: prompt,
      };

      // Add advanced settings if they are set
      if (Object.keys(advancedSettings).length > 0) {
        payload.parameters = {};
        if (advancedSettings.guidance_scale) payload.parameters.guidance_scale = advancedSettings.guidance_scale;
        if (advancedSettings.negative_prompt) payload.parameters.negative_prompt = [advancedSettings.negative_prompt];
        if (advancedSettings.num_inference_steps) payload.parameters.num_inference_steps = advancedSettings.num_inference_steps;
        if (advancedSettings.width && advancedSettings.height) {
          payload.parameters.target_size = {
            width: advancedSettings.width,
            height: advancedSettings.height,
          };
        }
        if (advancedSettings.scheduler) payload.parameters.scheduler = advancedSettings.scheduler;
        if (advancedSettings.seed) payload.parameters.seed = advancedSettings.seed;
      }

      const response = await fetch(
        "https://api-inference.huggingface.co/models/ZB-Tech/Text-to-Image",
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
        description: "Error generating image. Please try again.",
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

  const handleAdvancedSettingChange = (key: keyof AdvancedSettings, value: string) => {
    setAdvancedSettings(prev => ({
      ...prev,
      [key]: value === "" ? undefined : 
        (key === "guidance_scale" || key === "num_inference_steps" || key === "width" || key === "height" || key === "seed") 
          ? Number(value) 
          : value
    }));
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center gap-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold rainbow-text">
          AI Dream Image Generator
        </h1>
        <p className="text-lg md:text-xl text-gray-700 max-w-2xl">
          Create images of all styles in an unlimited way, without censorship and privately.
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
        <div className="flex gap-2">
          <Button
            onClick={generateImage}
            disabled={isLoading}
            className="bg-primary hover:bg-primary/90"
          >
            <Wand2 className="mr-2 h-4 w-4" />
            {isLoading ? "Dreaming..." : "Dream Image"}
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">
                <Settings className="h-4 w-4" />
                Advanced
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Advanced Settings</SheetTitle>
                <SheetDescription>
                  Configure advanced parameters for image generation
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="guidance_scale" className="text-right">
                    Guidance Scale
                  </Label>
                  <Input
                    id="guidance_scale"
                    type="number"
                    className="col-span-3"
                    placeholder="Higher values = closer to prompt"
                    value={advancedSettings.guidance_scale || ""}
                    onChange={(e) => handleAdvancedSettingChange("guidance_scale", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="negative_prompt" className="text-right">
                    Negative Prompt
                  </Label>
                  <Input
                    id="negative_prompt"
                    className="col-span-3"
                    placeholder="What NOT to include"
                    value={advancedSettings.negative_prompt || ""}
                    onChange={(e) => handleAdvancedSettingChange("negative_prompt", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="num_inference_steps" className="text-right">
                    Inference Steps
                  </Label>
                  <Input
                    id="num_inference_steps"
                    type="number"
                    className="col-span-3"
                    placeholder="More steps = higher quality"
                    value={advancedSettings.num_inference_steps || ""}
                    onChange={(e) => handleAdvancedSettingChange("num_inference_steps", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="width" className="text-right">
                    Width
                  </Label>
                  <Input
                    id="width"
                    type="number"
                    className="col-span-3"
                    placeholder="Image width in pixels"
                    value={advancedSettings.width || ""}
                    onChange={(e) => handleAdvancedSettingChange("width", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="height" className="text-right">
                    Height
                  </Label>
                  <Input
                    id="height"
                    type="number"
                    className="col-span-3"
                    placeholder="Image height in pixels"
                    value={advancedSettings.height || ""}
                    onChange={(e) => handleAdvancedSettingChange("height", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="scheduler" className="text-right">
                    Scheduler
                  </Label>
                  <Input
                    id="scheduler"
                    className="col-span-3"
                    placeholder="Override default scheduler"
                    value={advancedSettings.scheduler || ""}
                    onChange={(e) => handleAdvancedSettingChange("scheduler", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="seed" className="text-right">
                    Seed
                  </Label>
                  <Input
                    id="seed"
                    type="number"
                    className="col-span-3"
                    placeholder="Random number generator seed"
                    value={advancedSettings.seed || ""}
                    onChange={(e) => handleAdvancedSettingChange("seed", e.target.value)}
                  />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
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
          onNavigate={navigateImages}
          canNavigatePrev={currentImageIndex > 0}
          canNavigateNext={currentImageIndex < generatedImages.length - 1}
        />
      </div>
    </div>
  );
};

export default Index;