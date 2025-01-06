import { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { MessageSquare, Wand2 } from "lucide-react";
import { useToast } from "./ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { HfInference } from "@huggingface/inference";
import { AVAILABLE_TEXT_MODELS } from "@/types/text-models";

const client = new HfInference("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");

const TweetGenerator = () => {
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [tweet, setTweet] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateTweet = async () => {
    if (!topic.trim()) {
      toast({
        title: "Konu alanı boş olamaz",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      let prompt = `Konu: ${topic}`;
      if (description.trim()) {
        prompt += `\nAçıklama: ${description}`;
      }
      prompt += "\nBu konu hakkında Twitter'a özgü, eğlenceli ve günlük konuşma dilinde, emoji kullanarak, hashtag ekleyerek, 280 karakteri geçmeyen bir tweet oluştur. Tweet samimi, esprili ve ilgi çekici olmalı. Resmi dil kullanma, günlük konuşma dilini tercih et.";

      let output = "";
      const stream = client.chatCompletionStream({
        model: AVAILABLE_TEXT_MODELS[0].id,
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 200
      });

      for await (const chunk of stream) {
        if (chunk.choices && chunk.choices.length > 0) {
          const newContent = chunk.choices[0].delta.content;
          output += newContent;
          setTweet(output);
        }
      }
    } catch (error: any) {
      toast({
        title: "Tweet oluşturulamadı",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tweet.trim()) {
      toast({
        title: "Tweet metni boş olamaz",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("scheduled_tweets")
        .insert([
          {
            content: tweet,
            category: topic,
            scheduled_time: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Tweet başarıyla oluşturuldu",
        description: "Tweet planlandı ve yakında paylaşılacak",
      });
      setTweet("");
      setTopic("");
      setDescription("");
    } catch (error: any) {
      toast({
        title: "Hata oluştu",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold rainbow-text">Tweet Generator</h1>
        <p className="text-muted-foreground">
          Konuyu girin, yapay zeka sizin için tweet oluştursun
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-4">
          <Input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Tweet konusunu girin..."
            className="input-premium"
          />
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="İsteğe bağlı kısa açıklama..."
            className="input-premium"
          />
          <Button
            onClick={generateTweet}
            disabled={isGenerating || !topic.trim()}
            className="w-full button-primary"
          >
            {isGenerating ? (
              "Tweet Oluşturuluyor..."
            ) : (
              <>
                <Wand2 className="w-4 h-4 mr-2" />
                Tweet Oluştur
              </>
            )}
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            value={tweet}
            onChange={(e) => setTweet(e.target.value)}
            placeholder="Oluşturulan tweet burada görünecek..."
            className="min-h-[100px] input-premium"
            maxLength={280}
          />
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              {tweet.length}/280 karakter
            </span>
            <Button
              type="submit"
              disabled={isLoading || !tweet.trim()}
              className="button-primary"
            >
              {isLoading ? (
                "Yükleniyor..."
              ) : (
                <>
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Tweeti Planla
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TweetGenerator;