import React from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Wand2 } from "lucide-react";

interface TweetInputProps {
  topic: string;
  description: string;
  isGenerating: boolean;
  onTopicChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onGenerate: () => void;
}

const TweetInput = ({
  topic,
  description,
  isGenerating,
  onTopicChange,
  onDescriptionChange,
  onGenerate,
}: TweetInputProps) => {
  return (
    <div className="space-y-4">
      <Input
        value={topic}
        onChange={(e) => onTopicChange(e.target.value)}
        placeholder="Tweet konusunu girin..."
        className="input-premium"
      />
      <Input
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        placeholder="İsteğe bağlı kısa açıklama..."
        className="input-premium"
      />
      <Button
        onClick={onGenerate}
        disabled={isGenerating || !topic.trim()}
        className="w-full button-primary"
      >
        {isGenerating ? (
          "Tweet Oluşturuluyor..."
        ) : (
          <>
            <Wand2 className="w-4 h-4 mr-2" />
            Tweet Oluştur
          </>
        )}
      </Button>
    </div>
  );
};

export default TweetInput;