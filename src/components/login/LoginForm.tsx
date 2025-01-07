import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";

export const LoginForm = () => {
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
  );
};