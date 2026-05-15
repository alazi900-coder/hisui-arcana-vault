import { describe, expect, it } from 'vitest';
import {
  buildAdvisorMoveList,
  buildPokemonContext,
  classifyAiError,
  parseSseChunk,
} from './ai';
import type { Move, Pokemon } from '@/types/pokemon';

const samplePokemon: Pokemon = {
  id: 'pikachu',
  dex_no: 25,
  name_ar: 'بيكاتشو',
  name_en: 'Pikachu',
  types: ['electric'],
  description_ar: '',
  description_en: '',
  category_ar: '',
  category_en: '',
  height_m: 0.4,
  weight_kg: 6,
  abilities: [],
  stats: { hp: 35, attack: 55, defense: 40, special_attack: 50, special_defense: 50, speed: 90 },
  evolutions: [],
  tags: [],
  learnset: [
    { move_id: 'thunderbolt', method: 'level', level: 26 },
    { move_id: 'quick-attack', method: 'level', level: 5 },
    { move_id: 'iron-tail', method: 'tutor' },
  ],
  forms: [],
  spawn_refs: [],
};

const sampleMoves: Move[] = [
  { id: 'thunderbolt', name_ar: 'صاعقة', name_en: 'Thunderbolt', type: 'electric', category: 'special', power: 90, accuracy: 100, pp: 15, description_ar: '', description_en: '' },
  { id: 'quick-attack', name_ar: 'هجوم سريع', name_en: 'Quick Attack', type: 'normal', category: 'physical', power: 40, accuracy: 100, pp: 30, priority: 1, description_ar: '', description_en: '' },
  // iron-tail intentionally missing to test the filter
];

describe('classifyAiError', () => {
  it('429 → rate limit', () => {
    expect(classifyAiError(429).code).toBe('rate_limit');
  });
  it('402 → no credit', () => {
    expect(classifyAiError(402).code).toBe('no_credit');
  });
  it('401 / 403 → not configured', () => {
    expect(classifyAiError(401).code).toBe('not_configured');
    expect(classifyAiError(403).code).toBe('not_configured');
  });
  it('matches LOVABLE_API_KEY in message → not configured', () => {
    expect(classifyAiError(500, 'LOVABLE_API_KEY is not configured').code).toBe('not_configured');
  });
  it('status 0 → network', () => {
    expect(classifyAiError(0).code).toBe('network');
  });
  it('other → unknown with message echo', () => {
    expect(classifyAiError(500, 'boom').text_en).toContain('boom');
    expect(classifyAiError(500).code).toBe('unknown');
  });
});

describe('parseSseChunk', () => {
  it('parses a single full event', () => {
    const r = parseSseChunk('', 'data: {"choices":[{"delta":{"content":"hi"}}]}\n');
    expect(r.delta).toBe('hi');
    expect(r.done).toBe(false);
    expect(r.leftover).toBe('');
  });

  it('concatenates multiple events in one chunk', () => {
    const r = parseSseChunk(
      '',
      'data: {"choices":[{"delta":{"content":"a"}}]}\n' +
      'data: {"choices":[{"delta":{"content":"b"}}]}\n',
    );
    expect(r.delta).toBe('ab');
  });

  it('honours [DONE] sentinel', () => {
    const r = parseSseChunk('', 'data: [DONE]\n');
    expect(r.done).toBe(true);
    expect(r.delta).toBe('');
  });

  it('ignores comments and non-data lines', () => {
    const r = parseSseChunk('', ': keep-alive\nevent: ping\ndata: {"choices":[{"delta":{"content":"x"}}]}\n');
    expect(r.delta).toBe('x');
  });

  it('preserves leftover between chunks', () => {
    const first = parseSseChunk('', 'data: {"choices":[{"delta":{"con');
    expect(first.delta).toBe('');
    expect(first.leftover).toContain('data: ');
    const second = parseSseChunk(first.leftover, 'tent":"hi"}}]}\n');
    expect(second.delta).toBe('hi');
  });

  it('ignores malformed JSON gracefully', () => {
    const r = parseSseChunk('', 'data: {bad json\ndata: {"choices":[{"delta":{"content":"ok"}}]}\n');
    expect(r.delta).toBe('ok');
  });
});

describe('buildPokemonContext', () => {
  it('returns empty when no inputs', () => {
    expect(buildPokemonContext()).toEqual({});
  });
  it('includes current Pokémon when provided', () => {
    const ctx = buildPokemonContext(samplePokemon);
    expect(ctx.currentPokemon?.name).toBe('Pikachu');
    expect(ctx.currentPokemon?.types).toEqual(['electric']);
  });
  it('filters nulls out of the team', () => {
    const ctx = buildPokemonContext(null, [samplePokemon, null, samplePokemon]);
    expect(ctx.team).toHaveLength(2);
  });
});

describe('buildAdvisorMoveList', () => {
  it('returns only moves that exist in the moves table', () => {
    const list = buildAdvisorMoveList(samplePokemon, sampleMoves);
    expect(list).toHaveLength(2);
    expect(list.map(m => m.name)).toEqual(['Thunderbolt', 'Quick Attack']);
  });
  it('preserves category/power/accuracy', () => {
    const list = buildAdvisorMoveList(samplePokemon, sampleMoves);
    const tb = list.find(m => m.name === 'Thunderbolt');
    expect(tb?.power).toBe(90);
    expect(tb?.category).toBe('special');
  });
});
