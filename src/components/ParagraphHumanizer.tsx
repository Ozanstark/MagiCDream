import { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Card } from "./ui/card";
import { useToast } from "./ui/use-toast";
import TextModelSelector from "./TextModelSelector";
import { AVAILABLE_TEXT_MODELS, TextModelType } from "@/types/text-models";

const ParagraphHumanizer = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<TextModelType>(AVAILABLE_TEXT_MODELS[0]);
  const { toast } = useToast();

  const handleHumanize = async () => {
    if (!input.trim()) {
      toast({
        title: "Error",
        description: "Please enter some text to humanize",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Here we would integrate with an AI model to humanize the text
      // For now, we'll just simulate the process
      const humanizedText = input
        .split(".")
        .map(sentence => sentence.trim())
        .filter(Boolean)
        .join(". ");
      
      setOutput(humanizedText);
      toast({
        title: "Success",
        description: "Text has been humanized!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to humanize text",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl space-y-4">
      <Card className="p-6">
        <div className="space-y-4">
          <TextModelSelector
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
            disabled={isLoading}
          />
          <Textarea
            placeholder="Enter your text here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[200px]"
          />
          <Button 
            onClick={handleHumanize}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Humanizing..." : "Humanize Text"}
          </Button>
          {output && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Humanized Output:</h3>
              <Card className="p-4 bg-secondary/10">
                <p className="whitespace-pre-wrap">{output}</p>
              </Card>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ParagraphHumanizer;