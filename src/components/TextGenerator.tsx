import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { HfInference } from "@huggingface/inference";
import TextModelSelector from "./TextModelSelector";
import { AVAILABLE_TEXT_MODELS, TextModelType } from "@/types/text-models";
import { useApiLimits } from "@/hooks/useApiLimits";

const client = new HfInference("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");

const TextGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<TextModelType>(AVAILABLE_TEXT_MODELS[0]);
  const { toast } = useToast();
  const { checkTextGenerationLimit, recordTextGeneration } = useApiLimits();

  const generateText = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Hata",
        description: "Lütfen önce bir prompt girin",
        variant: "destructive",
      });
      return;
    }

    if (!checkTextGenerationLimit()) {
      toast({
        title: "Rate Limit",
        description: "Dakikada en fazla 5 metin oluşturabilirsiniz. Lütfen biraz bekleyin.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      let output = "";
      const stream = client.chatCompletionStream({
        model: selectedModel.id,
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 500
      });

      for await (const chunk of stream) {
        if (chunk.choices && chunk.choices.length > 0) {
          const newContent = chunk.choices[0].delta.content;
          output += newContent;
          setResponse(output);
        }
      }
      recordTextGeneration();
    } catch (error) {
      toast({
        title: "Hata",
        description: error instanceof Error ? error.message : "Metin oluşturulurken bir hata oluştu",
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
          Materialize your ideas, doubts and questions through text to transform them into text answers and solutions. Start dreaming.
        </p>
      </div>

      <TextModelSelector
        selectedModel={selectedModel}
        onModelChange={setSelectedModel}
        disabled={isLoading}
      />

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
          <Wand2 className="mr-2 h-4 w-4" />
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