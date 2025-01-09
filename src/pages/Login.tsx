import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { FeaturesList } from '@/components/login/FeaturesList';
import { LoginForm } from '@/components/login/LoginForm';

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Hash fragment'ı kontrol et ve işle
    const handleHashFragment = async () => {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      if (hashParams.has('access_token')) {
        // Hash varsa ana sayfaya yönlendir, Supabase otomatik olarak session'ı işleyecek
        navigate('/', { replace: true });
        return;
      }
    };

    handleHashFragment();

    // Normal session kontrolü
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/', { replace: true });
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        navigate('/', { replace: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen flex">
      <FeaturesList />
      <LoginForm />
    </div>
  );
};

export default Login;