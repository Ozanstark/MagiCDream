import { Image, MessageSquareText, Twitter, Instagram, Mail, FileText, Globe, Crown, BookOpen, PenTool, UserCircle, Linkedin, Heart, Salad, Dumbbell, Lock, GamepadIcon } from "lucide-react";
import { Button } from "./ui/button";

interface ModeSwitcherProps {
  mode: 'image' | 'text' | 'tweet' | 'instagram' | 'email' | 'humanizer' | 'translator' | 'blog' | 'essay' | 'twitter-bio' | 'linkedin' | 'wedding-speech' | 'diet' | 'workout' | 'encrypt' | 'photo-encrypt' | 'quiz';
  onModeChange: (mode: 'image' | 'text' | 'tweet' | 'instagram' | 'email' | 'humanizer' | 'translator' | 'blog' | 'essay' | 'twitter-bio' | 'linkedin' | 'wedding-speech' | 'diet' | 'workout' | 'encrypt' | 'photo-encrypt' | 'quiz') => void;
}

const ModeSwitcher = ({ mode, onModeChange }: ModeSwitcherProps) => {
  const modes = [
    { id: 'quiz', icon: GamepadIcon, label: 'Takipçi Testi', showWow: false, isPremium: false },
    { id: 'image', icon: Image, label: 'Image Generator', showWow: true, isPremium: true },
    { id: 'text', icon: MessageSquareText, label: 'Text Generator', showWow: false, isPremium: false },
    { id: 'blog', icon: BookOpen, label: 'Blog Intro Generator', showWow: false, isPremium: false },
    { id: 'essay', icon: PenTool, label: 'Essay Humanizer', showWow: false, isPremium: false },
    { id: 'twitter-bio', icon: UserCircle, label: 'Twitter Bio Generator', showWow: false, isPremium: false },
    { id: 'linkedin', icon: Linkedin, label: 'LinkedIn Headline Generator', showWow: false, isPremium: false },
    { id: 'wedding-speech', icon: Heart, label: 'Wedding Speech Generator', showWow: false, isPremium: false },
    { id: 'diet', icon: Salad, label: 'Diet Plan Generator', showWow: true, isPremium: true },
    { id: 'workout', icon: Dumbbell, label: 'Workout Plan Generator', showWow: true, isPremium: true },
    { id: 'tweet', icon: Twitter, label: 'Tweet Generator', showWow: false, isPremium: false },
    { id: 'instagram', icon: Instagram, label: 'Instagram Analysis', showWow: true, isPremium: true },
    { id: 'email', icon: Mail, label: 'Email Generator', showWow: false, isPremium: false },
    { id: 'humanizer', icon: FileText, label: 'AI Paragraph Humanizer', showWow: false, isPremium: false },
    { id: 'translator', icon: Globe, label: 'AI Translator', showWow: false, isPremium: false },
    { id: 'encrypt', icon: Lock, label: 'Message Encryption', showWow: true, isPremium: true },
    { id: 'photo-encrypt', icon: Lock, label: 'Photo Encryption', showWow: true, isPremium: true },
  ] as const;

  return (
    <div className="fixed left-4 top-4 flex flex-col gap-2 bg-card p-4 rounded-lg shadow-lg">
      {modes.map((item) => (
        <Button
          key={item.id}
          variant={mode === item.id ? 'default' : 'outline'}
          onClick={() => onModeChange(item.id)}
          className="flex items-center justify-between w-full relative group"
        >
          <div className="flex items-center gap-2">
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </div>
          {item.isPremium ? (
            <img 
              src="/lovable-uploads/6e858f00-7860-4b5f-b35a-7a25c98a71ff.png"
              alt="WOW effect"
              className="w-12 h-12 transform rotate-12 opacity-90 group-hover:scale-110 transition-transform"
            />
          ) : null}
        </Button>
      ))}
    </div>
  );
};

export default ModeSwitcher;