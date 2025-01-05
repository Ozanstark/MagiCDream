import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

interface AdvancedSettingsProps {
  settings: {
    negativePrompt: string;
    seed: number;
    steps: number;
    cfgScale: number;
  };
  onSettingsChange: (settings: {
    negativePrompt: string;
    seed: number;
    steps: number;
    cfgScale: number;
  }) => void;
}

const AdvancedSettings = ({
  settings,
  onSettingsChange,
}: AdvancedSettingsProps) => {
  const handleNegativePromptChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onSettingsChange({ ...settings, negativePrompt: event.target.value });
  };

  const handleSeedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSettingsChange({ ...settings, seed: parseInt(event.target.value) });
  };

  const handleStepsChange = (value: number[]) => {
    onSettingsChange({ ...settings, steps: value[0] });
  };

  const handleCfgScaleChange = (value: number[]) => {
    onSettingsChange({ ...settings, cfgScale: value[0] });
  };

  return (
    <div className="grid gap-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="negative-prompt">Negative Prompt</Label>
        <Input
          id="negative-prompt"
          value={settings.negativePrompt}
          onChange={handleNegativePromptChange}
          placeholder="What you don't want to see in the image"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="seed">Seed (-1 for random)</Label>
        <Input
          id="seed"
          type="number"
          value={settings.seed}
          onChange={handleSeedChange}
          min={-1}
        />
      </div>
      <div className="space-y-2">
        <Label>Steps ({settings.steps})</Label>
        <Slider
          value={[settings.steps]}
          onValueChange={handleStepsChange}
          min={1}
          max={50}
          step={1}
        />
      </div>
      <div className="space-y-2">
        <Label>CFG Scale ({settings.cfgScale})</Label>
        <Slider
          value={[settings.cfgScale]}
          onValueChange={handleCfgScaleChange}
          min={1}
          max={20}
          step={0.1}
        />
      </div>
    </div>
  );
};

export default AdvancedSettings;