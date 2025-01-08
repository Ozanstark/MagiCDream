import { useState } from "react";
import ComponentHeader from "./shared/ComponentHeader";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useToast } from "./ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useApiLimits } from "@/hooks/useApiLimits";

const DietPlanGenerator = () => {
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    height: "",
    weight: "",
    activityLevel: "",
    dietaryRestrictions: "",
    fitnessGoals: "",
  });
  const [generatedPlan, setGeneratedPlan] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { checkDietPlan } = useApiLimits();

  const generateDietPlan = async () => {
    if (!Object.values(formData).every(value => value)) {
      toast({
        title: "Eksik Bilgi",
        description: "Lütfen diyet planı oluşturmak için tüm alanları doldurun.",
        variant: "destructive",
      });
      return;
    }

    console.log('Diyet Planı oluşturmadan önce krediler kontrol ediliyor...');
    const canProceed = await checkDietPlan();
    console.log('Kredi kontrol sonucu:', canProceed);
    if (!canProceed) return;

    setIsLoading(true);
    try {
      const dietaryRestrictionsArray = formData.dietaryRestrictions
        .split(',')
        .map(item => item.trim())
        .filter(item => item);
      
      const fitnessGoalsArray = formData.fitnessGoals
        .split(',')
        .map(item => item.trim())
        .filter(item => item);

      const { data, error } = await supabase.functions.invoke("generate-diet-plan", {
        body: {
          age: parseInt(formData.age),
          gender: formData.gender,
          height: parseFloat(formData.height),
          weight: parseFloat(formData.weight),
          activityLevel: formData.activityLevel,
          dietaryRestrictions: dietaryRestrictionsArray,
          fitnessGoals: fitnessGoalsArray,
        },
      });

      if (error) throw error;

      if (data?.plan) {
        setGeneratedPlan(data.plan);
        console.log('Diyet planı başarıyla oluşturuldu, 200 kredi düşülecek');
        toast({
          title: "Başarılı!",
          description: "Diyet planınız oluşturuldu.",
        });
      } else {
        console.error('Beklenmeyen yanıt formatı:', data);
        throw new Error('Sunucudan beklenmeyen yanıt formatı');
      }
    } catch (error) {
      console.error('Diyet planı oluşturulurken hata:', error);
      toast({
        title: "Hata",
        description: "Diyet planı oluşturulamadı. Lütfen tekrar deneyin.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4 px-4 sm:px-6 sm:space-y-8">
      <ComponentHeader
        title="Sağlığınızı Dönüştürün"
        description="Hedeflerinize uygun kişiselleştirilmiş diyet planları alın. Daha sağlıklı bir yaşam tarzına giden yolculuğunuz doğru beslenme planıyla başlar."
      />
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Textarea
            value={formData.age}
            onChange={(e) => handleInputChange("age", e.target.value)}
            placeholder="Yaşınızı girin..."
            className="min-h-[100px] bg-card text-foreground border-gray-700 resize-none"
          />
          <Textarea
            value={formData.gender}
            onChange={(e) => handleInputChange("gender", e.target.value)}
            placeholder="Cinsiyetinizi girin..."
            className="min-h-[100px] bg-card text-foreground border-gray-700 resize-none"
          />
          <Textarea
            value={formData.height}
            onChange={(e) => handleInputChange("height", e.target.value)}
            placeholder="Boyunuzu girin (cm)..."
            className="min-h-[100px] bg-card text-foreground border-gray-700 resize-none"
          />
          <Textarea
            value={formData.weight}
            onChange={(e) => handleInputChange("weight", e.target.value)}
            placeholder="Kilonuzu girin (kg)..."
            className="min-h-[100px] bg-card text-foreground border-gray-700 resize-none"
          />
        </div>
        <Textarea
          value={formData.activityLevel}
          onChange={(e) => handleInputChange("activityLevel", e.target.value)}
          placeholder="Aktivite seviyenizi girin (sedentary, moderately_active, very_active)..."
          className="min-h-[100px] bg-card text-foreground border-gray-700 resize-none"
        />
        <Textarea
          value={formData.dietaryRestrictions}
          onChange={(e) => handleInputChange("dietaryRestrictions", e.target.value)}
          placeholder="Diyet kısıtlamalarınızı girin (virgülle ayırın)..."
          className="min-h-[100px] bg-card text-foreground border-gray-700 resize-none"
        />
        <Textarea
          value={formData.fitnessGoals}
          onChange={(e) => handleInputChange("fitnessGoals", e.target.value)}
          placeholder="Fitness hedeflerinizi girin (virgülle ayırın)..."
          className="min-h-[100px] bg-card text-foreground border-gray-700 resize-none"
        />
        <Button onClick={generateDietPlan} disabled={isLoading} className="w-full">
          {isLoading ? "Oluşturuluyor..." : "Diyet Planı Oluştur"}
        </Button>
      </div>

      {generatedPlan && (
        <div className="mt-4 p-4 bg-muted rounded-lg">
          <h2 className="text-lg font-bold">Oluşturulan Diyet Planı</h2>
          <p className="whitespace-pre-wrap">{generatedPlan}</p>
        </div>
      )}
    </div>
  );
};

export default DietPlanGenerator;