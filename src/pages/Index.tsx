import { useState } from "react";
import ModeSwitcher from "@/components/ModeSwitcher";
import TextGenerator from "@/components/TextGenerator";
import ImageGenerator from "@/components/ImageGenerator";
import { useApiLimits } from "@/hooks/useApiLimits";

const Index = () => {
  const [mode, setMode] = useState<'image' | 'text'>('image');

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center gap-4 relative">
      <ModeSwitcher mode={mode} onModeChange={setMode} />
      {mode === 'text' ? <TextGenerator /> : <ImageGenerator />}
    </div>
  );
};

export default Index;