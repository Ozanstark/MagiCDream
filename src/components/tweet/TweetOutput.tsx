import React from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Copy } from "lucide-react";

interface TweetOutputProps {
  tweet: string;
  onTweetChange: (value: string) => void;
  onCopy: () => void;
}

const TweetOutput = ({ tweet, onTweetChange, onCopy }: TweetOutputProps) => {
  return (
    <div className="space-y-4">
      <Textarea
        value={tweet}
        onChange={(e) => onTweetChange(e.target.value)}
        placeholder="Oluşturulan tweet burada görünecek..."
        className="min-h-[100px] input-premium"
        maxLength={280}
      />
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">
          {tweet.length}/280 karakter
        </span>
        <Button
          onClick={onCopy}
          disabled={!tweet.trim()}
          className="button-primary"
        >
          <Copy className="w-4 h-4 mr-2" />
          Tweeti Kopyala
        </Button>
      </div>
    </div>
  );
};

export default TweetOutput;