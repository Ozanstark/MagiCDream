import { useState } from "react";
import ComponentHeader from "./shared/ComponentHeader";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useToast } from "./ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const DietPlanGenerator = () => {
  const [dietGoals, setDietGoals] = useState("");
  const [dietType, setDietType] = useState("");
  const [generatedPlan, setGeneratedPlan] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateDietPlan = async () => {
    if (!dietGoals || !dietType) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to generate a diet plan.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-diet-plan", {
        body: {
          goals: dietGoals,
          type: dietType,
        },
      });

      if (error) throw error;

      setGeneratedPlan(data.plan);
      toast({
        title: "Success!",
        description: "Your diet plan has been generated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate diet plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4 px-4 sm:px-6 sm:space-y-8">
      <ComponentHeader
        title="Transform Your Health"
        description="Get personalized diet plans tailored to your goals. Your journey to a healthier lifestyle starts with the right nutrition plan."
      />
      
      <div className="space-y-4">
        <Textarea
          value={dietGoals}
          onChange={(e) => setDietGoals(e.target.value)}
          placeholder="Enter your diet goals..."
          className="min-h-[200px] bg-card text-foreground border-gray-700 resize-none"
        />
        <Textarea
          value={dietType}
          onChange={(e) => setDietType(e.target.value)}
          placeholder="Enter your preferred diet type..."
          className="min-h-[200px] bg-card text-foreground border-gray-700 resize-none"
        />
        <Button onClick={generateDietPlan} disabled={isLoading} className="w-full">
          {isLoading ? "Generating..." : "Generate Diet Plan"}
        </Button>
      </div>

      {generatedPlan && (
        <div className="mt-4 p-4 bg-muted rounded-lg">
          <h2 className="text-lg font-bold">Generated Diet Plan</h2>
          <p>{generatedPlan}</p>
        </div>
      )}
    </div>
  );
};

export default DietPlanGenerator;
