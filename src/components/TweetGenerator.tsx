import { useState } from "react";
import { useToast } from "./ui/use-toast";
import { HfInference } from "@huggingface/inference";
import { AVAILABLE_TEXT_MODELS } from "@/types/text-models";
import TweetHeader from "./tweet/TweetHeader";
import TweetInput from "./tweet/TweetInput";
import TweetOutput from "./tweet/TweetOutput";

const client = new HfInference("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");

const TweetGenerator = () => {
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [tweet, setTweet] = useState("");
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

  const copyTweet = async () => {
    if (!tweet.trim()) {
      toast({
        title: "Tweet metni boş olamaz",
        variant: "destructive",
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(tweet);
      toast({
        title: "Tweet kopyalandı",
        description: "Tweet panoya kopyalandı",
      });
    } catch (error: any) {
      toast({
        title: "Kopyalama başarısız",
        description: "Tweet kopyalanırken bir hata oluştu",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <TweetHeader />
      <div className="space-y-4">
        <TweetInput
          topic={topic}
          description={description}
          isGenerating={isGenerating}
          onTopicChange={setTopic}
          onDescriptionChange={setDescription}
          onGenerate={generateTweet}
        />
        <TweetOutput
          tweet={tweet}
          onTweetChange={setTweet}
          onCopy={copyTweet}
        />
      </div>
    </div>
  );
};

export default TweetGenerator;