import { useState, useEffect } from "react";
import { Upload, CheckCircle2, BarChart } from "lucide-react";

const InstagramAnalysisDemo = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev >= 3 ? 0 : prev + 1));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full bg-black/90 rounded-lg p-6 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8">
        {/* Upload Step */}
        <div className={`transition-all duration-500 ${step === 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="flex flex-col items-center space-y-4 text-white/90">
            <Upload className="w-16 h-16 animate-bounce" />
            <p className="text-lg font-medium">Fotoğraflarınızı Yükleyin</p>
          </div>
        </div>

        {/* Analysis Step */}
        <div className={`transition-all duration-500 ${step === 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="flex flex-col items-center space-y-4 text-white/90">
            <div className="relative">
              <BarChart className="w-16 h-16" />
              <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
            </div>
            <p className="text-lg font-medium">Yapay Zeka Analizi</p>
          </div>
        </div>

        {/* Results Step */}
        <div className={`transition-all duration-500 ${step === 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="flex flex-col items-center space-y-4 text-white/90">
            <CheckCircle2 className="w-16 h-16 text-green-500" />
            <div className="text-center">
              <p className="text-lg font-medium mb-2">Analiz Sonuçları</p>
              <div className="space-y-2">
                <div className="bg-white/10 p-3 rounded-lg">
                  <p className="text-sm">Instagram Skoru: 85/100</p>
                </div>
                <div className="bg-white/10 p-3 rounded-lg">
                  <p className="text-sm">Öneriler ve detaylı geri bildirim</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Step */}
        <div className={`transition-all duration-500 ${step === 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="flex flex-col items-center space-y-4 text-white/90">
            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="bg-white/10 p-4 rounded-lg text-center">
                <p className="text-sm font-medium">Foto #1</p>
                <p className="text-lg font-bold text-green-500">85/100</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg text-center">
                <p className="text-sm font-medium">Foto #2</p>
                <p className="text-lg font-bold text-yellow-500">72/100</p>
              </div>
            </div>
            <p className="text-sm text-center">Fotoğraflarınızı karşılaştırın ve en iyi performans gösterecek olanı seçin</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstagramAnalysisDemo;