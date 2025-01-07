interface WorkoutPlanProps {
  plan: string;
}

export const WorkoutPlan = ({ plan }: WorkoutPlanProps) => {
  return (
    <div className="mt-8 p-6 border rounded-lg">
      <h3 className="text-xl font-semibold mb-4">Your Workout Plan</h3>
      <div className="whitespace-pre-wrap">{plan}</div>
    </div>
  );
};