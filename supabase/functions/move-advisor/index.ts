import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Pokemon {
  id: string;
  name_en: string;
  name_ar: string;
  types: string[];
  stats: {
    hp: number;
    atk: number;
    def: number;
    spa: number;
    spd: number;
    spe: number;
  };
}

interface Move {
  id: string;
  name_en: string;
  name_ar: string;
  type: string;
  category: string;
  power: number;
  accuracy: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { pokemon, learnset, language } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log(`Generating moveset for ${pokemon.name_en}`);

    const systemPrompt = language === 'ar' 
      ? `أنت خبير في استراتيجيات بوكيمون. اقترح أفضل 4 حركات للبوكيمون المعطى بناءً على إحصائياته وأنواعه. قدم تفسيراً موجزاً لاختياراتك.`
      : `You are a Pokémon strategy expert. Suggest the best 4 moves for the given Pokémon based on its stats and types. Provide a brief explanation for your choices.`;

    const movesInfo = learnset.map((m: Move) => 
      `- ${m.name_en} (${m.type}, ${m.category}, Power: ${m.power || 'N/A'}, Acc: ${m.accuracy || 'N/A'}%)`
    ).join('\n');

    const userPrompt = language === 'ar'
      ? `اقترح أفضل 4 حركات لهذا البوكيمون:

البوكيمون: ${pokemon.name_ar} (${pokemon.name_en})
- الأنواع: ${pokemon.types.join(', ')}
- الإحصائيات: HP ${pokemon.stats.hp}, ATK ${pokemon.stats.atk}, DEF ${pokemon.stats.def}, SpA ${pokemon.stats.spa}, SpD ${pokemon.stats.spd}, SPE ${pokemon.stats.spe}

الحركات المتاحة:
${movesInfo}

قدم:
1. أفضل 4 حركات (اذكر أسماءها بالإنجليزية)
2. سبب اختيار كل حركة
3. استراتيجية المعركة المقترحة`
      : `Suggest the best 4 moves for this Pokémon:

Pokémon: ${pokemon.name_en}
- Types: ${pokemon.types.join(', ')}
- Stats: HP ${pokemon.stats.hp}, ATK ${pokemon.stats.atk}, DEF ${pokemon.stats.def}, SpA ${pokemon.stats.spa}, SpD ${pokemon.stats.spd}, SPE ${pokemon.stats.spe}

Available moves:
${movesInfo}

Provide:
1. The best 4 moves
2. Reason for each choice
3. Suggested battle strategy`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required. Please add credits to your workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const suggestion = data.choices?.[0]?.message?.content || "Unable to generate suggestion";

    console.log("Moveset suggestion generated successfully");

    return new Response(JSON.stringify({ suggestion }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Error in move-advisor function:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
