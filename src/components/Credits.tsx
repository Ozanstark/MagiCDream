import { Coins } from "lucide-react";
import { useCredits } from "@/hooks/useCredits";

const Credits = () => {
  const { credits, isLoading } = useCredits();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 bg-card p-2 rounded-lg animate-pulse">
        <Coins className="h-4 w-4" />
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 bg-card p-2 rounded-lg transition-all duration-300">
      <Coins className="h-4 w-4" />
      <span>{credits?.toLocaleString() ?? 0} credits</span>
    </div>
  );
};

export default Credits;