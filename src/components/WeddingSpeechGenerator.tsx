import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import GeneratorHeader from "./generator/GeneratorHeader";

const WeddingSpeechGenerator = () => {
  const [role, setRole] = useState("");
  const [coupleNames, setCoupleNames] = useState("");
  const [relationship, setRelationship] = useState("");
  const [memories, setMemories] = useState("");
  const [tone, setTone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedSpeech, setGeneratedSpeech] = useState("");
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!role || !coupleNames || !relationship || !memories || !tone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to generate your speech.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-wedding-speech", {
        body: {
          role,
          coupleNames,
          relationship,
          memories,
          tone,
        },
      });

      if (error) throw error;

      setGeneratedSpeech(data.speech);
      toast({
        title: "Speech Generated!",
        description: "Your wedding speech has been created.",
      });
    } catch (error) {
      console.error("Error generating speech:", error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate speech. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <GeneratorHeader
        title="Wedding Speech Generator"
        description="Create a memorable wedding speech that perfectly captures your feelings and memories."
      />

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Your role in the wedding</label>
          <Input
            placeholder="Best Man, Maid of Honor, Father of the Bride..."
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="input-premium"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Names of the couple</label>
          <Input
            placeholder="e.g., John and Jane"
            value={coupleNames}
            onChange={(e) => setCoupleNames(e.target.value)}
            className="input-premium"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Your relationship with the couple</label>
          <Textarea
            placeholder="Describe how you know the couple..."
            value={relationship}
            onChange={(e) => setRelationship(e.target.value)}
            className="input-premium min-h-[100px]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Key memories or stories to include</label>
          <Textarea
            placeholder="Share some memorable moments or stories about the couple"
            value={memories}
            onChange={(e) => setMemories(e.target.value)}
            className="input-premium min-h-[150px]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Desired tone</label>
          <Input
            placeholder="e.g., heartfelt with humor, formal and elegant..."
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="input-premium"
          />
        </div>

        <Button
          onClick={handleGenerate}
          disabled={isLoading}
          className="button-primary w-full"
        >
          <Wand2 className="mr-2 h-4 w-4" />
          {isLoading ? "Generating Speech..." : "Generate Speech"}
        </Button>

        {generatedSpeech && (
          <div className="mt-8 p-6 bg-card rounded-lg border border-border/20">
            <h3 className="text-lg font-semibold mb-4">Your Generated Speech</h3>
            <div className="whitespace-pre-wrap">{generatedSpeech}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeddingSpeechGenerator;