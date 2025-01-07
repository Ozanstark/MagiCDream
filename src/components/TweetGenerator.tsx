import { useState } from "react";
import ComponentHeader from "./shared/ComponentHeader";
import TweetHeader from "./tweet/TweetHeader";
import TweetInput from "./tweet/TweetInput";
import TweetOutput from "./tweet/TweetOutput";

const TweetGenerator = () => {
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [generatedTweet, setGeneratedTweet] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateTweet = async () => {
    setIsGenerating(true);
    // Simulate an API call to generate a tweet
    setTimeout(() => {
      setGeneratedTweet(`Generated Tweet based on topic: ${topic} and description: ${description}`);
      setIsGenerating(false);
    }, 1000);
  };

  const handleTweetChange = (value: string) => {
    setGeneratedTweet(value);
  };

  const handleCopyTweet = () => {
    navigator.clipboard.writeText(generatedTweet);
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