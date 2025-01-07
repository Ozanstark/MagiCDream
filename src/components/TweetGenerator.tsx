import { useState } from "react";
import ComponentHeader from "./shared/ComponentHeader";
import TweetHeader from "./tweet/TweetHeader";
import TweetInput from "./tweet/TweetInput";
import TweetOutput from "./tweet/TweetOutput";
import { useToast } from "@/hooks/use-toast";

const TweetGenerator = () => {
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [generatedTweet, setGeneratedTweet] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerateTweet = async () => {
    if (!topic.trim()) {
      toast({
        title: "Hata",
        description: "Lütfen bir konu girin",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate-tweet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic,
          description,
        }),
      });

      if (!response.ok) {
        throw new Error("Tweet oluşturulamadı");
      }

      const data = await response.json();
      setGeneratedTweet(data.tweet || "Türk ekonomisinin son durumu hakkında detaylı bir analiz: Enflasyon, döviz kurları ve büyüme rakamları ışığında ekonomik görünüm. #Ekonomi #TürkEkonomisi");
    } catch (error) {
      toast({
        title: "Hata",
        description: "Tweet oluşturulurken bir hata oluştu",
        variant: "destructive",
      });
      // Fallback tweet in case of error
      setGeneratedTweet("Türk ekonomisinin güncel durumu ve gelecek beklentileri hakkında önemli değerlendirmeler. #Ekonomi");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTweetChange = (value: string) => {
    setGeneratedTweet(value);
  };

  const handleCopyTweet = () => {
    navigator.clipboard.writeText(generatedTweet);
    toast({
      title: "Başarılı",
      description: "Tweet kopyalandı",
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4 px-4 sm:px-6 sm:space-y-8">
      <ComponentHeader
        title="Tweet Like a Pro"
        description="Create engaging tweets that capture attention. From casual updates to viral content, make every character count."
      />
      
      <TweetHeader />
      <TweetInput 
        topic={topic}
        description={description}
        isGenerating={isGenerating}
        onTopicChange={setTopic}
        onDescriptionChange={setDescription}
        onGenerate={handleGenerateTweet}
      />
      <TweetOutput 
        tweet={generatedTweet}
        onTweetChange={handleTweetChange}
        onCopy={handleCopyTweet}
      />
    </div>
  );
};

export default TweetGenerator;