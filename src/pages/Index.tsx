import { useState } from "react";
import ModeSwitcher from "@/components/ModeSwitcher";
import TextGenerator from "@/components/TextGenerator";
import ImageGenerator from "@/components/ImageGenerator";

const Index = () => {
  const [currentMode, setCurrentMode] = useState<'image' | 'text'>('image');

  return (
    <div className="container mx-auto">
      <ModeSwitcher currentMode={currentMode} onModeChange={setCurrentMode} />
      {currentMode === 'image' ? <ImageGenerator /> : <TextGenerator />}
    </div>
  );
};

export default Index;