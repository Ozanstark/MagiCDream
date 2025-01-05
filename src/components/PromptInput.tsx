import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Wand2, Settings } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import AdvancedSettings from "./AdvancedSettings";
import { ModelType } from "@/types/models";
import ModelSelector from "./ModelSelector";

interface PromptInputProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  isLoading: boolean;
  generateImage: () => void;
  selectedModel: ModelType;
  setSelectedModel: (model: ModelType) => void;
  advancedSettings: any;
  handleAdvancedSettingChange: (key: string, value: any) => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
}

const PromptInput = ({
  prompt,
  setPrompt,
  isLoading,
  generateImage,
  selectedModel,
  setSelectedModel,
  advancedSettings,
  handleAdvancedSettingChange,
  handleKeyPress,
}: PromptInputProps) => {
  return (
    <div className="w-full max-w-2xl flex flex-col gap-2">
      <ModelSelector 
        selectedModel={selectedModel}
        onModelChange={setSelectedModel}
      />
      
      <div className="flex flex-col md:flex-row gap-2">
        <Input
          placeholder="An old tape 80s style ultra-realistic nude aesthetic man posing in a lake"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 bg-white h-10 focus-visible:ring-0 border-input"
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

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="w-full md:w-auto h-10">
            <Settings className="h-4 w-4 mr-2" />
            Advanced
          </Button>
        </SheetTrigger>
        <SheetContent 
          className="sm:max-w-[500px] mt-4 h-auto top-[50%] translate-y-[-50%]" 
          side="right"
        >
          <SheetHeader>
            <SheetTitle>Advanced Settings</SheetTitle>
            <SheetDescription>
              Configure advanced parameters for image generation
            </SheetDescription>
          </SheetHeader>
          <AdvancedSettings 
            settings={advancedSettings}
            onSettingChange={handleAdvancedSettingChange}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default PromptInput;