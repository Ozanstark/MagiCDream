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
          .single();

        if (error) throw error;
        setIsPremium(profile?.subscription_status === 'premium');
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