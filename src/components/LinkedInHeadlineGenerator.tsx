import { useState } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { useToast } from "./ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const LinkedInHeadlineGenerator = () => {
  const [position, setPosition] = useState("");
  const [industry, setIndustry] = useState("");
  const [skills, setSkills] = useState("");
  const [tone, setTone] = useState("");
  const [generatedHeadline, setGeneratedHeadline] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateHeadline = async () => {
    if (!position || !industry || !skills || !tone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to generate a headline.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-linkedin-headline", {
        body: {
          position,
          industry,
          skills,
          tone,
        },
      });

      if (error) throw error;

      setGeneratedHeadline(data.headline);
      toast({
        title: "Success!",
        description: "Your LinkedIn headline has been generated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate headline. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">LinkedIn Headline Generator</h1>
        <p className="text-lg text-muted-foreground">
          Create an impactful LinkedIn headline that helps you stand out to recruiters and connections.
        </p>
      </div>

      <Card className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="position">Current role/position</Label>
            <Input
              id="position"
              placeholder="e.g. Senior Software Engineer"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="industry">Industry/field</Label>
            <Input
              id="industry"
              placeholder="e.g. Technology"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="skills">Key skills/expertise</Label>
            <Textarea
              id="skills"
              placeholder="e.g. React, Node.js, Cloud Architecture"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tone">Tone</Label>
            <Input
              id="tone"
              placeholder="e.g. professional, confident, innovative"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
            />
          </div>

          <Button
            className="w-full"
            onClick={generateHeadline}
            disabled={isLoading}
          >
            {isLoading ? "Generating..." : "Generate Headline"}
          </Button>
        </div>

        {generatedHeadline && (
          <div className="space-y-2">
            <Label>Generated Headline</Label>
            <Card className="p-4 bg-muted">
              <p className="text-lg">{generatedHeadline}</p>
            </Card>
          </div>
        )}
      </Card>
    </div>
  );
};

export default LinkedInHeadlineGenerator;