import { Image, Text } from "lucide-react";
import { Button } from "./ui/button";

interface ModeSwitcherProps {
  currentMode: 'image' | 'text';
  onModeChange: (mode: 'image' | 'text') => void;
}

const ModeSwitcher = ({ currentMode, onModeChange }: ModeSwitcherProps) => {
  return (
    <div className="flex gap-2 justify-center mb-6">
      <Button
        variant={currentMode === 'image' ? 'default' : 'outline'}
        onClick={() => onModeChange('image')}
      >
        <Image className="mr-2 h-4 w-4" />
        Image
      </Button>
      <Button
        variant={currentMode === 'text' ? 'default' : 'outline'}
        onClick={() => onModeChange('text')}
      >
        <Text className="mr-2 h-4 w-4" />
        Text
      </Button>
    </div>
  );
};

export default ModeSwitcher;