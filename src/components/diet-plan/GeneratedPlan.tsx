interface GeneratedPlanProps {
  plan: string;
}

const GeneratedPlan = ({ plan }: GeneratedPlanProps) => {
  if (!plan) return null;

  return (
    <div className="mt-8 p-6 border rounded-lg">
      <h3 className="text-xl font-semibold mb-4">Your Diet Plan</h3>
      <div className="whitespace-pre-wrap">{plan}</div>
    </div>
  );
};

export default GeneratedPlan;