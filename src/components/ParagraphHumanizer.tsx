import { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Card } from "./ui/card";
import { useToast } from "./ui/use-toast";
import TextModelSelector from "./TextModelSelector";
import { AVAILABLE_TEXT_MODELS, TextModelType } from "@/types/text-models";
import { supabase } from "@/integrations/supabase/client";

const ParagraphHumanizer = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<TextModelType>(AVAILABLE_TEXT_MODELS[0]);
  const { toast } = useToast();

  const handleHumanize = async () => {
    if (!input.trim()) {
      toast({
        title: "Hata",
        description: "Lütfen insansılaştırmak için bir metin girin",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('humanize-text', {
        body: {
          text: input,
          model: selectedModel.id
        }
      });

      if (error) throw error;
      
      setOutput(data.humanizedText);
      toast({
        title: "Başarılı",
        description: "Metin başarıyla insansılaştırıldı!",
      });
    } catch (error) {
      console.error('Error humanizing text:', error);
      toast({
        title: "Hata",
        description: "Metin insansılaştırılırken bir hata oluştu",
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
            placeholder="Metninizi buraya girin..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[200px]"
          />
          <Button 
            onClick={handleHumanize}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "İnsansılaştırılıyor..." : "Metni İnsansılaştır"}
          </Button>
          {output && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">İnsansılaştırılmış Çıktı:</h3>
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