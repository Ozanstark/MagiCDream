import { useState } from "react";
import ComponentHeader from "./shared/ComponentHeader";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const WorkoutPlanGenerator = () => {
  const [goal, setGoal] = useState("");
  const [duration, setDuration] = useState("");
  const [intensity, setIntensity] = useState("");
  const [generatedPlan, setGeneratedPlan] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generatePlan = async () => {
    if (!goal || !duration || !intensity) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to generate a workout plan.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-workout-plan", {
        body: {
          goal,
          duration,
          intensity,
        },
      });

      if (error) throw error;

      setGeneratedPlan(data.plan);
      toast({
        title: "Success!",
        description: "Your workout plan has been generated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate workout plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4 px-4 sm:px-6 sm:space-y-8">
      <ComponentHeader
        title="Achieve Your Fitness Goals"
        description="Get customized workout plans that match your fitness level and goals. Transform your body with expert-designed exercise routines."
      />

      <div className="space-y-4">
        <Textarea
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="Enter your fitness goal..."
          className="min-h-[100px] bg-card text-foreground border-border"
        />
        <Textarea
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          placeholder="Enter the duration of your workout..."
          className="min-h-[100px] bg-card text-foreground border-border"
        />
        <Textarea
          value={intensity}
          onChange={(e) => setIntensity(e.target.value)}
          placeholder="Enter the intensity level (e.g., low, medium, high)..."
          className="min-h-[100px] bg-card text-foreground border-border"
        />
        <Button onClick={generatePlan} disabled={isLoading} className="w-full">
          {isLoading ? "Generating..." : "Generate Workout Plan"}
        </Button>
      </div>

      {generatedPlan && (
        <div className="mt-4 p-4 bg-card border border-border rounded-lg">
          <h2 className="text-lg font-bold">Generated Workout Plan</h2>
          <p>{generatedPlan}</p>
        </div>
      )}
    </div>
  );
};

export default WorkoutPlanGenerator;
