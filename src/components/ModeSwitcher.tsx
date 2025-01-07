import { Image, MessageSquareText, Music4, Twitter, Instagram, Mail, FileText, Globe, Crown, BookOpen, PenTool, UserCircle, Linkedin, Heart, Salad, Dumbbell, Lock } from "lucide-react";
import { Button } from "./ui/button";

interface ModeSwitcherProps {
  mode: 'image' | 'text' | 'music' | 'tweet' | 'instagram' | 'email' | 'humanizer' | 'translator' | 'blog' | 'essay' | 'twitter-bio' | 'linkedin' | 'wedding-speech' | 'diet' | 'workout' | 'encrypt';
  onModeChange: (mode: 'image' | 'text' | 'music' | 'tweet' | 'instagram' | 'email' | 'humanizer' | 'translator' | 'blog' | 'essay' | 'twitter-bio' | 'linkedin' | 'wedding-speech' | 'diet' | 'workout' | 'encrypt') => void;
}

const ModeSwitcher = ({ mode, onModeChange }: ModeSwitcherProps) => {
  const modes = [
    { id: 'image', icon: Image, label: 'Image Generator', showWow: true },
    { id: 'text', icon: MessageSquareText, label: 'Text Generator', showWow: false },
    { id: 'blog', icon: BookOpen, label: 'Blog Intro Generator', showWow: false },
    { id: 'essay', icon: PenTool, label: 'Essay Humanizer', showWow: false },
    { id: 'twitter-bio', icon: UserCircle, label: 'Twitter Bio Generator', showWow: false },
    { id: 'linkedin', icon: Linkedin, label: 'LinkedIn Headline Generator', showWow: false },
    { id: 'wedding-speech', icon: Heart, label: 'Wedding Speech Generator', showWow: false },
    { id: 'diet', icon: Salad, label: 'Diet Plan Generator', showWow: true },
    { id: 'workout', icon: Dumbbell, label: 'Workout Plan Generator', showWow: true },
    { id: 'music', icon: Music4, label: 'Music Generator', showWow: false },
    { id: 'tweet', icon: Twitter, label: 'Tweet Generator', showWow: false },
    { id: 'instagram', icon: Instagram, label: 'Instagram Analysis', showWow: true },
    { id: 'email', icon: Mail, label: 'Email Generator', showWow: false },
    { id: 'humanizer', icon: FileText, label: 'AI Paragraph Humanizer', showWow: false },
    { id: 'translator', icon: Globe, label: 'AI Translator', showWow: false },
    { id: 'encrypt', icon: Lock, label: 'Message Encryption', showWow: true },
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
            {item.showWow && (
              <img 
                src="/lovable-uploads/6e858f00-7860-4b5f-b35a-7a25c98a71ff.png"
                alt="WOW effect"
                className="w-12 h-12 transform rotate-12 opacity-90 group-hover:scale-110 transition-transform"
              />
            )}
          </span>
        </Button>
      ))}
    </div>
  );
};

export default ModeSwitcher;