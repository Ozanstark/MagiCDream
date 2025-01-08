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

  const checkCredits = async (requiredAmount: number): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "Please log in to continue",
          variant: "destructive",
        });
        return false;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('credits')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (!profile || profile.credits < requiredAmount) {
        toast({
          title: "Insufficient Credits",
          description: `This action requires ${requiredAmount} credits. Your current balance: ${profile?.credits ?? 0}`,
          variant: "destructive",
        });
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error checking credits:', error);
      toast({
        title: "Error",
        description: "Failed to check credits",
        variant: "destructive",
      });
      return false;
    }
  };

  const deductCredits = async (amount: number, description: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.rpc('update_user_credits', {
        user_id: user.id,
        amount: -amount,
        action_type: 'credit_consumption',
        description: description
      });

      if (error) throw error;
      await fetchCredits();
    } catch (error) {
      console.error('Error deducting credits:', error);
      toast({
        title: "Error",
        description: "Failed to deduct credits",
        variant: "destructive",
      });
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

  return { 
    credits, 
    isLoading, 
    refreshCredits: fetchCredits,
    checkCredits,
    deductCredits
  };
};