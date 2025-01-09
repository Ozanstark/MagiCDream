import { Sparkles, Wand2, Lock, Palette } from "lucide-react";

const features = [
  {
    icon: <Wand2 className="w-6 h-6 text-primary" />,
    title: "Yapay Zeka Destekli İçerik Üretimi",
    description: "Metinler, görseller ve sosyal medya içerikleri için AI destekli üretim araçları"
  },
  {
    icon: <Lock className="w-6 h-6 text-primary" />,
    title: "Güvenli Şifreleme",
    description: "Mesajlarınız ve fotoğraflarınız için gelişmiş şifreleme teknolojisi"
  },
  {
    icon: <Palette className="w-6 h-6 text-primary" />,
    title: "Özelleştirilebilir Tasarımlar",
    description: "İhtiyaçlarınıza göre özelleştirilebilen içerik üretim araçları"
  },
  {
    icon: <Sparkles className="w-6 h-6 text-primary" />,
    title: "Premium Özellikler",
    description: "Daha fazla özellik ve içerik üretimi için premium üyelik seçenekleri"
  }
];

export const FeaturesList = () => {
  return (
    <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-background to-secondary p-12 flex-col justify-center">
      <div className="space-y-8">
        <h1 className="text-4xl font-bold rainbow-text">
          Ucretsiz Yapay Zeka
        </h1>
        <p className="text-muted-foreground text-lg mb-12">
          Yapay zeka destekli içerik üretim platformu
        </p>
        
        <div className="grid gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="flex items-start space-x-4 p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-300"
            >
              <div className="mt-1 p-2 rounded-lg bg-background/50">
                {feature.icon}
              </div>
              <div>
                <h3 className="font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};