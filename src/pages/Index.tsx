import { useState } from "react";
import ImageGenerator from "@/components/ImageGenerator";
import TextGenerator from "@/components/TextGenerator";
import ModeSwitcher from "@/components/ModeSwitcher";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import AdvancedSettings from "@/components/AdvancedSettings";

const Index = () => {
  const [currentMode, setCurrentMode] = useState<"image" | "text">("image");
  const [advancedSettings, setAdvancedSettings] = useState({
    negativePrompt: "",
    seed: -1,
    steps: 20,
    cfgScale: 7,
  });

  return (
    <div className="relative">
      <ModeSwitcher currentMode={currentMode} onModeChange={setCurrentMode} />
      
      <div className="absolute top-4 right-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Advanced Settings</SheetTitle>
            </SheetHeader>
            <AdvancedSettings
              settings={advancedSettings}
              onSettingsChange={setAdvancedSettings}
            />
          </SheetContent>
        </Sheet>
      </div>

      {currentMode === "image" ? (
        <ImageGenerator advancedSettings={advancedSettings} />
      ) : (
        <TextGenerator />
      )}
    </div>
  );
};

export default Index;