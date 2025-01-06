import { Image, MessageSquareText, Scan } from "lucide-react";
import { Button } from "./ui/button";

interface ModeSwitcherProps {
  mode: 'image' | 'text' | 'analyze';
  onModeChange: (mode: 'image' | 'text' | 'analyze') => void;
}

const ModeSwitcher = ({ mode, onModeChange }: ModeSwitcherProps) => {
  return (
    <div className="flex gap-2 absolute left-4 top-4">
      <Button
        variant={mode === 'image' ? 'default' : 'outline'}
        size="icon"
        onClick={() => onModeChange('image')}
        className="w-10 h-10"
      >
        <Image className="h-5 w-5" />
      </Button>
      <Button
        variant={mode === 'text' ? 'default' : 'outline'}
        size="icon"
        onClick={() => onModeChange('text')}
        className="w-10 h-10"
      >
        <MessageSquareText className="h-5 w-5" />
      </Button>
      <Button
        variant={mode === 'analyze' ? 'default' : 'outline'}
        size="icon"
        onClick={() => onModeChange('analyze')}
        className="w-10 h-10"
        title="Analyze Image Features"
      >
        <Scan className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default ModeSwitcher;