import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { age, gender, height, weight, activityLevel, dietaryRestrictions, fitnessGoals } = await req.json()

    // Calculate BMR using Harris-Benedict equation
    let bmr
    if (gender === 'male') {
      bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
    } else {
      bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age)
    }

    // Calculate TDEE based on activity level
    const activityMultipliers = {
      sedentary: 1.2,
      moderately_active: 1.55,
      very_active: 1.9,
    }
    const tdee = bmr * activityMultipliers[activityLevel as keyof typeof activityMultipliers]

    // Generate diet plan based on user inputs
    const plan = `
Daily Caloric Needs: ${Math.round(tdee)} calories

Based on your profile:
- Age: ${age}
- Gender: ${gender}
- Height: ${height} cm
- Weight: ${weight} kg
- Activity Level: ${activityLevel}
- Dietary Restrictions: ${dietaryRestrictions.join(', ')}
- Fitness Goals: ${fitnessGoals.join(', ')}

Recommended Macronutrient Distribution:
- Protein: ${Math.round(tdee * 0.3 / 4)}g (30%)
- Carbohydrates: ${Math.round(tdee * 0.4 / 4)}g (40%)
- Fats: ${Math.round(tdee * 0.3 / 9)}g (30%)

Sample Meal Plan:

Breakfast (${Math.round(tdee * 0.25)} calories):
- Oatmeal with fruits and nuts
- Greek yogurt
- Green tea or coffee

Mid-Morning Snack (${Math.round(tdee * 0.1)} calories):
- Apple with almond butter
- Handful of mixed nuts

Lunch (${Math.round(tdee * 0.3)} calories):
- Grilled chicken breast or tofu
- Brown rice
- Steamed vegetables
- Olive oil dressing

Afternoon Snack (${Math.round(tdee * 0.1)} calories):
- Protein smoothie
- Whole grain crackers

Dinner (${Math.round(tdee * 0.25)} calories):
- Baked fish or legumes
- Quinoa
- Mixed salad
- Healthy fats (avocado/olive oil)

Notes:
- Drink at least 8 glasses of water daily
- Adjust portions based on hunger and energy levels
- Consider supplementation based on dietary restrictions
- Consult with a healthcare provider before starting any new diet plan
`

    return new Response(
      JSON.stringify({ plan }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})