import { useState } from "react";
import ModeSwitcher from "@/components/ModeSwitcher";
import AdminModeSwitcher from "@/components/AdminModeSwitcher";
import TextGenerator from "@/components/TextGenerator";
import ImageGenerator from "@/components/ImageGenerator";
import TweetGenerator from "@/components/TweetGenerator";
import InstagramAnalyzer from "@/components/InstagramAnalyzer";
import EmailGenerator from "@/components/EmailGenerator";
import ParagraphHumanizer from "@/components/ParagraphHumanizer";
import Translator from "@/components/Translator";
import BlogIntroGenerator from "@/components/BlogIntroGenerator";
import EssayHumanizer from "@/components/EssayHumanizer";
import TwitterBioGenerator from "@/components/TwitterBioGenerator";
import LinkedInHeadlineGenerator from "@/components/LinkedInHeadlineGenerator";
import WeddingSpeechGenerator from "@/components/WeddingSpeechGenerator";
import DietPlanGenerator from "@/components/DietPlanGenerator";
import WorkoutPlanGenerator from "@/components/WorkoutPlanGenerator";
import EncryptedMessage from "@/components/EncryptedMessage";
import PhotoEncryption from "@/components/PhotoEncryption";
import Credits from "@/components/Credits";

const Index = () => {
  const [mode, setMode] = useState<
    | "image"
    | "text"
    | "tweet"
    | "instagram"
    | "email"
    | "humanizer"
    | "translator"
    | "blog"
    | "essay"
    | "twitter-bio"
    | "linkedin"
    | "wedding-speech"
    | "diet"
    | "workout"
    | "encrypt"
    | "photo-encrypt"
  >("image");

  const getComponent = () => {
    switch (mode) {
      case "text":
        return <TextGenerator />;
      case "tweet":
        return <TweetGenerator />;
      case "instagram":
        return <InstagramAnalyzer />;
      case "email":
        return <EmailGenerator />;
      case "humanizer":
        return <ParagraphHumanizer />;
      case "translator":
        return <Translator />;
      case "blog":
        return <BlogIntroGenerator />;
      case "essay":
        return <EssayHumanizer />;
      case "twitter-bio":
        return <TwitterBioGenerator />;
      case "linkedin":
        return <LinkedInHeadlineGenerator />;
      case "wedding-speech":
        return <WeddingSpeechGenerator />;
      case "diet":
        return <DietPlanGenerator />;
      case "workout":
        return <WorkoutPlanGenerator />;
      case "encrypt":
        return <EncryptedMessage />;
      case "photo-encrypt":
        return <PhotoEncryption />;
      default:
        return <ImageGenerator />;
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center gap-4 relative">
      <div className="fixed top-4 right-4 z-50">
        <Credits />
      </div>
      <div className="fixed left-4 top-4 flex flex-col gap-4">
        <ModeSwitcher mode={mode} onModeChange={setMode} />
        <AdminModeSwitcher mode={mode} onModeChange={setMode} />
      </div>
      <div className="ml-64">{getComponent()}</div>
    </div>
  );
};

export default Index;