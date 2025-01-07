import ComponentHeader from "./shared/ComponentHeader";
import { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const WeddingSpeechGenerator = () => {
  const [speech, setSpeech] = useState("");
  const { toast } = useToast();

  const handleGenerateSpeech = async () => {
    if (!speech.trim()) {
      toast({
        title: "Error",
        description: "Please enter a speech prompt.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke("generate-wedding-speech", {
        body: { prompt: speech },
      });

      if (error) throw error;

      setSpeech(data.speech);
      toast({
        title: "Success!",
        description: "Your wedding speech has been generated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate speech. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4 px-4 sm:px-6 sm:space-y-8">
      <ComponentHeader
        title="Create Memorable Moments"
        description="Craft heartfelt wedding speeches that touch hearts and create lasting memories. Express your love and joy with the perfect words."
      />
      
      <Textarea
        value={speech}
        onChange={(e) => setSpeech(e.target.value)}
        placeholder="Enter your speech prompt here..."
        className="min-h-[200px] bg-[#1a1b26] text-white border-gray-700 resize-none"
      />
      <Button onClick={handleGenerateSpeech} className="w-full">
        Generate Speech
      </Button>
    </div>
  );
};

export default WeddingSpeechGenerator;
