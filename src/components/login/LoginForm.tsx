import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { AuthChangeEvent, Session } from "@supabase/supabase-js";

export const LoginForm = () => {
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      if (event === "SIGNED_OUT") {
        toast({
          variant: "destructive",
          title: "Hesap silindi",
          description: "Hesabınız başarıyla silindi.",
        });
      }
      
      if (event === "PASSWORD_RECOVERY") {
        toast({
          title: "Şifre sıfırlama",
          description: "Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.",
        });
      }
      
      if (event === "USER_UPDATED" && !session) {
        toast({
          variant: "destructive",
          title: "Giriş hatası",
          description: "E-posta veya şifre hatalı. Lütfen bilgilerinizi kontrol edip tekrar deneyin.",
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [toast]);

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center lg:hidden">
          <h2 className="text-3xl font-bold rainbow-text mb-4">
            magic-painting-engine-77
          </h2>
          <p className="text-muted-foreground mb-8">
            Yapay zeka destekli içerik üretim platformu
          </p>
        </div>
        
        <div className="bg-[#1A1F2C] p-8 rounded-lg border border-[#9b87f5]/20 shadow-xl">
          <h2 className="text-2xl font-semibold mb-6 text-center text-white">Giriş Yap</h2>
          <Auth
            supabaseClient={supabase}
            providers={["twitter"]}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#FFD700',
                    brandAccent: '#F5C518',
                    inputBackground: '#221F26',
                    inputText: '#FFFFFF',
                    inputBorder: '#403E43',
                    inputBorderFocus: '#9b87f5',
                    inputBorderHover: '#7E69AB',
                  }
                }
              },
              className: {
                button: 'button-primary w-full py-3',
                input: 'input-premium bg-[#221F26] border-[#403E43] text-white',
                label: 'text-[#C8C8C9] mb-2',
                container: 'space-y-4',
                divider: 'bg-[#403E43]',
                anchor: 'text-[#9b87f5] hover:text-[#7E69AB] transition-colors',
              }
            }}
            localization={{
              variables: {
                sign_in: {
                  email_label: "E-posta",
                  password_label: "Şifre",
                  button_label: "Giriş Yap",
                  loading_button_label: "Giriş yapılıyor...",
                  password_input_placeholder: "Şifreniz",
                  email_input_placeholder: "E-posta adresiniz",
                  social_provider_text: "Twitter ile devam et"
                },
                sign_up: {
                  email_label: "E-posta",
                  password_label: "Şifre",
                  button_label: "Kayıt Ol",
                  loading_button_label: "Kayıt olunuyor...",
                  password_input_placeholder: "Şifreniz",
                  email_input_placeholder: "E-posta adresiniz",
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};