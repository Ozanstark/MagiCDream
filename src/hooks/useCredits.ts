import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";
import { RealtimeChannel } from "@supabase/supabase-js";

export const useCredits = () => {
  const [credits, setCredits] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

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
        console.log('Credits fetched:', profile.credits); // Debug log
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

  useEffect(() => {
    console.log('Setting up credits monitoring...'); // Debug log
    fetchCredits();
    
    // Subscribe to realtime credits updates
    let channel: RealtimeChannel | null = null;

    const setupRealtimeSubscription = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      console.log('Setting up realtime subscription for user:', user.id); // Debug log

      const newChannel = supabase
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
            console.log('Realtime credit update received:', payload.new.credits); // Debug log
            setCredits(payload.new.credits);
          }
        )
        .subscribe();

      return newChannel;
    };

    // Auto refresh credits every 5 minutes
    const refreshInterval = setInterval(() => {
      console.log('Auto-refreshing credits...'); // Debug log
      fetchCredits();
    }, 5 * 60 * 1000); // 5 minutes

    // Setup subscription
    setupRealtimeSubscription().then(ch => {
      if (ch) {
        channel = ch;
        console.log('Realtime subscription setup complete'); // Debug log
      }
    });

    // Cleanup function
    return () => {
      console.log('Cleaning up credits monitoring...'); // Debug log
      if (channel) {
        supabase.removeChannel(channel);
      }
      clearInterval(refreshInterval);
    };
  }, []);

  return { credits, isLoading, refreshCredits: fetchCredits };
};