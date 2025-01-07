import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Database } from "@/integrations/supabase/types";

type FitnessLevel = Database["public"]["Enums"]["fitness_level"];

interface WorkoutFormProps {
  onSubmit: (formData: WorkoutFormData) => void;
  loading: boolean;
}

export interface WorkoutFormData {
  fitnessGoal: string;
  fitnessLevel: FitnessLevel;
  equipment: string[];
  workoutDuration: number;
  injuries: string;
}

export const WorkoutForm = ({ onSubmit, loading }: WorkoutFormProps) => {
  const [formData, setFormData] = useState<WorkoutFormData>({
    fitnessGoal: "",
    fitnessLevel: "beginner",
    equipment: [],
    workoutDuration: 30,
    injuries: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="fitnessGoal">Fitness Goal</Label>
        <Input
          id="fitnessGoal"
          value={formData.fitnessGoal}
          onChange={(e) =>
            setFormData({ ...formData, fitnessGoal: e.target.value })
          }
          placeholder="e.g., Build muscle, Lose weight"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="fitnessLevel">Fitness Level</Label>
        <Select
          value={formData.fitnessLevel}
          onValueChange={(value) =>
            setFormData({ ...formData, fitnessLevel: value as FitnessLevel })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select fitness level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="equipment">Available Equipment (comma-separated)</Label>
        <Input
          id="equipment"
          value={formData.equipment.join(", ")}
          onChange={(e) =>
            setFormData({
              ...formData,
              equipment: e.target.value.split(",").map((item) => item.trim()),
            })
          }
          placeholder="e.g., Dumbbells, Resistance bands, Yoga mat"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="workoutDuration">Workout Duration (minutes)</Label>
        <Input
          id="workoutDuration"
          type="number"
          min="15"
          max="120"
          value={formData.workoutDuration}
          onChange={(e) =>
            setFormData({
              ...formData,
              workoutDuration: parseInt(e.target.value),
            })
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="injuries">Injuries or Limitations (optional)</Label>
        <Textarea
          id="injuries"
          value={formData.injuries}
          onChange={(e) =>
            setFormData({ ...formData, injuries: e.target.value })
          }
          placeholder="List any injuries or physical limitations"
        />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Generating..." : "Generate Workout Plan"}
      </Button>
    </form>
  );
};