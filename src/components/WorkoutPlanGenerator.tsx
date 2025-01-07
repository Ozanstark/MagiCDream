import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { WorkoutForm, WorkoutFormData } from "./workout/WorkoutForm";
import { WorkoutPlan } from "./workout/WorkoutPlan";

const WorkoutPlanGenerator = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState("");

  const handleSubmit = async (formData: WorkoutFormData) => {
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const response = await supabase.functions.invoke('generate-workout-plan', {
        body: formData,
      });

      if (response.error) throw response.error;

      const { data: { plan } } = response;

      const { data, error } = await supabase
        .from('workout_plans')
        .insert({
          user_id: user.id,
          fitness_goal: formData.fitnessGoal,
          fitness_level: formData.fitnessLevel,
          equipment: formData.equipment,
          workout_duration: formData.workoutDuration,
          injuries: formData.injuries || null,
          plan_content: plan,
        })
        .select()
        .single();

      if (error) throw error;

      setGeneratedPlan(data.plan_content);
      toast({
        title: "Success!",
        description: "Your workout plan has been generated.",
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to generate workout plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Workout Plan Generator</h2>
        <p className="text-gray-500">
          Generate a personalized workout plan based on your fitness level and goals.
        </p>
      </div>

      <WorkoutForm onSubmit={handleSubmit} loading={loading} />
      
      {generatedPlan && <WorkoutPlan plan={generatedPlan} />}
    </div>
  );
};

export default WorkoutPlanGenerator;