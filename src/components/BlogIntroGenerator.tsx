import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useApiLimits } from "@/hooks/useApiLimits";
import { supabase } from "@/integrations/supabase/client";

const BlogIntroGenerator = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tone, setTone] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { checkBlogIntro } = useApiLimits();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !tone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields before generating.",
        variant: "destructive",
      });
      return;
    }

    const canProceed = await checkBlogIntro();
    if (!canProceed) return;

    setIsLoading(true);
    try {
      const prompt = `Write an engaging blog post introduction for an article with the following details:
      Title: ${title}
      Topic: ${description}
      Tone of voice: ${tone}
      
      The introduction should be captivating and make readers want to continue reading the article. Keep it concise but engaging.`;

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
    } catch (error) {
      console.error("Blog intro generation error:", error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate blog introduction. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-center mb-4">Blog Intro Generator</h1>
        <p className="text-muted-foreground text-center">
          Write an intro that will entice your visitors to read more about your article.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-lg font-semibold">Blog post title/topic</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="How To Become A Software Engineer"
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <label className="text-lg font-semibold">What is the blog about?</label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the main points or topics your blog post will cover..."
            className="w-full min-h-[100px]"
          />
        </div>

        <div className="space-y-2">
          <label className="text-lg font-semibold">Tone of voice</label>
          <Input
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            placeholder="professional, energetic, clever"
            className="w-full"
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            "Generating..."
          ) : (
            <>
              <Wand2 className="mr-2 h-4 w-4" />
              Generate Introduction
            </>
          )}
        </Button>
      </form>

      {response && (
        <div className="mt-6 p-4 bg-card rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Generated Introduction:</h2>
          <p className="whitespace-pre-wrap">{response}</p>
        </div>
      )}
    </div>
  );
};

export default BlogIntroGenerator;
