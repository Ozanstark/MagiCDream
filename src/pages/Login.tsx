import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/");
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-center text-2xl font-bold mb-8">Giriş Yap</h2>
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#404040',
                  brandAccent: '#2d2d2d'
                }
              }
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
  );
};

export default Login;