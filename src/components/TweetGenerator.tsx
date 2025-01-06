import { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { MessageSquare } from "lucide-react";
import { useToast } from "./ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const TweetGenerator = () => {
  const [tweet, setTweet] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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
            category: "general",
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
          Tweet metninizi yazın ve otomatik olarak paylaşılsın
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          value={tweet}
          onChange={(e) => setTweet(e.target.value)}
          placeholder="Tweet metninizi buraya yazın..."
          className="min-h-[100px] input-premium"
          maxLength={280}
        />
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">
            {tweet.length}/280 karakter
          </span>
          <Button
            type="submit"
            disabled={isLoading}
            className="button-primary"
          >
            {isLoading ? (
              "Yükleniyor..."
            ) : (
              <>
                <MessageSquare className="w-4 h-4" />
                Tweet Oluştur
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TweetGenerator;