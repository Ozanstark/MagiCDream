import { useState } from "react";
import ComponentHeader from "./shared/ComponentHeader";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useApiLimits } from "@/hooks/useApiLimits";

const WorkoutPlanGenerator = () => {
  const [goal, setGoal] = useState("");
  const [duration, setDuration] = useState("");
  const [intensity, setIntensity] = useState("");
  const [generatedPlan, setGeneratedPlan] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { checkWorkoutPlan } = useApiLimits();

  const generatePlan = async () => {
    if (!goal || !duration || !intensity) {
      toast({
        title: "Eksik Bilgi",
        description: "Lütfen antrenman planı oluşturmak için tüm alanları doldurun.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Check if user has enough credits
      const hasCredits = await checkWorkoutPlan();
      if (!hasCredits) {
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase.functions.invoke("generate-workout-plan", {
        body: {
          goal,
          duration,
          intensity,
        },
      });

      if (error) throw error;

      setGeneratedPlan(data.plan);
      toast({
        title: "Başarılı!",
        description: "Antrenman planınız oluşturuldu.",
      });
    } catch (error) {
      toast({
        title: "Hata",
        description: "Antrenman planı oluşturulamadı. Lütfen tekrar deneyin.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4 px-4 sm:px-6 sm:space-y-8">
      <ComponentHeader
        title="Fitness Hedeflerinize Ulaşın"
        description="Fitness seviyenize ve hedeflerinize uygun özelleştirilmiş antrenman planları alın. Uzman tasarımlı egzersiz rutinleriyle vücudunuzu şekillendirin."
      />

      <div className="space-y-4">
        <Textarea
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="Fitness hedefinizi girin..."
          className="min-h-[100px] bg-card text-foreground border-border"
        />
        <Textarea
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          placeholder="Antrenman sürenizi girin..."
          className="min-h-[100px] bg-card text-foreground border-border"
        />
        <Textarea
          value={intensity}
          onChange={(e) => setIntensity(e.target.value)}
          placeholder="Yoğunluk seviyesini girin (örn: düşük, orta, yüksek)..."
          className="min-h-[100px] bg-card text-foreground border-border"
        />
        <Button onClick={generatePlan} disabled={isLoading} className="w-full">
          {isLoading ? "Oluşturuluyor..." : "Antrenman Planı Oluştur"}
        </Button>
      </div>

      {generatedPlan && (
        <div className="mt-4 p-4 bg-card border border-border rounded-lg">
          <h2 className="text-lg font-bold">Oluşturulan Antrenman Planı</h2>
          <p>{generatedPlan}</p>
        </div>
      )}
    </div>
  );
};

export default WorkoutPlanGenerator;