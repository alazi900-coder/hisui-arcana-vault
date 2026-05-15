import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SpawnInfo {
  area: string;
  conditions: string;
  rarity: string;
  isAlpha?: boolean;
}

const CATCH_HELPER_PROMPT = `You are a Pokémon Legends: Arceus catching expert. Give practical, concise tips for catching specific Pokémon.

Your advice should include:
1. Best time to catch (day/night/weather)
2. Best approach strategy (sneaky, aggressive, bait)
3. Recommended items (berries, balls, smoke bombs)
4. Special techniques if applicable
5. Alpha-specific tips if relevant

Keep responses under 150 words. Be specific and actionable.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { pokemon, spawns, language } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build the prompt with spawn data
    const spawnDetails = (spawns as SpawnInfo[]).map((s) => 
      `- ${s.area}: ${s.conditions} (${s.rarity}${s.isAlpha ? ', Alpha' : ''})`
    ).join('\n');

    const userPrompt = `Give me catching tips for ${pokemon.name} (${pokemon.types.join('/')}).

Known spawn locations:
${spawnDetails || 'No specific spawn data available.'}

${language === 'ar' ? 'Please respond in Arabic.' : 'Please respond in English.'}`;

    console.log("Generating catch advice for:", pokemon.name);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: CATCH_HELPER_PROMPT },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted" }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const advice = data.choices?.[0]?.message?.content || "Unable to generate advice.";

    return new Response(JSON.stringify({ advice }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("Catch helper error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
