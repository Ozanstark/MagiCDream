import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useApiLimits } from "@/hooks/useApiLimits";
import { supabase } from "@/integrations/supabase/client";

const TextGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
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
      const response = await supabase.functions.invoke('generate-text', {
        body: { prompt },
      });

      if (response.error) throw response.error;

      const reader = new ReadableStream({
        start(controller) {
          const text = new TextDecoder();
          const lines = text.decode(response.data).split('\n');
          
          for (const line of lines) {
            if (line.startsWith('data: ') && line !== 'data: [DONE]') {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.choices?.[0]?.delta?.content) {
                  controller.enqueue(data.choices[0].delta.content);
                }
              } catch (e) {
                console.error('Error parsing SSE message:', e);
              }
            }
          }
          controller.close();
        },
      });

      let output = '';
      const reader2 = reader.getReader();
      while (true) {
        const { done, value } = await reader2.read();
        if (done) break;
        output += value;
        setResponse(output);
      }

      recordTextGeneration();
    } catch (error) {
      console.error("Text generation error:", error);
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
    <div className="w-full max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-6">
        <h1 className="text-5xl md:text-6xl font-extrabold rainbow-text tracking-tight">
          AI Dream Text to Text
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4 border border-primary/20 py-3 rounded-lg bg-card/50 backdrop-blur-sm">
          Materialize your ideas, doubts and questions through text to transform them into text answers and solutions. Start dreaming.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <Input
          placeholder="Enter your prompt here..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="flex-1 input-premium"
        />
        <Button
          onClick={generateText}
          disabled={isLoading}
          className="button-primary"
        >
          <Wand2 className="mr-2 h-4 w-4" />
          {isLoading ? "Generating..." : "Generate"}
        </Button>
      </div>

      {response && (
        <div className="mt-6 p-6 bg-card rounded-lg border border-primary/20 shadow-lg backdrop-blur-sm">
          <p className="whitespace-pre-wrap text-foreground/90">{response}</p>
        </div>
      )}
    </div>
  );
};

export default TextGenerator;