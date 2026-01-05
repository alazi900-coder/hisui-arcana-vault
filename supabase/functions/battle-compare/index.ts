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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { pokemon1, pokemon2, language } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log(`Comparing ${pokemon1.name_en} vs ${pokemon2.name_en}`);

    const calcBST = (stats: Pokemon['stats']) => 
      stats.hp + stats.atk + stats.def + stats.spa + stats.spd + stats.spe;

    const systemPrompt = language === 'ar' 
      ? "أنت محلل معارك بوكيمون خبير. قم بتحليل المقارنة بين بوكيمونين وحدد من سيفوز في المعركة. قدم تحليلاً موجزاً ومفيداً."
      : "You are an expert Pokémon battle analyst. Analyze the comparison between two Pokémon and determine who would win in battle. Provide a concise and helpful analysis.";

    const bst1 = calcBST(pokemon1.stats);
    const bst2 = calcBST(pokemon2.stats);

    const userPrompt = language === 'ar'
      ? `قارن بين هذين البوكيمونين:

البوكيمون الأول: ${pokemon1.name_ar} (${pokemon1.name_en})
- الأنواع: ${pokemon1.types.join(', ')}
- الإحصائيات: HP ${pokemon1.stats.hp}, ATK ${pokemon1.stats.atk}, DEF ${pokemon1.stats.def}, SpA ${pokemon1.stats.spa}, SpD ${pokemon1.stats.spd}, SPE ${pokemon1.stats.spe}
- BST: ${bst1}

البوكيمون الثاني: ${pokemon2.name_ar} (${pokemon2.name_en})
- الأنواع: ${pokemon2.types.join(', ')}
- الإحصائيات: HP ${pokemon2.stats.hp}, ATK ${pokemon2.stats.atk}, DEF ${pokemon2.stats.def}, SpA ${pokemon2.stats.spa}, SpD ${pokemon2.stats.spd}, SPE ${pokemon2.stats.spe}
- BST: ${bst2}

قدم تحليلاً موجزاً يتضمن:
1. من سيفوز ولماذا
2. نقاط القوة والضعف لكل منهما
3. نصيحة سريعة للمعركة`
      : `Compare these two Pokémon:

Pokémon 1: ${pokemon1.name_en}
- Types: ${pokemon1.types.join(', ')}
- Stats: HP ${pokemon1.stats.hp}, ATK ${pokemon1.stats.atk}, DEF ${pokemon1.stats.def}, SpA ${pokemon1.stats.spa}, SpD ${pokemon1.stats.spd}, SPE ${pokemon1.stats.spe}
- BST: ${bst1}

Pokémon 2: ${pokemon2.name_en}
- Types: ${pokemon2.types.join(', ')}
- Stats: HP ${pokemon2.stats.hp}, ATK ${pokemon2.stats.atk}, DEF ${pokemon2.stats.def}, SpA ${pokemon2.stats.spa}, SpD ${pokemon2.stats.spd}, SPE ${pokemon2.stats.spe}
- BST: ${bst2}

Provide a concise analysis that includes:
1. Who would win and why
2. Strengths and weaknesses of each
3. Quick battle tip`;

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
    const analysis = data.choices?.[0]?.message?.content || "Unable to generate analysis";

    console.log("Battle analysis generated successfully");

    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Error in battle-compare function:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
