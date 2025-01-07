import { useState } from "react";
import ModeSwitcher from "@/components/ModeSwitcher";
import TextGenerator from "@/components/TextGenerator";
import ImageGenerator from "@/components/ImageGenerator";
import MusicGenerator from "@/components/MusicGenerator";
import TweetGenerator from "@/components/TweetGenerator";
import InstagramAnalyzer from "@/components/InstagramAnalyzer";
import EmailGenerator from "@/components/EmailGenerator";

const Index = () => {
  const [mode, setMode] = useState<'image' | 'text' | 'music' | 'tweet' | 'instagram' | 'email'>('image');

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center gap-4 relative">
      <ModeSwitcher mode={mode} onModeChange={setMode} />
      {mode === 'text' ? (
        <TextGenerator />
      ) : mode === 'music' ? (
        <MusicGenerator />
      ) : mode === 'tweet' ? (
        <TweetGenerator />
      ) : mode === 'instagram' ? (
        <InstagramAnalyzer />
      ) : mode === 'email' ? (
        <EmailGenerator />
      ) : (
        <ImageGenerator />
      )}
    </div>
  );
};

export default Index;