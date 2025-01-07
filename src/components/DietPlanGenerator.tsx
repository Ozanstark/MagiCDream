import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import DietPlanForm from "./diet-plan/DietPlanForm";
import GeneratedPlan from "./diet-plan/GeneratedPlan";

type ActivityLevel = Database["public"]["Enums"]["activity_level"];

const DietPlanGenerator = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    height: "",
    weight: "",
    activityLevel: "" as ActivityLevel,
    dietaryRestrictions: "",
    fitnessGoals: "",
  });
  const [generatedPlan, setGeneratedPlan] = useState("");

  const handleFormChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const response = await supabase.functions.invoke('generate-diet-plan', {
        body: {
          age: parseInt(formData.age),
          gender: formData.gender,
          height: parseFloat(formData.height),
          weight: parseFloat(formData.weight),
          activityLevel: formData.activityLevel,
          dietaryRestrictions: formData.dietaryRestrictions.split(",").map(item => item.trim()),
          fitnessGoals: formData.fitnessGoals.split(",").map(item => item.trim()),
        },
      });

      if (response.error) throw response.error;

      const { data: { plan } } = response;

      const { data, error } = await supabase
        .from('diet_plans')
        .insert({
          user_id: user.id,
          age: parseInt(formData.age),
          gender: formData.gender,
          height: parseFloat(formData.height),
          weight: parseFloat(formData.weight),
          activity_level: formData.activityLevel,
          dietary_restrictions: formData.dietaryRestrictions.split(",").map(item => item.trim()),
          fitness_goals: formData.fitnessGoals.split(",").map(item => item.trim()),
          plan_content: plan,
        })
        .select()
        .single();

      if (error) throw error;

      setGeneratedPlan(data.plan_content);
      toast({
        title: "Success!",
        description: "Your diet plan has been generated.",
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to generate diet plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Diet Plan Generator</h2>
        <p className="text-gray-500">
          Generate a personalized diet plan based on your goals and preferences.
        </p>
      </div>

      <DietPlanForm
        formData={formData}
        loading={loading}
        onSubmit={handleSubmit}
        onChange={handleFormChange}
      />

      <GeneratedPlan plan={generatedPlan} />
    </div>
  );
};

export default DietPlanGenerator;