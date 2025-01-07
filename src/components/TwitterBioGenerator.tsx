import { useState } from "react";
import { Button } from "./ui/button";
import { Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useApiLimits } from "@/hooks/useApiLimits";
import { supabase } from "@/integrations/supabase/client";
import BioForm from "./twitter-bio/BioForm";
import GeneratedBio from "./twitter-bio/GeneratedBio";
import ComponentHeader from "./shared/ComponentHeader";

const TwitterBioGenerator = () => {
  const [username, setUsername] = useState("");
  const [interests, setInterests] = useState("");
  const [tone, setTone] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { checkTwitterBio } = useApiLimits();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !interests || !tone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields before generating.",
        variant: "destructive",
      });
      return;
    }

    const canProceed = await checkTwitterBio();
    if (!canProceed) return;

    setIsLoading(true);
    try {
      const prompt = `Create a compelling Twitter bio (maximum 160 characters) for someone with the following details:
      Username: ${username}
      Interests/Expertise: ${interests}
      Tone of voice: ${tone}
      
      Make it engaging, concise, and memorable. Include relevant emojis if appropriate.`;

      const { data, error } = await supabase.functions.invoke('generate-text', {
        body: { prompt },
      });

      if (error) throw error;

      if (data && typeof data === 'string') {
        setResponse(data);
      } else {
        console.error('Unexpected response format:', data);
        throw new Error('Unexpected response format from server');
      }
    } catch (error) {
      console.error("Bio generation error:", error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate Twitter bio. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <ComponentHeader
        title="Twitter Bio Generator"
        description="Create a compelling Twitter bio that captures your essence in 160 characters."
      />

      <form onSubmit={handleSubmit} className="space-y-4">
        <BioForm
          username={username}
          interests={interests}
          tone={tone}
          onUsernameChange={setUsername}
          onInterestsChange={setInterests}
          onToneChange={setTone}
        />

        <Button
          type="submit"
          className="w-full button-primary"
          disabled={isLoading}
        >
          {isLoading ? (
            "Generating..."
          ) : (
            <>
              <Wand2 className="mr-2 h-4 w-4" />
              Generate Bio
            </>
          )}
        </Button>
      </form>

      <GeneratedBio bio={response} />
    </div>
  );
};

export default TwitterBioGenerator;