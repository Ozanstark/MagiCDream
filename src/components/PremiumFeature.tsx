import { Button } from "./ui/button";
import { usePremiumStatus } from "@/hooks/usePremiumStatus";
import { Crown } from "lucide-react";
import InstagramAnalysisDemo from "./instagram/InstagramAnalysisDemo";

interface PremiumFeatureProps {
  children: React.ReactNode;
}

const PremiumFeature = ({ children }: PremiumFeatureProps) => {
  const { isPremium, loading } = usePremiumStatus();

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  if (!isPremium) {
    return (
      <div className="flex flex-col items-center justify-center space-y-8">
        <div className="flex flex-col items-center justify-center space-y-4 p-8 border-2 border-dashed rounded-lg bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <Crown className="w-12 h-12 text-yellow-500 animate-glow" />
          <h3 className="text-xl font-bold">Premium Özellik</h3>
          <p className="text-center text-muted-foreground">
            Bu özelliği kullanabilmek için premium üye olmanız gerekmektedir.
          </p>
          <Button 
            variant="default"
            className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white"
          >
            Premium'a Yükselt
          </Button>
        </div>
        
        <div className="w-full max-w-3xl">
          <div className="relative h-[400px] w-full overflow-hidden rounded-lg border border-yellow-500/20">
            <InstagramAnalysisDemo />
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default PremiumFeature;