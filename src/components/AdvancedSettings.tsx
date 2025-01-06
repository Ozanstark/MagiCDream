import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import { Settings, Minus, Plus } from "lucide-react";

interface AdvancedSettings {
  guidance_scale?: number;
  negative_prompt?: string;
  num_inference_steps?: number;
  width?: number;
  height?: number;
  scheduler?: string;
  seed?: number;
}

interface AdvancedSettingsProps {
  settings: AdvancedSettings;
  onSettingsChange: (settings: AdvancedSettings) => void;
}

const AdvancedSettings = ({ settings, onSettingsChange }: AdvancedSettingsProps) => {
  const adjustDimension = (dimension: 'width' | 'height', adjustment: number) => {
    onSettingsChange({
      ...settings,
      [dimension]: Math.min(Math.max((settings[dimension] || 512) + adjustment, 256), 1024)
    });
  };

  const handleSliderChange = (dimension: 'width' | 'height', value: number[]) => {
    onSettingsChange({
      ...settings,
      [dimension]: value[0]
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-full md:w-auto h-10">
          <Settings className="h-4 w-4 mr-2" />
          Advanced
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-[500px] mt-4 h-[75vh]">
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
              value={settings.guidance_scale || ""}
              onChange={(e) => onSettingsChange({
                ...settings,
                guidance_scale: Number(e.target.value)
              })}
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
              value={settings.negative_prompt || ""}
              onChange={(e) => onSettingsChange({
                ...settings,
                negative_prompt: e.target.value
              })}
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
              value={settings.num_inference_steps || ""}
              onChange={(e) => onSettingsChange({
                ...settings,
                num_inference_steps: Number(e.target.value)
              })}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Width ({settings.width}px)</Label>
            <div className="flex items-center gap-2 col-span-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => adjustDimension('width', -64)}
                disabled={settings.width === 256}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Slider
                value={[settings.width || 512]}
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
                disabled={settings.width === 1024}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Height ({settings.height}px)</Label>
            <div className="flex items-center gap-2 col-span-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => adjustDimension('height', -64)}
                disabled={settings.height === 256}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Slider
                value={[settings.height || 512]}
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
                disabled={settings.height === 1024}
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
              value={settings.scheduler || ""}
              onChange={(e) => onSettingsChange({
                ...settings,
                scheduler: e.target.value
              })}
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
              value={settings.seed || ""}
              onChange={(e) => onSettingsChange({
                ...settings,
                seed: Number(e.target.value)
              })}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AdvancedSettings;