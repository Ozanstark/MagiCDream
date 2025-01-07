import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

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
        <p className="text-gray-500">Generate a personalized diet plan based on your goals and preferences.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select
              value={formData.gender}
              onValueChange={(value) => setFormData({ ...formData, gender: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="height">Height (cm)</Label>
            <Input
              id="height"
              type="number"
              step="0.1"
              value={formData.height}
              onChange={(e) => setFormData({ ...formData, height: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              step="0.1"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="activityLevel">Activity Level</Label>
          <Select
            value={formData.activityLevel}
            onValueChange={(value) => setFormData({ ...formData, activityLevel: value as ActivityLevel })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select activity level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sedentary">Sedentary</SelectItem>
              <SelectItem value="moderately_active">Moderately Active</SelectItem>
              <SelectItem value="very_active">Very Active</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dietaryRestrictions">
            Dietary Restrictions (comma-separated)
          </Label>
          <Input
            id="dietaryRestrictions"
            value={formData.dietaryRestrictions}
            onChange={(e) =>
              setFormData({ ...formData, dietaryRestrictions: e.target.value })
            }
            placeholder="e.g., vegetarian, gluten-free, dairy-free"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fitnessGoals">Fitness Goals (comma-separated)</Label>
          <Input
            id="fitnessGoals"
            value={formData.fitnessGoals}
            onChange={(e) =>
              setFormData({ ...formData, fitnessGoals: e.target.value })
            }
            placeholder="e.g., weight loss, muscle gain, maintenance"
          />
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "Generating..." : "Generate Diet Plan"}
        </Button>
      </form>

      {generatedPlan && (
        <div className="mt-8 p-6 border rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Your Diet Plan</h3>
          <div className="whitespace-pre-wrap">{generatedPlan}</div>
        </div>
      )}
    </div>
  );
};

export default DietPlanGenerator;