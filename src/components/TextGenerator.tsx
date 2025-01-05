import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { MessageSquare } from "lucide-react";
import { useToast } from "./ui/use-toast";

const TextGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
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
      const result = "This is a placeholder response. The actual API integration will be implemented later.";
      setResponse(result);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error generating text",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold rainbow-text">
          AI Dream Text to Text
        </h1>
        <p className="text-lg md:text-xl text-gray-700 max-w-2xl">
          Transform your ideas into engaging conversations with AI.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-2">
        <Input
          placeholder="Enter your prompt here..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="flex-1 bg-white h-10"
        />
        <Button
          onClick={generateText}
          disabled={isLoading}
          className="bg-primary hover:bg-primary/90 h-10"
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          {isLoading ? "Generating..." : "Generate"}
        </Button>
      </div>

      {response && (
        <div className="mt-4 p-4 bg-white rounded-lg shadow-lg">
          <p className="whitespace-pre-wrap">{response}</p>
        </div>
      )}
    </div>
  );
};

export default TextGenerator;