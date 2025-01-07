import { useState } from "react";
import ComponentHeader from "./shared/ComponentHeader";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useToast } from "./ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const BlogIntroGenerator = () => {
  const [topic, setTopic] = useState("");
  const [intro, setIntro] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateIntro = async () => {
    if (!topic.trim()) {
      toast({
        title: "Error",
        description: "Please enter a topic to generate an introduction.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-blog-intro", {
        body: { topic },
      });

      if (error) throw error;

      setIntro(data.intro);
      toast({
        title: "Success!",
        description: "Your blog introduction has been generated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate introduction. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4 px-4 sm:px-6 sm:space-y-8">
      <ComponentHeader
        title="Captivate Your Readers"
        description="Create compelling blog introductions that hook your audience from the first sentence. Turn casual readers into devoted followers."
      />
      
      <Textarea
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="Enter your blog topic..."
        className="min-h-[100px] bg-card text-foreground border border-border/20"
      />
      <Button onClick={generateIntro} disabled={isLoading} className="w-full">
        {isLoading ? "Generating..." : "Generate Introduction"}
      </Button>

      {intro && (
        <div className="mt-4 p-4 bg-muted rounded-lg">
          <h2 className="text-lg font-bold">Generated Introduction</h2>
          <p>{intro}</p>
        </div>
      )}
    </div>
  );
};

export default BlogIntroGenerator;
