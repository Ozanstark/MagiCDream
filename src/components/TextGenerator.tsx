import { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import ComponentHeader from "./shared/ComponentHeader";
import { useToast } from "./ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useApiLimits } from "@/hooks/useApiLimits";

const TextGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [generatedText, setGeneratedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { checkTextGeneration } = useApiLimits();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt to generate text.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Check credits before making the API call
      const canProceed = await checkTextGeneration();
      if (!canProceed) {
        toast({
          title: "Error",
          description: "Insufficient credits to generate text",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke("generate-text", {
        body: { prompt },
      });

      if (error) throw error;

      if (data?.generatedText) {
        setGeneratedText(data.generatedText);
        toast({
          title: "Success!",
          description: "Text generated successfully.",
        });
      } else {
        throw new Error("Failed to generate text");
      }
    } catch (error) {
      console.error("Error generating text:", error);
      toast({
        title: "Error",
        description: "Failed to generate text. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4 px-4 sm:px-6 sm:space-y-8">
      <ComponentHeader
        title="Craft Your Words"
        description="Transform your ideas into eloquent prose. Let AI enhance your writing while maintaining your unique voice."
      />
      
      <Textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your text prompt here..."
        className="min-h-[200px] bg-card text-foreground border border-border/20"
      />
      <Button onClick={handleGenerate} disabled={isLoading} className="w-full">
        {isLoading ? "Generating..." : "Generate Text"}
      </Button>

      {generatedText && (
        <div className="mt-6 p-4 bg-card rounded-lg border border-border/20">
          <h2 className="text-lg font-semibold mb-2">Generated Text:</h2>
          <p className="whitespace-pre-wrap">{generatedText}</p>
          <Button
            onClick={() => navigator.clipboard.writeText(generatedText)}
            variant="outline"
            className="mt-4"
          >
            Copy to Clipboard
          </Button>
        </div>
      )}
    </div>
  );
};

export default TextGenerator;