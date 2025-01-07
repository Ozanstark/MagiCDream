import { Image, MessageSquareText, Music4, Twitter, Instagram, Mail, FileText } from "lucide-react";
import { Button } from "./ui/button";

interface ModeSwitcherProps {
  mode: 'image' | 'text' | 'music' | 'tweet' | 'instagram' | 'email' | 'humanizer';
  onModeChange: (mode: 'image' | 'text' | 'music' | 'tweet' | 'instagram' | 'email' | 'humanizer') => void;
}

const ModeSwitcher = ({ mode, onModeChange }: ModeSwitcherProps) => {
  const modes = [
    { id: 'image', icon: Image, label: 'Image Generator' },
    { id: 'text', icon: MessageSquareText, label: 'Text Generator' },
    { id: 'music', icon: Music4, label: 'Music Generator' },
    { id: 'tweet', icon: Twitter, label: 'Tweet Generator' },
    { id: 'instagram', icon: Instagram, label: 'Instagram Analysis' },
    { id: 'email', icon: Mail, label: 'Email Generator' },
    { id: 'humanizer', icon: FileText, label: 'AI Paragraph Humanizer' },
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
          <span>{item.label}</span>
        </Button>
      ))}
    </div>
  );
};

export default ModeSwitcher;