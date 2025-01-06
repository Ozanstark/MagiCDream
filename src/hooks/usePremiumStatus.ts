import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const usePremiumStatus = () => {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkPremiumStatus = async () => {
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('subscription_status')
          .maybeSingle();

        if (error) throw error;

        // If no profile exists, create one
        if (!profile) {
          const { data: user } = await supabase.auth.getUser();
          if (user) {
            const { error: insertError } = await supabase
              .from('profiles')
              .insert([{ id: user.user.id }]);
            
            if (insertError) throw insertError;
            setIsPremium(false);
          }
        } else {
          setIsPremium(profile.subscription_status === 'premium');
        }
      } catch (error) {
        console.error('Error checking premium status:', error);
        setIsPremium(false);
      } finally {
        setLoading(false);
      }
    };

    checkPremiumStatus();
  }, []);

  return { isPremium, loading };
};