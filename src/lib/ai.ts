/**
 * Pure helpers for the AI features (chat, move advisor, catch helper).
 *
 * All edge functions stream OpenAI-style SSE responses; the client extracts
 * incremental text deltas from each `data: { ... }` line. Keeping the parser
 * pure and pluggable lets us unit-test it without hitting the network.
 */
import type { Move, Pokemon, PokemonType } from '@/types/pokemon';

export interface AIChatContext {
  currentPokemon?: { name: string; types: string[] };
  team?: { name: string; types: string[] }[];
}

export interface AIChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AIErrorClassification {
  code: 'rate_limit' | 'no_credit' | 'not_configured' | 'network' | 'unknown';
  /** Bilingual human-readable text (Arabic, English). */
  text_ar: string;
  text_en: string;
}

/**
 * Map an upstream HTTP failure / error message into a stable client-facing
 * error category. Used by AI components to render a non-generic message.
 */
export function classifyAiError(status: number, message?: string): AIErrorClassification {
  if (status === 429) {
    return {
      code: 'rate_limit',
      text_ar: 'تم تجاوز الحد المسموح. حاول لاحقاً.',
      text_en: 'Rate limit exceeded. Please try again later.',
    };
  }
  if (status === 402) {
    return {
      code: 'no_credit',
      text_ar: 'نفدت رصيد AI. يرجى إضافة رصيد.',
      text_en: 'AI credit exhausted. Please add more credit.',
    };
  }
  if (status === 401 || status === 403 || /LOVABLE_API_KEY|not configured/i.test(message ?? '')) {
    return {
      code: 'not_configured',
      text_ar: 'المساعد الذكي غير مُهيّأ. اطلب من المشرف إضافة LOVABLE_API_KEY.',
      text_en: 'AI assistant is not configured. Ask the admin to set LOVABLE_API_KEY.',
    };
  }
  if (status === 0 || !status) {
    return {
      code: 'network',
      text_ar: 'تعذّر الاتصال بالشبكة.',
      text_en: 'Network error.',
    };
  }
  return {
    code: 'unknown',
    text_ar: message ? `خطأ: ${message}` : 'حدث خطأ غير متوقع.',
    text_en: message ?? 'An unexpected error occurred.',
  };
}

/**
 * Parse a chunk of Server-Sent-Events output from the AI gateway and append
 * the textual deltas to a buffer. Returns the new buffer plus the
 * concatenated content emitted by THIS chunk only (so callers can update
 * progressively).
 */
export interface SseParseResult {
  /** Lines that haven't yet ended in `\n` and must be carried over. */
  leftover: string;
  /** Text emitted by this chunk (joined deltas). */
  delta: string;
  /** True when an explicit `[DONE]` sentinel was seen. */
  done: boolean;
}

export function parseSseChunk(carry: string, chunk: string): SseParseResult {
  const combined = carry + chunk;
  const lines = combined.split('\n');
  const leftover = lines.pop() ?? '';
  let delta = '';
  let done = false;

  for (const raw of lines) {
    const line = raw.trim();
    if (!line.startsWith('data:')) continue;
    const payload = line.slice(5).trim();
    if (!payload) continue;
    if (payload === '[DONE]') {
      done = true;
      continue;
    }
    try {
      const parsed = JSON.parse(payload) as { choices?: { delta?: { content?: string } }[] };
      const content = parsed.choices?.[0]?.delta?.content;
      if (typeof content === 'string') {
        delta += content;
      }
    } catch {
      // Incomplete or non-JSON SSE event — ignore, leftover carries forward.
    }
  }

  return { leftover, delta, done };
}

/**
 * Shape a small context object the edge functions know how to consume. Keeps
 * the chat focused without leaking irrelevant DB state.
 */
export function buildPokemonContext(
  pokemon?: Pokemon | null,
  team?: (Pokemon | null)[] | null,
): AIChatContext {
  const ctx: AIChatContext = {};
  if (pokemon) {
    ctx.currentPokemon = {
      name: pokemon.name_en,
      types: pokemon.types as PokemonType[],
    };
  }
  if (team && team.length > 0) {
    ctx.team = team
      .filter((p): p is Pokemon => !!p)
      .map(p => ({ name: p.name_en, types: p.types as PokemonType[] }));
  }
  return ctx;
}

/**
 * Filter a Pokémon's learnset to the move metadata the move-advisor function
 * expects. Pure and decoupled from the React layer.
 */
export interface AdvisorMoveInput {
  name: string;
  type: PokemonType;
  category: 'physical' | 'special' | 'status';
  power?: number;
  accuracy?: number;
}

export function buildAdvisorMoveList(pokemon: Pokemon, moves: Move[]): AdvisorMoveInput[] {
  const byId = new Map(moves.map(m => [m.id, m]));
  return pokemon.learnset
    .map(entry => byId.get(entry.move_id))
    .filter((m): m is Move => !!m)
    .map(m => ({
      name: m.name_en,
      type: m.type,
      category: m.category,
      power: m.power,
      accuracy: m.accuracy,
    }));
}
