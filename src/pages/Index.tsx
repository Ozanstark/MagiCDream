import { useState } from "react";
import ModeSwitcher from "@/components/ModeSwitcher";
import TextGenerator from "@/components/TextGenerator";
import ImageGenerator from "@/components/ImageGenerator";
import ImageAnalyzer from "@/components/ImageAnalyzer";
import MusicGenerator from "@/components/MusicGenerator";
import TweetGenerator from "@/components/TweetGenerator";

const Index = () => {
  const [mode, setMode] = useState<'image' | 'text' | 'analyze' | 'music' | 'tweet'>('image');

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center gap-4 relative">
      <ModeSwitcher mode={mode} onModeChange={setMode} />
      {mode === 'text' ? (
        <TextGenerator />
      ) : mode === 'analyze' ? (
        <ImageAnalyzer />
      ) : mode === 'music' ? (
        <MusicGenerator />
      ) : mode === 'tweet' ? (
        <TweetGenerator />
      ) : (
        <ImageGenerator />
      )}
    </div>
  );
};

export default Index;