import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";

export const useCredits = () => {
  const [credits, setCredits] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchCredits();
    
    // Subscribe to realtime credits updates
    const setupRealtimeSubscription = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const channel = supabase
        .channel('credits_changes')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'profiles',
            filter: `id=eq.${user.id}`
          },
          (payload) => {
            setCredits(payload.new.credits);
          }
        )
        .subscribe();

      return channel;
    };

    // Auto refresh credits every 5 minutes
    const refreshInterval = setInterval(() => {
      fetchCredits();
    }, 5 * 60 * 1000); // 5 minutes

    // Setup subscription and store cleanup function
    let channel: ReturnType<typeof setupRealtimeSubscription>;
    setupRealtimeSubscription().then(ch => {
      channel = ch;
    });

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
      clearInterval(refreshInterval);
    };
  }, []);

  const fetchCredits = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('credits')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;
      
      if (profile) {
        setCredits(profile.credits);
      }
    } catch (error) {
      console.error('Error fetching credits:', error);
      toast({
        title: "Error",
        description: "Failed to fetch credits",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { credits, isLoading, refreshCredits: fetchCredits };
};