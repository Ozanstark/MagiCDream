import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Sparkles, Wand2, Lock, Palette } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/");
      }
    });
  }, [navigate]);

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

  return (
    <div className="min-h-screen flex">
      {/* Sol Taraf - Özellikler */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-background to-secondary p-12 flex-col justify-center">
        <div className="space-y-8">
          <h1 className="text-4xl font-bold rainbow-text">
            CreativeMind Studio
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

      {/* Sağ Taraf - Giriş Formu */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:hidden">
            <h2 className="text-3xl font-bold rainbow-text mb-4">
              CreativeMind Studio
            </h2>
            <p className="text-muted-foreground mb-8">
              Yapay zeka destekli içerik üretim platformu
            </p>
          </div>
          
          <div className="bg-card p-8 rounded-lg border border-border shadow-lg">
            <h2 className="text-2xl font-semibold mb-6 text-center">Giriş Yap</h2>
            <Auth
              supabaseClient={supabase}
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: 'hsl(var(--primary))',
                      brandAccent: 'hsl(var(--primary))',
                      inputBackground: 'hsl(var(--background))',
                      inputText: 'hsl(var(--foreground))',
                      inputBorder: 'hsl(var(--border))',
                      inputBorderFocus: 'hsl(var(--ring))',
                      inputBorderHover: 'hsl(var(--border))',
                    }
                  }
                },
                className: {
                  button: 'button-primary',
                  input: 'input-premium',
                  label: 'text-foreground',
                }
              }}
              localization={{
                variables: {
                  sign_in: {
                    email_label: "E-posta",
                    password_label: "Şifre",
                    button_label: "Giriş Yap",
                  },
                  sign_up: {
                    email_label: "E-posta",
                    password_label: "Şifre",
                    button_label: "Kayıt Ol",
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;