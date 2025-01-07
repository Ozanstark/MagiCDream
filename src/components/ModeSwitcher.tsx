import { Image, MessageSquareText, Music4, Twitter, Instagram, Mail, FileText, Globe, Crown, BookOpen, PenTool, UserCircle, Linkedin } from "lucide-react";
import { Button } from "./ui/button";

interface ModeSwitcherProps {
  mode: 'image' | 'text' | 'music' | 'tweet' | 'instagram' | 'email' | 'humanizer' | 'translator' | 'blog' | 'essay' | 'twitter-bio' | 'linkedin';
  onModeChange: (mode: 'image' | 'text' | 'music' | 'tweet' | 'instagram' | 'email' | 'humanizer' | 'translator' | 'blog' | 'essay' | 'twitter-bio' | 'linkedin') => void;
}

const ModeSwitcher = ({ mode, onModeChange }: ModeSwitcherProps) => {
  const modes = [
    { id: 'image', icon: Image, label: 'Image Generator', isPremium: false },
    { id: 'text', icon: MessageSquareText, label: 'Text Generator', isPremium: true },
    { id: 'blog', icon: BookOpen, label: 'Blog Intro Generator', isPremium: true },
    { id: 'essay', icon: PenTool, label: 'Essay Humanizer', isPremium: true },
    { id: 'twitter-bio', icon: UserCircle, label: 'Twitter Bio Generator', isPremium: true },
    { id: 'linkedin', icon: Linkedin, label: 'LinkedIn Headline Generator', isPremium: true },
    { id: 'music', icon: Music4, label: 'Music Generator', isPremium: false },
    { id: 'tweet', icon: Twitter, label: 'Tweet Generator', isPremium: true },
    { id: 'instagram', icon: Instagram, label: 'Instagram Analysis', isPremium: false },
    { id: 'email', icon: Mail, label: 'Email Generator', isPremium: true },
    { id: 'humanizer', icon: FileText, label: 'AI Paragraph Humanizer', isPremium: true },
    { id: 'translator', icon: Globe, label: 'AI Translator', isPremium: true },
  ] as const;

  return (
    <div className="fixed left-4 top-4 flex flex-col gap-2 bg-card p-4 rounded-lg shadow-lg">
      {modes.map((item) => (
        <Button
          key={item.id}
          variant={mode === item.id ? 'default' : 'outline'}
          onClick={() => onModeChange(item.id)}
          className="flex items-center justify-start gap-2 w-full"
        >
          <item.icon className="h-5 w-5" />
          <span className="flex items-center gap-2">
            {item.label}
            {item.isPremium && (
              <Crown className="h-4 w-4 text-yellow-500" />
            )}
          </span>
        </Button>
      ))}
    </div>
  );
};

export default ModeSwitcher;