import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import ModelSelector from "@/components/ModelSelector";
import { ModelType } from "@/types/models";
import AdvancedSettings from "@/components/AdvancedSettings";

interface GeneratorControlsProps {
  prompt: string;
  onPromptChange: (value: string) => void;
  selectedModel: ModelType;
  onModelChange: (model: ModelType) => void;
  isLoading: boolean;
  onGenerate: () => void;
  advancedSettings: any;
  onAdvancedSettingsChange: (settings: any) => void;
}

const GeneratorControls = ({
  prompt,
  onPromptChange,
  selectedModel,
  onModelChange,
  isLoading,
  onGenerate,
  advancedSettings,
  onAdvancedSettingsChange,
}: GeneratorControlsProps) => {
  return (
    <div className="space-y-4">
      <ModelSelector 
        selectedModel={selectedModel}
        onModelChange={onModelChange}
      />
      
      <div className="flex flex-col gap-3">
        <Input
          placeholder="Describe in detail what image you want to dream"
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          className="flex-1 input-premium"
        />
        <Button
          onClick={onGenerate}
          disabled={isLoading}
          className="button-primary w-full sm:w-auto"
        >
          <Wand2 className="mr-2 h-4 w-4" />
          {isLoading ? "Dreaming..." : "Dream Image"}
        </Button>
      </div>

      <AdvancedSettings
        settings={advancedSettings}
        onSettingsChange={onAdvancedSettingsChange}
      />
    </div>
  );
};

export default GeneratorControls;