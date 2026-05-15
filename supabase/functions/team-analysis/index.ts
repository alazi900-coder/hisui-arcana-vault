import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TeamMember {
  name: string;
  types: string[];
}

const TEAM_ANALYSIS_PROMPT = `You are a Pokémon team analysis expert for Pokémon Legends: Arceus.

Analyze the given team and provide:
1. **Overall Assessment** (1-2 sentences)
2. **Type Coverage** - What types are well-covered and what gaps exist
3. **Weaknesses** - Common types that threaten the team
4. **Strengths** - What the team does well
5. **Suggestions** - 2-3 specific improvements

Be concise and actionable. Use bullet points.
Respond in the same language as the user (Arabic or English).`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { team, language = 'en' } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    if (!team || team.length === 0) {
      return new Response(JSON.stringify({ 
        error: "No team provided" 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const teamTyped = team as TeamMember[];
    const teamDescription = teamTyped.map((p, i) => 
      `${i + 1}. ${p.name} (${p.types.join('/')})`
    ).join('\n');

    const userMessage = language === 'ar' 
      ? `حلل هذا الفريق:\n${teamDescription}`
      : `Analyze this team:\n${teamDescription}`;

    console.log("Analyzing team:", teamTyped.map((p) => p.name).join(', '));

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: TEAM_ANALYSIS_PROMPT },
          { role: "user", content: userMessage },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ 
          error: "Rate limit exceeded" 
        }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const analysis = data.choices?.[0]?.message?.content || "Unable to analyze team";

    console.log("Team analysis completed successfully");

    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("Team Analysis error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
