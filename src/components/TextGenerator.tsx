import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Wand2 } from "lucide-react";
import { useToast } from "./ui/use-toast";
import ModelSelector from "./ModelSelector";
import { ModelType } from "@/types/models";

const TextGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedText, setGeneratedText] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<ModelType>({
    id: "gpt-model",
    name: "GPT Model",
    apiUrl: "https://api-inference.huggingface.co/models/gpt2",
    description: "Text generation model"
  });
  
  const { toast } = useToast();

  const generateText = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt first",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(selectedModel.apiUrl, {
        headers: {
          Authorization: "Bearer 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",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ inputs: prompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate text');
      }

      const result = await response.json();
      setGeneratedText(result[0].generated_text);
    } catch (error) {
      console.error('API Error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error generating text. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center gap-4">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold rainbow-text">
          AI Dream Text to Text
        </h1>
        <p className="text-lg md:text-xl text-gray-700 max-w-2xl">
          Transform your ideas into eloquent text. Start dreaming.
        </p>
      </div>

      <div className="w-full max-w-2xl flex flex-col gap-2">
        <ModelSelector
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
          disabled={isLoading}
        />
        
        <div className="flex flex-col md:flex-row gap-2">
          <Input
            placeholder="Describe what text you want to generate"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="flex-1 bg-white h-10"
          />
          <Button
            onClick={generateText}
            disabled={isLoading}
            className="bg-primary hover:bg-primary/90 h-10"
          >
            <Wand2 className="mr-2 h-4 w-4" />
            {isLoading ? "Generating..." : "Generate Text"}
          </Button>
        </div>

        {generatedText && (
          <div className="mt-4 p-4 bg-white rounded-lg shadow-lg">
            <p className="text-gray-800 whitespace-pre-wrap">{generatedText}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TextGenerator;