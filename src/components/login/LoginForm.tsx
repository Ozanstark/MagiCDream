import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { AuthChangeEvent, Session, AuthError, AuthApiError } from "@supabase/supabase-js";

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

  const handleAuthError = (error: AuthError) => {
    let errorMessage = "Bir hata oluştu. Lütfen tekrar deneyin.";
    
    if (error instanceof AuthApiError) {
      switch (error.status) {
        case 400:
          errorMessage = "E-posta veya şifre hatalı. Lütfen bilgilerinizi kontrol edip tekrar deneyin.";
          break;
        case 422:
          errorMessage = "Geçersiz e-posta formatı. Lütfen geçerli bir e-posta adresi girin.";
          break;
        default:
          errorMessage = "Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.";
      }
    }
    
    toast({
      variant: "destructive",
      title: "Giriş hatası",
      description: errorMessage,
    });
  };

  return (
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
                  loading_button_label: "Giriş yapılıyor...",
                  password_input_placeholder: "Şifreniz",
                  email_input_placeholder: "E-posta adresiniz",
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
            onError={handleAuthError}
          />
        </div>
      </div>
    </div>
  );
};