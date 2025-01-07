import { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "./ui/label";
import { useToast } from "./ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const EssayHumanizer = () => {
  const [essayText, setEssayText] = useState("");
  const [writingStyle, setWritingStyle] = useState("casual");
  const [complexity, setComplexity] = useState("college");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleHumanize = async () => {
    if (!essayText.trim()) {
      toast({
        title: "Error",
        description: "Please enter some text to humanize",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("humanize-essay", {
        body: {
          text: essayText,
          style: writingStyle,
          complexity: complexity,
        },
      });

      if (error) throw error;

      setEssayText(data.humanizedText);
      toast({
        title: "Success",
        description: "Your essay has been humanized!",
      });
    } catch (error) {
      console.error("Error humanizing essay:", error);
      toast({
        title: "Error",
        description: "Failed to humanize the essay. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      <div className="space-y-2 text-center">
        <h1 className="text-4xl font-bold tracking-tighter">Essay Humanizer</h1>
        <p className="text-muted-foreground">
          Transform your AI-generated essay into natural, human-like writing that bypasses AI detection.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Your essay text</Label>
          <Textarea
            placeholder="Paste your essay content here..."
            value={essayText}
            onChange={(e) => setEssayText(e.target.value)}
            className="min-h-[200px]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Writing style</Label>
            <Select value={writingStyle} onValueChange={setWritingStyle}>
              <SelectTrigger>
                <SelectValue placeholder="Select style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="academic">Academic</SelectItem>
                <SelectItem value="casual">Casual</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Complexity level</Label>
            <Select value={complexity} onValueChange={setComplexity}>
              <SelectTrigger>
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high-school">High School</SelectItem>
                <SelectItem value="college">College</SelectItem>
                <SelectItem value="graduate">Graduate</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button 
          onClick={handleHumanize} 
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? "Humanizing..." : "Humanize Essay"}
        </Button>
      </div>
    </div>
  );
};

export default EssayHumanizer;