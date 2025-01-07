import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import type { Database } from "@/integrations/supabase/types";

type ActivityLevel = Database["public"]["Enums"]["activity_level"];

interface DietPlanFormData {
  age: string;
  gender: string;
  height: string;
  weight: string;
  activityLevel: ActivityLevel;
  dietaryRestrictions: string;
  fitnessGoals: string;
}

interface DietPlanFormProps {
  formData: DietPlanFormData;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (field: keyof DietPlanFormData, value: string) => void;
}

const DietPlanForm = ({ formData, loading, onSubmit, onChange }: DietPlanFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            type="number"
            value={formData.age}
            onChange={(e) => onChange("age", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select
            value={formData.gender}
            onValueChange={(value) => onChange("gender", value)}
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
            onChange={(e) => onChange("height", e.target.value)}
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
            onChange={(e) => onChange("weight", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="activityLevel">Activity Level</Label>
        <Select
          value={formData.activityLevel}
          onValueChange={(value) => onChange("activityLevel", value as ActivityLevel)}
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
          onChange={(e) => onChange("dietaryRestrictions", e.target.value)}
          placeholder="e.g., vegetarian, gluten-free, dairy-free"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="fitnessGoals">Fitness Goals (comma-separated)</Label>
        <Input
          id="fitnessGoals"
          value={formData.fitnessGoals}
          onChange={(e) => onChange("fitnessGoals", e.target.value)}
          placeholder="e.g., weight loss, muscle gain, maintenance"
        />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Generating..." : "Generate Diet Plan"}
      </Button>
    </form>
  );
};

export default DietPlanForm;