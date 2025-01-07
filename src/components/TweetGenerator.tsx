import { useState } from "react";
import ComponentHeader from "./shared/ComponentHeader";
import TweetHeader from "./tweet/TweetHeader";
import TweetInput from "./tweet/TweetInput";
import TweetOutput from "./tweet/TweetOutput";

const TweetGenerator = () => {
  const [tweetContent, setTweetContent] = useState("");
  const [generatedTweet, setGeneratedTweet] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateTweet = async () => {
    setIsLoading(true);
    // Simulate an API call to generate a tweet
    setTimeout(() => {
      setGeneratedTweet(`Generated Tweet: ${tweetContent}`);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4 px-4 sm:px-6 sm:space-y-8">
      <ComponentHeader
        title="Tweet Like a Pro"
        description="Create engaging tweets that capture attention. From casual updates to viral content, make every character count."
      />
      
      <TweetHeader />
      <TweetInput 
        value={tweetContent} 
        onChange={(e) => setTweetContent(e.target.value)} 
        onGenerate={handleGenerateTweet} 
        isLoading={isLoading} 
      />
      <TweetOutput generatedTweet={generatedTweet} />
    </div>
  );
};

export default TweetGenerator;
