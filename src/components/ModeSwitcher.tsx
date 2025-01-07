import { Image, MessageSquareText, Music4, Twitter, Instagram, Mail, FileText, Globe, Crown, BookOpen, PenTool, UserCircle, Linkedin, Heart, Salad, Dumbbell, Lock } from "lucide-react";
import { Button } from "./ui/button";

interface ModeSwitcherProps {
  mode: 'image' | 'text' | 'music' | 'tweet' | 'instagram' | 'email' | 'humanizer' | 'translator' | 'blog' | 'essay' | 'twitter-bio' | 'linkedin' | 'wedding-speech' | 'diet' | 'workout' | 'encrypt';
  onModeChange: (mode: 'image' | 'text' | 'music' | 'tweet' | 'instagram' | 'email' | 'humanizer' | 'translator' | 'blog' | 'essay' | 'twitter-bio' | 'linkedin' | 'wedding-speech' | 'diet' | 'workout' | 'encrypt') => void;
}

const ModeSwitcher = ({ mode, onModeChange }: ModeSwitcherProps) => {
  const modes = [
    { id: 'image', icon: Image, label: 'Image Generator', isPremium: false },
    { id: 'text', icon: MessageSquareText, label: 'Text Generator', isPremium: true },
    { id: 'blog', icon: BookOpen, label: 'Blog Intro Generator', isPremium: true },
    { id: 'essay', icon: PenTool, label: 'Essay Humanizer', isPremium: true },
    { id: 'twitter-bio', icon: UserCircle, label: 'Twitter Bio Generator', isPremium: true },
    { id: 'linkedin', icon: Linkedin, label: 'LinkedIn Headline Generator', isPremium: true },
    { id: 'wedding-speech', icon: Heart, label: 'Wedding Speech Generator', isPremium: true },
    { id: 'diet', icon: Salad, label: 'Diet Plan Generator', isPremium: true },
    { id: 'workout', icon: Dumbbell, label: 'Workout Plan Generator', isPremium: true },
    { id: 'music', icon: Music4, label: 'Music Generator', isPremium: false },
    { id: 'tweet', icon: Twitter, label: 'Tweet Generator', isPremium: true },
    { id: 'instagram', icon: Instagram, label: 'Instagram Analysis', isPremium: false },
    { id: 'email', icon: Mail, label: 'Email Generator', isPremium: true },
    { id: 'humanizer', icon: FileText, label: 'AI Paragraph Humanizer', isPremium: true },
    { id: 'translator', icon: Globe, label: 'AI Translator', isPremium: true },
    { id: 'encrypt', icon: Lock, label: 'Message Encryption', isPremium: true },
  ] as const;

  return (
    <div className="fixed left-4 top-4 flex flex-col gap-2 bg-card p-4 rounded-lg shadow-lg">
      {modes.map((item) => (
        <Button
          key={item.id}
          variant={mode === item.id ? 'default' : 'outline'}
          onClick={() => onModeChange(item.id)}
          className="flex items-center justify-start gap-2 w-full relative group"
        >
          <item.icon className="h-5 w-5" />
          <span className="flex items-center gap-2">
            {item.label}
            {item.isPremium && (
              <div className="relative">
                <Crown className="h-4 w-4 text-yellow-500" />
                <img 
                  src="/lovable-uploads/6e858f00-7860-4b5f-b35a-7a25c98a71ff.png"
                  alt="WOW effect"
                  className="absolute -top-3 -right-3 w-6 h-6 transform rotate-12 opacity-90 group-hover:scale-110 transition-transform"
                />
              </div>
            )}
          </span>
        </Button>
      ))}
    </div>
  );
};

export default ModeSwitcher;