import { Image, MessageSquareText, Music4, Twitter, Instagram, Mail, FileText, Globe, Crown, BookOpen, PenTool, UserCircle, Linkedin, Heart, Salad, Dumbbell, Lock } from "lucide-react";
import { Button } from "./ui/button";

interface ModeSwitcherProps {
  mode: 'image' | 'text' | 'music' | 'tweet' | 'instagram' | 'email' | 'humanizer' | 'translator' | 'blog' | 'essay' | 'twitter-bio' | 'linkedin' | 'wedding-speech' | 'diet' | 'workout' | 'encrypt' | 'photo-encrypt';
  onModeChange: (mode: 'image' | 'text' | 'music' | 'tweet' | 'instagram' | 'email' | 'humanizer' | 'translator' | 'blog' | 'essay' | 'twitter-bio' | 'linkedin' | 'wedding-speech' | 'diet' | 'workout' | 'encrypt' | 'photo-encrypt') => void;
}

const ModeSwitcher = ({ mode, onModeChange }: ModeSwitcherProps) => {
  const modes = [
    { id: 'image', icon: Image, label: 'Image Generator', showWow: true, isPremium: true },
    { id: 'instagram', icon: Instagram, label: 'Instagram Analysis', showWow: true, isPremium: true },
    { id: 'diet', icon: Salad, label: 'Diet Plan Generator', showWow: true, isPremium: true },
    { id: 'workout', icon: Dumbbell, label: 'Workout Plan Generator', showWow: true, isPremium: true },
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
          <img 
            src="/lovable-uploads/6e858f00-7860-4b5f-b35a-7a25c98a71ff.png"
            alt="WOW effect"
            className="w-12 h-12 transform rotate-12 opacity-90 group-hover:scale-110 transition-transform"
          />
        </Button>
      ))}
    </div>
  );
};

export default ModeSwitcher;