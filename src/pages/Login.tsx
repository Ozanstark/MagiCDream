import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome to Magic Dream
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to start creating
          </p>
        </div>

        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={['twitter']}
          redirectTo="https://magic-painting-engine-77.lovable.app/callback"
          theme="light"
          showLinks={false}
          view="sign_in"
          localization={{
            variables: {
              sign_in: {
                social_provider_text: "Continue with {{provider}}"
              }
            }
          }}
        />

        <div className="mt-8">
          <FeaturesList />
        </div>

        <div className="text-center text-xs text-gray-500">
          By signing in, you agree to our{' '}
          <a href="https://magic-painting-engine-77.lovable.app/terms" className="text-blue-500 hover:text-blue-700">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="https://magic-painting-engine-77.lovable.app/privacy" className="text-blue-500 hover:text-blue-700">
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;