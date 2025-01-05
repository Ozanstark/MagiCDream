import { Image, Text } from "lucide-react";
import { Button } from "./ui/button";

interface ModeSwitcherProps {
  currentMode: "image" | "text";
  onModeChange: (mode: "image" | "text") => void;
}

const ModeSwitcher = ({ currentMode, onModeChange }: ModeSwitcherProps) => {
  return (
    <div className="flex gap-2 absolute top-4 left-4">
      <Button
        variant={currentMode === "image" ? "default" : "outline"}
        size="icon"
        onClick={() => onModeChange("image")}
      >
        <Image className="h-4 w-4" />
      </Button>
      <Button
        variant={currentMode === "text" ? "default" : "outline"}
        size="icon"
        onClick={() => onModeChange("text")}
      >
        <Text className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ModeSwitcher;