import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Wand2 } from "lucide-react";
import { useToast } from "./ui/use-toast";
import { pipeline, TextToAudioPipeline } from "@huggingface/transformers";
import GeneratorHeader from "./generator/GeneratorHeader";
import { useCredits } from "@/hooks/useCredits";
import { supabase } from "@/integrations/supabase/client";

const MusicGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const { checkCredits, deductCredits } = useCredits();

  const generateMusic = async () => {
    try {
      setIsGenerating(true);

      // Check if user has enough credits
      const hasCredits = await checkCredits(5);
      if (!hasCredits) {
        toast({
          title: "Yetersiz kredi",
          description: "Bu özelliği kullanmak için yeterli krediniz bulunmuyor.",
          variant: "destructive",
        });
        return;
      }

      // Initialize the model
      const synthesizer = await pipeline(
        "text-to-audio",
        "facebook/musicgen-small"
      ) as TextToAudioPipeline;

      // Generate music
      const audioData = await synthesizer(prompt);

      // Convert audio data to blob
      const audioArrayBuffer = await audioData.arrayBuffer();
      const blob = new Blob([audioArrayBuffer], { type: "audio/wav" });
      const audioUrl = URL.createObjectURL(blob);

      // Save to Supabase
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("generated_music").insert({
          user_id: user.id,
          prompt,
          audio_url: audioUrl,
          model_id: "facebook/musicgen-small",
        });

        // Deduct credits
        await deductCredits(5, "music_generation");
      }

      toast({
        title: "Müzik oluşturuldu!",
        description: "Müziğiniz başarıyla oluşturuldu.",
      });

    } catch (error) {
      console.error("Error generating music:", error);
      toast({
        title: "Hata!",
        description: "Müzik oluşturulurken bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <GeneratorHeader
        title="AI Müzik Üretici"
        description="Yapay zeka ile istediğiniz tarzda müzik üretin"
      />

      <div className="space-y-4">
        <Input
          placeholder="Müziğinizi tanımlayın (örn: 'hızlı tempolu bir elektronik dans müziği')"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="input-premium"
        />

        <Button
          onClick={generateMusic}
          disabled={isGenerating || !prompt}
          className="button-primary w-full sm:w-auto"
        >
          <Wand2 className="mr-2 h-4 w-4" />
          {isGenerating ? "Üretiliyor..." : "Müzik Üret"}
        </Button>
      </div>
    </div>
  );
};

export default MusicGenerator;