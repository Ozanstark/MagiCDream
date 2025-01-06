import { Button } from "../ui/button";
import { Crown } from "lucide-react";

export const PremiumUpgrade = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-8">
      <div className="flex flex-col items-center justify-center space-y-4 p-8 border-2 border-dashed rounded-lg bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Crown className="w-12 h-12 text-yellow-500 animate-pulse" />
        <h3 className="text-xl font-bold">Premium Özellik</h3>
        <p className="text-center text-muted-foreground">
          Ücretsiz denemenizi kullandınız. Daha fazla analiz için premium üyeliğe geçin.
        </p>
        <Button 
          variant="default"
          className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white"
        >
          Premium'a Yükselt
        </Button>
      </div>
    </div>
  );
};