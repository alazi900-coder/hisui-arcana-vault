import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TeamMember {
  name: string;
  types: string[];
}

const POKEMON_SYSTEM_PROMPT = `You are an expert Pokémon assistant for Pokémon Legends: Arceus (Hisui region). You help players with:

1. **Type Matchups**: Which Pokémon are strong/weak against others
2. **Team Building**: Suggesting balanced teams with good type coverage
3. **Evolution Methods**: How to evolve specific Pokémon
4. **Location Info**: Where to find specific Pokémon in Hisui
5. **Move Recommendations**: Best moves for each Pokémon
6. **Battle Strategies**: How to defeat tough opponents

Key information about Hisui:
- There are 242 Pokémon in the Hisuian Pokédex
- Some Pokémon have unique Hisuian forms
- The game uses Agile/Strong Style moves
- Alpha Pokémon are larger and stronger

Always be helpful, accurate, and concise. If asked about something outside Pokémon, politely redirect to Pokémon topics.
Respond in the same language as the user's message (Arabic, English, etc.).`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, context } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build context-aware system prompt
    let systemPrompt = POKEMON_SYSTEM_PROMPT;
    
    if (context) {
      if (context.currentPokemon) {
        systemPrompt += `\n\nThe user is currently viewing: ${context.currentPokemon.name} (${context.currentPokemon.types.join('/')})`;
      }
      if (context.team && context.team.length > 0) {
        systemPrompt += `\n\nUser's current team: ${(context.team as TeamMember[]).map((p) => p.name).join(', ')}`;
      }
    }

    console.log("Processing AI chat request with", messages.length, "messages");

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
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ 
          error: "Rate limit exceeded. Please try again later." 
        }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      if (response.status === 402) {
        return new Response(JSON.stringify({ 
          error: "AI credits exhausted. Please add credits to continue." 
        }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' },
    });

  } catch (error) {
    console.error("Pokemon AI Chat error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
