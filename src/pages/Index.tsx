import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Wand2, ChevronLeft, ChevronRight, Settings, Minus, Plus } from "lucide-react";
import ImageDisplay from "@/components/ImageDisplay";
import { Slider } from "@/components/ui/slider";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import ModelSelector from "@/components/ModelSelector";
import { AVAILABLE_MODELS, ModelType } from "@/types/models";

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

  const adjustDimension = (dimension: 'width' | 'height', adjustment: number) => {
    setAdvancedSettings(prev => ({
      ...prev,
      [dimension]: Math.min(Math.max((prev[dimension] || 512) + adjustment, 256), 1024)
    }));
  };

  const handleSliderChange = (dimension: 'width' | 'height', value: number[]) => {
    setAdvancedSettings(prev => ({
      ...prev,
      [dimension]: value[0]
    }));
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center gap-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold rainbow-text">
          AI Dream Image Generator
        </h1>
        <p className="text-lg md:text-xl text-gray-700 max-w-2xl">
          Create quickly unlimited images in any style and without any censorship.
        </p>
      </div>

      <div className="w-full max-w-2xl flex flex-col gap-3">
        <ModelSelector 
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
        />
        
        <div className="flex flex-col md:flex-row gap-4">
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
            {isLoading ? "Dreaming..." : "Dream Image"}
          </Button>
        </div>
      </div>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="w-full md:w-auto mt-1">
            <Settings className="h-4 w-4 mr-2" />
            Advanced
          </Button>
        </SheetTrigger>
        <SheetContent 
          className="sm:max-w-[500px] mt-4 h-[80vh]" 
          side="right"
        >
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
              <Label className="text-right">Width ({advancedSettings.width}px)</Label>
              <div className="flex items-center gap-2 col-span-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => adjustDimension('width', -64)}
                  disabled={advancedSettings.width === 256}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Slider
                  value={[advancedSettings.width || 512]}
                  min={256}
                  max={1024}
                  step={64}
                  className="flex-1"
                  onValueChange={(value) => handleSliderChange('width', value)}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => adjustDimension('width', 64)}
                  disabled={advancedSettings.width === 1024}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Height ({advancedSettings.height}px)</Label>
              <div className="flex items-center gap-2 col-span-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => adjustDimension('height', -64)}
                  disabled={advancedSettings.height === 256}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Slider
                  value={[advancedSettings.height || 512]}
                  min={256}
                  max={1024}
                  step={64}
                  className="flex-1"
                  onValueChange={(value) => handleSliderChange('height', value)}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => adjustDimension('height', 64)}
                  disabled={advancedSettings.height === 1024}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
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

      <div className="relative w-full max-w-2xl flex items-center justify-center mt-2">
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
