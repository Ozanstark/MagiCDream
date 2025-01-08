import ModeSwitcher from "@/components/ModeSwitcher";
import { AnnouncementsBanner } from "@/components/AnnouncementsBanner";
import { useState } from "react";

const Index = () => {
  const [mode, setMode] = useState<'image' | 'text' | 'tweet' | 'instagram' | 'email' | 'humanizer' | 'translator' | 'blog' | 'essay' | 'twitter-bio' | 'linkedin' | 'wedding-speech' | 'diet' | 'workout' | 'encrypt' | 'photo-encrypt'>('text');

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full">
        <ModeSwitcher 
          mode={mode} 
          onModeChange={setMode}
        />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 ml-[320px]">
        <div className="container p-8 space-y-8">
          <AnnouncementsBanner />
        </div>
      </div>
    </div>
  );
};

export default Index;