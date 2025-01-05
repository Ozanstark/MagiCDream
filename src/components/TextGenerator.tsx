import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useToast } from "./ui/use-toast";
import { Wand2 } from "lucide-react";
import ModelSelector from "./ModelSelector";
import { ModelType } from "@/types/models";

const TextGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<ModelType>({
    id: "gpt4",
    name: "GPT-4",
    apiUrl: "https://api.openai.com/v1/chat/completions",
    description: "Most capable model for text generation"
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
      // Placeholder for API call - to be implemented
      const response = "This is a placeholder response. The API integration will be implemented in the next step.";
      setResponse(response);
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      generateText();
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center gap-4">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold rainbow-text">
          AI Dream Text to Text
        </h1>
        <p className="text-lg md:text-xl text-gray-700 max-w-2xl">
          Transform your ideas into engaging conversations with AI. Start dreaming.
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
            placeholder="What would you like to discuss?"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 bg-white h-10"
          />
          <Button
            onClick={generateText}
            disabled={isLoading}
            className="bg-primary hover:bg-primary/90 h-10"
          >
            <Wand2 className="mr-2 h-4 w-4" />
            {isLoading ? "Generating..." : "Generate"}
          </Button>
        </div>
      </div>

      {response && (
        <div className="w-full max-w-2xl mt-4">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="whitespace-pre-wrap">{response}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TextGenerator;