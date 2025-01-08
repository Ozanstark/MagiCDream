import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
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
İşte size özel antrenman planınız:

Hedef: ${goal}
Süre: ${duration}
Yoğunluk: ${intensity}

Isınma (10 dakika):
- Hafif kardio (yerinde koşu, jumping jack)
- Dinamik germe hareketleri

Ana Antrenman (${duration}):
${intensity === 'yüksek' || intensity === 'high' ? '- Yüksek yoğunluklu interval antrenmanı (HIIT)' : 
  intensity === 'orta' || intensity === 'medium' ? '- Orta ağırlıklarla devre antrenmanı' : 
  '- Vücut ağırlığıyla düşük tempolu egzersizler'}
- ${goal.toLowerCase()} hedefine yönelik özel egzersizler
- ${intensity.toLowerCase()} yoğunluğa göre ayarlanmış dinlenme süreleri

Soğuma (5 dakika):
- Hafif germe hareketleri
- Derin nefes egzersizleri

Unutmayın:
- Bol su için
- Doğru form kullanın
- Vücudunuzu dinleyin
- Yoğunluğu ihtiyacınıza göre ayarlayın
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