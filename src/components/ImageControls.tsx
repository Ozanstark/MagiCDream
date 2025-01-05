import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import ModelSelector from "@/components/ModelSelector";
import { ModelType } from "@/types/models";

interface ImageControlsProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  generateImage: () => void;
  isLoading: boolean;
  selectedModel: ModelType;
  onModelChange: (model: ModelType) => void;
}

const ImageControls = ({
  prompt,
  setPrompt,
  handleKeyPress,
  generateImage,
  isLoading,
  selectedModel,
  onModelChange,
}: ImageControlsProps) => {
  return (
    <div className="w-full max-w-2xl flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <ModelSelector 
          selectedModel={selectedModel}
          onModelChange={onModelChange}
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
    </div>
  );
};

export default ImageControls;