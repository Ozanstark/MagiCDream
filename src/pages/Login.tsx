import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { FeaturesList } from "@/components/login/FeaturesList";
import { LoginForm } from "@/components/login/LoginForm";

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
    <div className="min-h-screen flex">
      <FeaturesList />
      <LoginForm />
    </div>
  );
};

export default Login;