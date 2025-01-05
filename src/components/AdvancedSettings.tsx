import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Minus, Plus } from "lucide-react";

interface AdvancedSettingsProps {
  settings: {
    guidance_scale?: number;
    negative_prompt?: string;
    num_inference_steps?: number;
    width?: number;
    height?: number;
    scheduler?: string;
    seed?: number;
  };
  onSettingChange: (key: string, value: any) => void;
}

const AdvancedSettings = ({ settings, onSettingChange }: AdvancedSettingsProps) => {
  const adjustDimension = (dimension: 'width' | 'height', adjustment: number) => {
    onSettingChange(dimension, Math.min(Math.max((settings[dimension] || 512) + adjustment, 256), 1024));
  };

  const handleSliderChange = (dimension: 'width' | 'height', value: number[]) => {
    onSettingChange(dimension, value[0]);
  };

  return (
    <div className="grid gap-4 py-6">
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
          onChange={(e) => onSettingChange("guidance_scale", e.target.value)}
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
          onChange={(e) => onSettingChange("negative_prompt", e.target.value)}
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
          onChange={(e) => onSettingChange("num_inference_steps", e.target.value)}
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
          onChange={(e) => onSettingChange("scheduler", e.target.value)}
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
          onChange={(e) => onSettingChange("seed", e.target.value)}
        />
      </div>
    </div>
  );
};

export default AdvancedSettings;