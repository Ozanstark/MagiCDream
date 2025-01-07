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
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('credits')
        .maybeSingle();

      if (error) throw error;

      if (!profile || profile.credits < requiredCredits) {
        toast({
          title: "Yetersiz Kredi",
          description: `Bu işlem için ${requiredCredits} krediye ihtiyacınız var. Mevcut krediniz: ${profile?.credits ?? 0}`,
          variant: "destructive",
        });
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error checking credits:', error);
      toast({
        title: "Hata",
        description: "Kredi kontrolü yapılırken bir hata oluştu",
        variant: "destructive",
      });
      return false;
    }
  };

  const consumeCredits = async (amount: number, actionType: string): Promise<boolean> => {
    setIsChecking(true);
    try {
      const hasEnoughCredits = await checkCredits(amount);
      if (!hasEnoughCredits) return false;

      const { error } = await supabase.rpc('update_user_credits', {
        amount: -amount,
        action_type: actionType,
        description: `Used ${amount} credits for ${actionType}`
      });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error consuming credits:', error);
      toast({
        title: "Hata",
        description: "Kredi kullanımı sırasında bir hata oluştu",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsChecking(false);
    }
  };

  // Helper functions for specific features
  const checkImageGeneration = () => consumeCredits(CREDIT_COSTS.IMAGE_GENERATION, 'image_generation');
  const checkTextGeneration = () => consumeCredits(CREDIT_COSTS.TEXT_GENERATION, 'text_generation');
  const checkBlogIntro = () => consumeCredits(CREDIT_COSTS.BLOG_INTRO, 'blog_intro');
  const checkEssayHumanizer = () => consumeCredits(CREDIT_COSTS.ESSAY_HUMANIZER, 'essay_humanizer');
  const checkTwitterBio = () => consumeCredits(CREDIT_COSTS.TWITTER_BIO, 'twitter_bio');
  const checkLinkedInHeadline = () => consumeCredits(CREDIT_COSTS.LINKEDIN_HEADLINE, 'linkedin_headline');
  const checkWeddingSpeech = () => consumeCredits(CREDIT_COSTS.WEDDING_SPEECH, 'wedding_speech');
  const checkDietPlan = () => consumeCredits(CREDIT_COSTS.DIET_PLAN, 'diet_plan');
  const checkWorkoutPlan = () => consumeCredits(CREDIT_COSTS.WORKOUT_PLAN, 'workout_plan');
  const checkMusicGeneration = () => consumeCredits(CREDIT_COSTS.MUSIC_GENERATION, 'music_generation');
  const checkTweetGeneration = () => consumeCredits(CREDIT_COSTS.TWEET_GENERATION, 'tweet_generation');
  const checkInstagramAnalysis = () => consumeCredits(CREDIT_COSTS.INSTAGRAM_ANALYSIS, 'instagram_analysis');
  const checkEmailGeneration = () => consumeCredits(CREDIT_COSTS.EMAIL_GENERATION, 'email_generation');
  const checkParagraphHumanizer = () => consumeCredits(CREDIT_COSTS.PARAGRAPH_HUMANIZER, 'paragraph_humanizer');
  const checkTranslation = () => consumeCredits(CREDIT_COSTS.TRANSLATION, 'translation');
  const checkMessageEncryption = () => consumeCredits(CREDIT_COSTS.MESSAGE_ENCRYPTION, 'message_encryption');
  const checkPhotoEncryption = () => consumeCredits(CREDIT_COSTS.PHOTO_ENCRYPTION, 'photo_encryption');

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