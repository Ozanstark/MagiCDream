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
    const channel = supabase
      .channel('credits_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${supabase.auth.getUser()}`
        },
        (payload) => {
          setCredits(payload.new.credits);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchCredits = async () => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('credits')
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

  return { credits, isLoading };
};