import { useState } from "react";
import ComponentHeader from "./shared/ComponentHeader";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useToast } from "./ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useApiLimits } from "@/hooks/useApiLimits";

const DietPlanGenerator = () => {
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    height: "",
    weight: "",
    activityLevel: "",
    dietaryRestrictions: "",
    fitnessGoals: "",
  });
  const [generatedPlan, setGeneratedPlan] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { checkDietPlan } = useApiLimits();

  const generateDietPlan = async () => {
    if (!Object.values(formData).every(value => value)) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to generate a diet plan.",
        variant: "destructive",
      });
      return;
    }

    console.log('Checking credits before Diet Plan generation...');
    const canProceed = await checkDietPlan();
    console.log('Credit check result:', canProceed);
    if (!canProceed) return;

    setIsLoading(true);
    try {
      // Convert comma-separated strings to arrays
      const dietaryRestrictionsArray = formData.dietaryRestrictions
        .split(',')
        .map(item => item.trim())
        .filter(item => item);
      
      const fitnessGoalsArray = formData.fitnessGoals
        .split(',')
        .map(item => item.trim())
        .filter(item => item);

      const { data, error } = await supabase.functions.invoke("generate-diet-plan", {
        body: {
          age: parseInt(formData.age),
          gender: formData.gender,
          height: parseFloat(formData.height),
          weight: parseFloat(formData.weight),
          activityLevel: formData.activityLevel,
          dietaryRestrictions: dietaryRestrictionsArray,
          fitnessGoals: fitnessGoalsArray,
        },
      });

      if (error) throw error;

      if (data?.plan) {
        setGeneratedPlan(data.plan);
        console.log('Diet plan generated successfully, 200 credits should be deducted');
        toast({
          title: "Success!",
          description: "Your diet plan has been generated.",
        });
      } else {
        console.error('Unexpected response format:', data);
        throw new Error('Unexpected response format from server');
      }
    } catch (error) {
      console.error('Error generating diet plan:', error);
      toast({
        title: "Error",
        description: "Failed to generate diet plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4 px-4 sm:px-6 sm:space-y-8">
      <ComponentHeader
        title="Transform Your Health"
        description="Get personalized diet plans tailored to your goals. Your journey to a healthier lifestyle starts with the right nutrition plan."
      />
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Textarea
            value={formData.age}
            onChange={(e) => handleInputChange("age", e.target.value)}
            placeholder="Enter your age..."
            className="min-h-[100px] bg-card text-foreground border-gray-700 resize-none"
          />
          <Textarea
            value={formData.gender}
            onChange={(e) => handleInputChange("gender", e.target.value)}
            placeholder="Enter your gender..."
            className="min-h-[100px] bg-card text-foreground border-gray-700 resize-none"
          />
          <Textarea
            value={formData.height}
            onChange={(e) => handleInputChange("height", e.target.value)}
            placeholder="Enter your height (cm)..."
            className="min-h-[100px] bg-card text-foreground border-gray-700 resize-none"
          />
          <Textarea
            value={formData.weight}
            onChange={(e) => handleInputChange("weight", e.target.value)}
            placeholder="Enter your weight (kg)..."
            className="min-h-[100px] bg-card text-foreground border-gray-700 resize-none"
          />
        </div>
        <Textarea
          value={formData.activityLevel}
          onChange={(e) => handleInputChange("activityLevel", e.target.value)}
          placeholder="Enter your activity level (sedentary, moderately_active, very_active)..."
          className="min-h-[100px] bg-card text-foreground border-gray-700 resize-none"
        />
        <Textarea
          value={formData.dietaryRestrictions}
          onChange={(e) => handleInputChange("dietaryRestrictions", e.target.value)}
          placeholder="Enter your dietary restrictions (comma-separated)..."
          className="min-h-[100px] bg-card text-foreground border-gray-700 resize-none"
        />
        <Textarea
          value={formData.fitnessGoals}
          onChange={(e) => handleInputChange("fitnessGoals", e.target.value)}
          placeholder="Enter your fitness goals (comma-separated)..."
          className="min-h-[100px] bg-card text-foreground border-gray-700 resize-none"
        />
        <Button onClick={generateDietPlan} disabled={isLoading} className="w-full">
          {isLoading ? "Generating..." : "Generate Diet Plan"}
        </Button>
      </div>

      {generatedPlan && (
        <div className="mt-4 p-4 bg-muted rounded-lg">
          <h2 className="text-lg font-bold">Generated Diet Plan</h2>
          <p className="whitespace-pre-wrap">{generatedPlan}</p>
        </div>
      )}
    </div>
  );
};

export default DietPlanGenerator;