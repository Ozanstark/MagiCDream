import { useState } from "react";
import ImageGenerator from "@/components/ImageGenerator";
import TextGenerator from "@/components/TextGenerator";
import ModeSwitcher from "@/components/ModeSwitcher";

const Index = () => {
  const [currentMode, setCurrentMode] = useState<"image" | "text">("image");

  return (
    <div className="relative">
      <ModeSwitcher currentMode={currentMode} onModeChange={setCurrentMode} />
      {currentMode === "image" ? <ImageGenerator /> : <TextGenerator />}
    </div>
  );
};

export default Index;