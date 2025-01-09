import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { FeaturesList } from '@/components/login/FeaturesList';
import { LoginForm } from '@/components/login/LoginForm';

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/');
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        navigate('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 hidden lg:flex bg-muted items-center justify-center p-8">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold rainbow-text mb-8">
            CreativeMind Studio
          </h1>
          <p className="text-xl text-muted-foreground mb-12">
            Yapay zeka destekli içerik üretim platformu
          </p>
          <FeaturesList />
        </div>
      </div>
      
      <LoginForm />
    </div>
  );
};

export default Login;