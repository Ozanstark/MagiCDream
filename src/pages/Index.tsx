import ModeSwitcher from "@/components/ModeSwitcher";
import { AnnouncementsBanner } from "@/components/AnnouncementsBanner";
import { ImageGenerator } from "@/components/ImageGenerator";
import { TextGenerator } from "@/components/TextGenerator";
import { BlogIntroGenerator } from "@/components/BlogIntroGenerator";
import { EssayHumanizer } from "@/components/EssayHumanizer";
import { TwitterBioGenerator } from "@/components/TwitterBioGenerator";
import { LinkedInHeadlineGenerator } from "@/components/LinkedInHeadlineGenerator";
import { WeddingSpeechGenerator } from "@/components/WeddingSpeechGenerator";
import { DietPlanGenerator } from "@/components/DietPlanGenerator";
import { WorkoutPlanGenerator } from "@/components/WorkoutPlanGenerator";
import { TweetGenerator } from "@/components/TweetGenerator";
import { InstagramAnalyzer } from "@/components/InstagramAnalyzer";
import { EmailGenerator } from "@/components/EmailGenerator";
import { ParagraphHumanizer } from "@/components/ParagraphHumanizer";
import { Translator } from "@/components/Translator";
import { MessageInputForm } from "@/components/MessageInputForm";
import { PhotoEncryption } from "@/components/PhotoEncryption";
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
            {mode === 'text' && <TextGenerator />}
            {mode === 'image' && <ImageGenerator />}
            {mode === 'tweet' && <TweetGenerator />}
            {mode === 'instagram' && <InstagramAnalyzer />}
            {mode === 'email' && <EmailGenerator />}
            {mode === 'humanizer' && <ParagraphHumanizer />}
            {mode === 'translator' && <Translator />}
            {mode === 'blog' && <BlogIntroGenerator />}
            {mode === 'essay' && <EssayHumanizer />}
            {mode === 'twitter-bio' && <TwitterBioGenerator />}
            {mode === 'linkedin' && <LinkedInHeadlineGenerator />}
            {mode === 'wedding-speech' && <WeddingSpeechGenerator />}
            {mode === 'diet' && <DietPlanGenerator />}
            {mode === 'workout' && <WorkoutPlanGenerator />}
            {mode === 'encrypt' && <MessageInputForm />}
            {mode === 'photo-encrypt' && <PhotoEncryption />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;