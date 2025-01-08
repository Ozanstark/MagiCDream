import ModeSwitcher from "@/components/ModeSwitcher";
import { AnnouncementsBanner } from "@/components/AnnouncementsBanner";
import { useState } from "react";

const Index = () => {
  const [mode, setMode] = useState<'image' | 'text' | 'tweet' | 'instagram' | 'email' | 'humanizer' | 'translator' | 'blog' | 'essay' | 'twitter-bio' | 'linkedin' | 'wedding-speech' | 'diet' | 'workout' | 'encrypt' | 'photo-encrypt'>('text');

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-[320px] bg-card shadow-lg z-50">
        <ModeSwitcher 
          mode={mode} 
          onModeChange={setMode}
        />
      </div>
      
      {/* Main Content */}
      <main className="flex-1 ml-[320px] min-h-screen">
        <div className="container py-8 px-4">
          <AnnouncementsBanner />
          
          {/* Content based on selected mode */}
          <div className="mt-8">
            {mode === 'text' && <div className="p-6 bg-card rounded-lg">Text Generator Content</div>}
            {mode === 'image' && <div className="p-6 bg-card rounded-lg">Image Generator Content</div>}
            {mode === 'tweet' && <div className="p-6 bg-card rounded-lg">Tweet Generator Content</div>}
            {mode === 'instagram' && <div className="p-6 bg-card rounded-lg">Instagram Analysis Content</div>}
            {mode === 'email' && <div className="p-6 bg-card rounded-lg">Email Generator Content</div>}
            {mode === 'humanizer' && <div className="p-6 bg-card rounded-lg">AI Paragraph Humanizer Content</div>}
            {mode === 'translator' && <div className="p-6 bg-card rounded-lg">AI Translator Content</div>}
            {mode === 'blog' && <div className="p-6 bg-card rounded-lg">Blog Intro Generator Content</div>}
            {mode === 'essay' && <div className="p-6 bg-card rounded-lg">Essay Humanizer Content</div>}
            {mode === 'twitter-bio' && <div className="p-6 bg-card rounded-lg">Twitter Bio Generator Content</div>}
            {mode === 'linkedin' && <div className="p-6 bg-card rounded-lg">LinkedIn Headline Generator Content</div>}
            {mode === 'wedding-speech' && <div className="p-6 bg-card rounded-lg">Wedding Speech Generator Content</div>}
            {mode === 'diet' && <div className="p-6 bg-card rounded-lg">Diet Plan Generator Content</div>}
            {mode === 'workout' && <div className="p-6 bg-card rounded-lg">Workout Plan Generator Content</div>}
            {mode === 'encrypt' && <div className="p-6 bg-card rounded-lg">Message Encryption Content</div>}
            {mode === 'photo-encrypt' && <div className="p-6 bg-card rounded-lg">Photo Encryption Content</div>}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;