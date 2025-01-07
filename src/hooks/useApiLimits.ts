import { useState } from "react";
import { useToast } from "./use-toast";
import { supabase } from "@/integrations/supabase/client";

const CREDIT_COSTS = {
  IMAGE_GENERATION: 20,
  TEXT_GENERATION: 10,
  BLOG_INTRO: 15,
  ESSAY_HUMANIZER: 20,
  TWITTER_BIO: 5,
  LINKEDIN_HEADLINE: 5,
  WEDDING_SPEECH: 20,
  DIET_PLAN: 200,
  WORKOUT_PLAN: 200,
  MUSIC_GENERATION: 50,
  TWEET_GENERATION: 5,
  INSTAGRAM_ANALYSIS: 50,
  EMAIL_GENERATION: 15,
  PARAGRAPH_HUMANIZER: 20,
  TRANSLATION: 10,
  MESSAGE_ENCRYPTION: 50,
  PHOTO_ENCRYPTION: 50,
} as const;

export const useApiLimits = () => {
  const { toast } = useToast();
  const [isChecking, setIsChecking] = useState(false);

  const checkCredits = async (requiredCredits: number): Promise<boolean> => {
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

      if (!profile || profile.credits < requiredCredits) {
        toast({
          title: "Insufficient Credits",
          description: `This action requires ${requiredCredits} credits. Your current balance: ${profile?.credits ?? 0}`,
          variant: "destructive",
        });
        return false;
      }

      // If we have enough credits, consume them immediately
      const { error: updateError } = await supabase.rpc('update_user_credits', {
        user_id: user.id,
        amount: -requiredCredits,
        action_type: 'credit_consumption',
        description: `Used ${requiredCredits} credits`
      });

      if (updateError) throw updateError;

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

  // Helper functions for specific features
  const checkImageGeneration = () => checkCredits(CREDIT_COSTS.IMAGE_GENERATION);
  const checkTextGeneration = () => checkCredits(CREDIT_COSTS.TEXT_GENERATION);
  const checkBlogIntro = () => checkCredits(CREDIT_COSTS.BLOG_INTRO);
  const checkEssayHumanizer = () => checkCredits(CREDIT_COSTS.ESSAY_HUMANIZER);
  const checkTwitterBio = () => checkCredits(CREDIT_COSTS.TWITTER_BIO);
  const checkLinkedInHeadline = () => checkCredits(CREDIT_COSTS.LINKEDIN_HEADLINE);
  const checkWeddingSpeech = () => checkCredits(CREDIT_COSTS.WEDDING_SPEECH);
  const checkDietPlan = () => checkCredits(CREDIT_COSTS.DIET_PLAN);
  const checkWorkoutPlan = () => checkCredits(CREDIT_COSTS.WORKOUT_PLAN);
  const checkMusicGeneration = () => checkCredits(CREDIT_COSTS.MUSIC_GENERATION);
  const checkTweetGeneration = () => checkCredits(CREDIT_COSTS.TWEET_GENERATION);
  const checkInstagramAnalysis = () => checkCredits(CREDIT_COSTS.INSTAGRAM_ANALYSIS);
  const checkEmailGeneration = () => checkCredits(CREDIT_COSTS.EMAIL_GENERATION);
  const checkParagraphHumanizer = () => checkCredits(CREDIT_COSTS.PARAGRAPH_HUMANIZER);
  const checkTranslation = () => checkCredits(CREDIT_COSTS.TRANSLATION);
  const checkMessageEncryption = () => checkCredits(CREDIT_COSTS.MESSAGE_ENCRYPTION);
  const checkPhotoEncryption = () => checkCredits(CREDIT_COSTS.PHOTO_ENCRYPTION);

  return {
    isChecking,
    checkImageGeneration,
    checkTextGeneration,
    checkBlogIntro,
    checkEssayHumanizer,
    checkTwitterBio,
    checkLinkedInHeadline,
    checkWeddingSpeech,
    checkDietPlan,
    checkWorkoutPlan,
    checkMusicGeneration,
    checkTweetGeneration,
    checkInstagramAnalysis,
    checkEmailGeneration,
    checkParagraphHumanizer,
    checkTranslation,
    checkMessageEncryption,
    checkPhotoEncryption,
  };
};