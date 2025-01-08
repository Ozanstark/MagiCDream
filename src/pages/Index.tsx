import ModeSwitcher from "@/components/ModeSwitcher";
import { AnnouncementsBanner } from "@/components/AnnouncementsBanner";
import { useState } from "react";

const Index = () => {
  const [mode, setMode] = useState<'image' | 'text' | 'tweet' | 'instagram' | 'email' | 'humanizer' | 'translator' | 'blog' | 'essay' | 'twitter-bio' | 'linkedin' | 'wedding-speech' | 'diet' | 'workout' | 'encrypt' | 'photo-encrypt'>('text');

  return (
    <div className="container mx-auto p-8 space-y-8">
      <AnnouncementsBanner />
      <ModeSwitcher 
        mode={mode} 
        onModeChange={setMode}
      />
    </div>
  );
};

export default Index;