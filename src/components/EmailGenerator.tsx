import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { HfInference } from "@huggingface/inference";
import TextModelSelector from "./TextModelSelector";
import { AVAILABLE_TEXT_MODELS, TextModelType } from "@/types/text-models";
import { useApiLimits } from "@/hooks/useApiLimits";

const client = new HfInference("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");

const EmailGenerator = () => {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<TextModelType>(AVAILABLE_TEXT_MODELS[0]);
  const { toast } = useToast();
  const { checkEmailGeneration } = useApiLimits();

  const generateEmail = async () => {
    if (!content.trim()) {
      toast({
        title: "Hata",
        description: "Lütfen e-posta içeriğini girin",
        variant: "destructive",
      });
      return;
    }

    const canProceed = await checkEmailGeneration();
    if (!canProceed) return;

    setIsLoading(true);
    try {
      let output = "";
      const prompt = `Aşağıdaki metni profesyonel bir e-posta formatına dönüştür. Konu: ${subject || "Belirtilmemiş"}

İçerik: ${content}

Lütfen aşağıdaki formatta düzenle:
- Uygun bir selamlama ile başla
- Paragrafları düzenle ve profesyonel bir dil kullan
- İmza ve kapanış ekle`;

      const stream = client.chatCompletionStream({
        model: selectedModel.id,
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 1000
      });

      for await (const chunk of stream) {
        if (chunk.choices && chunk.choices.length > 0) {
          const newContent = chunk.choices[0].delta.content;
          output += newContent;
          setResponse(output);
        }
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: error instanceof Error ? error.message : "E-posta oluşturulurken bir hata oluştu",
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
          AI Dream Text to Email
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4 border border-primary/20 py-3 rounded-lg bg-card/50 backdrop-blur-sm">
          Düzensiz metinlerinizi profesyonel e-posta formatına dönüştürün. Fikirlerinizi yazın, AI sizin için düzenlesin.
        </p>
      </div>

      <TextModelSelector
        selectedModel={selectedModel}
        onModelChange={setSelectedModel}
        disabled={isLoading}
      />

      <div className="space-y-4">
        <Input
          placeholder="E-posta konusu (opsiyonel)"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="input-premium"
        />
        <Textarea
          placeholder="E-posta içeriğini buraya yazın..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[150px] input-premium"
        />
        <Button
          onClick={generateEmail}
          disabled={isLoading}
          className="w-full button-primary"
        >
          <Wand2 className="mr-2 h-4 w-4" />
          {isLoading ? "Oluşturuluyor..." : "E-posta Oluştur"}
        </Button>
      </div>

      {response && (
        <div className="mt-6 p-6 bg-card rounded-lg border border-primary/20 shadow-lg backdrop-blur-sm">
          <p className="whitespace-pre-wrap text-foreground/90">{response}</p>
          <Button
            onClick={() => {
              navigator.clipboard.writeText(response);
              toast({
                title: "Başarılı",
                description: "E-posta içeriği panoya kopyalandı",
              });
            }}
            className="mt-4"
            variant="outline"
          >
            Kopyala
          </Button>
        </div>
      )}
    </div>
  );
};

export default EmailGenerator;
