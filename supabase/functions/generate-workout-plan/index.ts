import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { corsHeaders } from '../_shared/cors.ts';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { goal, duration, intensity } = await req.json();
    console.log('Received workout plan request:', { goal, duration, intensity });

    if (!goal || !duration || !intensity) {
      throw new Error('Missing required fields');
    }

    // Generate a workout plan based on the inputs
    const workoutPlan = `
Here's your personalized workout plan:

Goal: ${goal}
Duration: ${duration}
Intensity: ${intensity}

Warm-up (10 minutes):
- Light cardio (jogging in place, jumping jacks)
- Dynamic stretching

Main Workout (${duration}):
${intensity === 'high' ? '- High-intensity interval training (HIIT)' : 
  intensity === 'medium' ? '- Circuit training with moderate weights' : 
  '- Low-impact exercises with body weight'}
- Focus on ${goal.toLowerCase()} through targeted exercises
- Rest periods adjusted for ${intensity.toLowerCase()} intensity

Cool-down (5 minutes):
- Light stretching
- Deep breathing exercises

Remember to:
- Stay hydrated
- Maintain proper form
- Listen to your body
- Adjust intensity as needed
    `;

    console.log('Generated workout plan successfully');

    return new Response(JSON.stringify({ plan: workoutPlan }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error generating workout plan:', error.message);
    
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});