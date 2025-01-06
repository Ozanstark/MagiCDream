import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Music4 } from "lucide-react";

const MusicGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const generateMusic = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Hata",
        description: "Lütfen önce bir prompt girin",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/facebook/musicgen-small",
        {
          headers: {
            Authorization: "Bearer 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",
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({ inputs: prompt }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate music");
      }

      const audioBlob = await response.blob();
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
      
      toast({
        title: "Başarılı",
        description: "Müzik başarıyla oluşturuldu!",
      });
    } catch (error) {
      toast({
        title: "Hata",
        description: error instanceof Error ? error.message : "Müzik oluşturulurken bir hata oluştu",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-6">
        <h1 className="text-5xl md:text-6xl font-extrabold rainbow-text tracking-tight">
          AI Dream Text to Music
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4 border border-primary/20 py-3 rounded-lg bg-card/50 backdrop-blur-sm">
          Transform your text descriptions into magical musical compositions. Let AI create unique melodies from your words.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <Input
          placeholder="Describe the music you want to create..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="flex-1 input-premium"
        />
        <Button
          onClick={generateMusic}
          disabled={isLoading}
          className="button-primary"
        >
          <Wand2 className="mr-2 h-4 w-4" />
          {isLoading ? "Generating..." : "Generate"}
        </Button>
      </div>

      {audioUrl && (
        <div className="mt-6 p-6 bg-card rounded-lg border border-primary/20 shadow-lg backdrop-blur-sm">
          <audio controls className="w-full">
            <source src={audioUrl} type="audio/wav" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
};

export default MusicGenerator;