interface FeaturesDisplayProps {
  features: number[] | null;
}

const FeaturesDisplay = ({ features }: FeaturesDisplayProps) => {
  if (!features) return null;

  return (
    <div className="p-4 rounded-lg border border-border bg-card/50">
      <h3 className="font-semibold mb-2">Extracted Features:</h3>
      <div className="max-h-40 overflow-y-auto">
        <pre className="text-xs">
          {JSON.stringify(features, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default FeaturesDisplay;