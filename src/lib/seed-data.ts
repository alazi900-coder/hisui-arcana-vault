import type { Pokemon, Move, Location, Spawn, Item, Request, Recipe } from '@/types/pokemon';
import hisuiPokemon from '@/data/hisui-pokemon';
import { hisuiMoves } from '@/data/hisui-moves';
import { hisuiItems } from '@/data/hisui-items';
import { hisuiLearnsets } from '@/data/hisui-learnsets';
import { hisuiSpawns } from '@/data/hisui-spawns';
import { generateDefaultLearnset, inferEvolutionMethod, inferEvolutionValue } from './pokemon-data';

// Pokémon without a curated learnset get a type-aware fallback set so the
// "Moves" tab is never empty. Once curated data lands, the override wins.
const availableMoveIds = new Set(hisuiMoves.map(m => m.id));

const pokemonWithLearnsets: Pokemon[] = hisuiPokemon.map(pokemon => {
  const curated = hisuiLearnsets[pokemon.id];
  const learnset = curated && curated.length > 0
    ? curated
    : generateDefaultLearnset(pokemon.types, availableMoveIds);

  // Enrich each evolution row with structured method + value derived from text.
  const evolutions = pokemon.evolutions.map(evo => ({
    ...evo,
    method: evo.method ?? inferEvolutionMethod(evo),
    value: evo.value ?? inferEvolutionValue(evo),
  }));

  return { ...pokemon, learnset, evolutions };
});

// Re-export hisuiPokemon as seedPokemon with learnsets
export const seedPokemon = pokemonWithLearnsets;

export const seedLocations: Location[] = [
  {
    id: 'obsidian-fieldlands',
    name_ar: 'أراضي السبج',
    name_en: 'Obsidian Fieldlands',
    region: 'hisui',
    description_ar: 'منطقة عشبية واسعة مليئة بالبوكيمونات المتنوعة.',
    description_en: 'A vast grassy area filled with diverse Pokémon.',
    subareas: [
      { name_ar: 'ساحة آسباراتيون', name_en: 'Aspiration Hill' },
      { name_ar: 'غابة خشب القلب', name_en: 'Heartwood' },
      { name_ar: 'بحيرة الحق', name_en: 'Lake Verity' },
    ],
  },
  {
    id: 'crimson-mirelands',
    name_ar: 'مستنقعات القرمز',
    name_en: 'Crimson Mirelands',
    region: 'hisui',
    description_ar: 'أراضٍ رطبة مليئة بالمستنقعات والبوكيمونات المائية.',
    description_en: 'Wetlands full of swamps and Water-type Pokémon.',
    subareas: [
      { name_ar: 'غابة السحابة', name_en: 'Cloudpool Ridge' },
      { name_ar: 'معسكر البوغ', name_en: 'Bogbound Camp' },
    ],
  },
  {
    id: 'cobalt-coastlands',
    name_ar: 'سواحل الكوبالت',
    name_en: 'Cobalt Coastlands',
    region: 'hisui',
    description_ar: 'سواحل وشواطئ مع بوكيمونات مائية وطائرة.',
    description_en: 'Coasts and beaches with Water and Flying Pokémon.',
    subareas: [
      { name_ar: 'شاطئ جينكو', name_en: 'Ginkgo Landing' },
      { name_ar: 'جزيرة الطوفان', name_en: 'Firespit Island' },
    ],
  },
  {
    id: 'coronet-highlands',
    name_ar: 'مرتفعات كورونيت',
    name_en: 'Coronet Highlands',
    region: 'hisui',
    description_ar: 'جبال شاهقة ومنطقة أثرية مهمة.',
    description_en: 'Towering mountains and an important archaeological area.',
    subareas: [
      { name_ar: 'معبد سينجو', name_en: 'Sinnoh Temple' },
      { name_ar: 'قمة كورونيت', name_en: 'Coronet Peak' },
    ],
  },
  {
    id: 'alabaster-icelands',
    name_ar: 'أراضي الثلج البيضاء',
    name_en: 'Alabaster Icelands',
    region: 'hisui',
    description_ar: 'أراضٍ جليدية قاسية مع بوكيمونات الجليد.',
    description_en: 'Harsh icy lands with Ice-type Pokémon.',
    subareas: [
      { name_ar: 'بحيرة أكويتي', name_en: 'Lake Acuity' },
      { name_ar: 'أرينا الثلج', name_en: "Snowpoint Temple" },
    ],
  },
];

// Use comprehensive spawns data from hisui-spawns.ts
export const seedSpawns: Spawn[] = hisuiSpawns;

// Use comprehensive moves data from hisui-moves.ts
export const seedMoves: Move[] = hisuiMoves;

// Use comprehensive items data from hisui-items.ts
export const seedItems: Item[] = hisuiItems;

export const seedRequests: Request[] = [
  {
    id: 'req-1',
    title_ar: 'البوكيمون الغامض في الليل',
    title_en: 'The Mysterious Night Pokémon',
    giver: 'Beauregard',
    location_id: 'obsidian-fieldlands',
    requirements_ar: 'أمسك دريفلون',
    requirements_en: 'Catch a Drifloon',
    steps_ar: '1. اذهب إلى غابة خشب القلب ليلاً\n2. ابحث عن دريفلون العائم\n3. أمسكه وأعده لبوريجارد',
    steps_en: '1. Go to Heartwood at night\n2. Look for the floating Drifloon\n3. Catch it and return to Beauregard',
    rewards_ar: '3x توت أوران + 1000 نقدة',
    rewards_en: '3x Oran Berry + 1000 coins',
  },
  {
    id: 'req-2',
    title_ar: 'تحدي الصخور',
    title_en: 'The Rock Challenge',
    giver: 'Anvin',
    location_id: 'crimson-mirelands',
    requirements_ar: 'هزم 3 جيودود',
    requirements_en: 'Defeat 3 Geodude',
    steps_ar: '1. اذهب إلى منحدر الصخور\n2. ابحث عن جيودود\n3. هزم 3 منهم في القتال',
    steps_en: '1. Go to Bolderoll Ravine\n2. Find Geodude\n3. Defeat 3 of them in battle',
    rewards_ar: '5x كرة عظيمة + 2000 نقدة',
    rewards_en: '5x Great Ball + 2000 coins',
  },
  {
    id: 'req-3',
    title_ar: 'البحث عن بيكاتشو',
    title_en: 'The Search for Pikachu',
    giver: 'Marli',
    location_id: 'obsidian-fieldlands',
    requirements_ar: 'أمسك بيكاتشو',
    requirements_en: 'Catch a Pikachu',
    steps_ar: '1. انتظر حتى تأتي عاصفة\n2. اذهب إلى طبيعة البرق\n3. ابحث عن بيكاتشو وأمسكه',
    steps_en: '1. Wait for a storm\n2. Go to Nature\'s Pantry\n3. Find and catch Pikachu',
    rewards_ar: '1x حجر الرعد + 3000 نقدة',
    rewards_en: '1x Thunder Stone + 3000 coins',
  },
];

export const seedRecipes: Recipe[] = [
  // ===== POKÉBALLS =====
  {
    id: 'recipe-pokeball',
    name_ar: 'صنع كرة بوكي',
    name_en: 'Craft Poké Ball',
    outputs: [{ item_id: 'poke-ball', qty: 1 }],
    ingredients: [
      { item_id: 'apricorn', qty: 1 },
      { item_id: 'tumblestone', qty: 1 },
    ],
    unlock_notes_ar: 'متاح من البداية',
    unlock_notes_en: 'Available from the start',
  },
  {
    id: 'recipe-greatball',
    name_ar: 'صنع كرة عظيمة',
    name_en: 'Craft Great Ball',
    outputs: [{ item_id: 'great-ball', qty: 1 }],
    ingredients: [
      { item_id: 'apricorn', qty: 1 },
      { item_id: 'tumblestone', qty: 2 },
      { item_id: 'iron-chunk', qty: 1 },
    ],
    unlock_notes_ar: 'يُفتح بعد الوصول للرتبة الثانية',
    unlock_notes_en: 'Unlocks at Star Rank 2',
  },
  {
    id: 'recipe-ultraball',
    name_ar: 'صنع كرة فائقة',
    name_en: 'Craft Ultra Ball',
    outputs: [{ item_id: 'ultra-ball', qty: 1 }],
    ingredients: [
      { item_id: 'apricorn', qty: 2 },
      { item_id: 'tumblestone', qty: 2 },
      { item_id: 'iron-chunk', qty: 2 },
    ],
    unlock_notes_ar: 'يُفتح بعد الوصول للرتبة الخامسة',
    unlock_notes_en: 'Unlocks at Star Rank 5',
  },
  {
    id: 'recipe-heavyball',
    name_ar: 'صنع كرة ثقيلة',
    name_en: 'Craft Heavy Ball',
    outputs: [{ item_id: 'heavy-ball', qty: 1 }],
    ingredients: [
      { item_id: 'apricorn', qty: 1 },
      { item_id: 'black-tumblestone', qty: 1 },
    ],
    unlock_notes_ar: 'متاح من البداية',
    unlock_notes_en: 'Available from the start',
  },
  {
    id: 'recipe-leadenball',
    name_ar: 'صنع كرة رصاصية',
    name_en: 'Craft Leaden Ball',
    outputs: [{ item_id: 'leaden-ball', qty: 1 }],
    ingredients: [
      { item_id: 'apricorn', qty: 1 },
      { item_id: 'black-tumblestone', qty: 2 },
      { item_id: 'iron-chunk', qty: 1 },
    ],
    unlock_notes_ar: 'يُفتح بعد الوصول للرتبة الثانية',
    unlock_notes_en: 'Unlocks at Star Rank 2',
  },
  {
    id: 'recipe-gigatonball',
    name_ar: 'صنع كرة جيجا طن',
    name_en: 'Craft Gigaton Ball',
    outputs: [{ item_id: 'gigaton-ball', qty: 1 }],
    ingredients: [
      { item_id: 'apricorn', qty: 2 },
      { item_id: 'black-tumblestone', qty: 2 },
      { item_id: 'iron-chunk', qty: 2 },
    ],
    unlock_notes_ar: 'يُفتح بعد الوصول للرتبة الخامسة',
    unlock_notes_en: 'Unlocks at Star Rank 5',
  },
  {
    id: 'recipe-featherball',
    name_ar: 'صنع كرة ريشة',
    name_en: 'Craft Feather Ball',
    outputs: [{ item_id: 'feather-ball', qty: 1 }],
    ingredients: [
      { item_id: 'apricorn', qty: 1 },
      { item_id: 'sky-tumblestone', qty: 1 },
    ],
    unlock_notes_ar: 'متاح من البداية',
    unlock_notes_en: 'Available from the start',
  },
  {
    id: 'recipe-wingball',
    name_ar: 'صنع كرة جناح',
    name_en: 'Craft Wing Ball',
    outputs: [{ item_id: 'wing-ball', qty: 1 }],
    ingredients: [
      { item_id: 'apricorn', qty: 1 },
      { item_id: 'sky-tumblestone', qty: 2 },
      { item_id: 'iron-chunk', qty: 1 },
    ],
    unlock_notes_ar: 'يُفتح بعد الوصول للرتبة الثانية',
    unlock_notes_en: 'Unlocks at Star Rank 2',
  },
  {
    id: 'recipe-jetball',
    name_ar: 'صنع كرة نفاثة',
    name_en: 'Craft Jet Ball',
    outputs: [{ item_id: 'jet-ball', qty: 1 }],
    ingredients: [
      { item_id: 'apricorn', qty: 2 },
      { item_id: 'sky-tumblestone', qty: 2 },
      { item_id: 'iron-chunk', qty: 2 },
    ],
    unlock_notes_ar: 'يُفتح بعد الوصول للرتبة الخامسة',
    unlock_notes_en: 'Unlocks at Star Rank 5',
  },

  // ===== MEDICINE =====
  {
    id: 'recipe-potion',
    name_ar: 'صنع جرعة',
    name_en: 'Craft Potion',
    outputs: [{ item_id: 'potion', qty: 1 }],
    ingredients: [
      { item_id: 'oran-berry', qty: 1 },
      { item_id: 'medicinal-leek', qty: 1 },
    ],
    unlock_notes_ar: 'متاح من البداية',
    unlock_notes_en: 'Available from the start',
  },
  {
    id: 'recipe-superpotion',
    name_ar: 'صنع جرعة خارقة',
    name_en: 'Craft Super Potion',
    outputs: [{ item_id: 'super-potion', qty: 1 }],
    ingredients: [
      { item_id: 'sitrus-berry', qty: 1 },
      { item_id: 'medicinal-leek', qty: 2 },
    ],
    unlock_notes_ar: 'يُفتح بعد الوصول للرتبة الثالثة',
    unlock_notes_en: 'Unlocks at Star Rank 3',
  },
  {
    id: 'recipe-hyperpotion',
    name_ar: 'صنع جرعة فائقة',
    name_en: 'Craft Hyper Potion',
    outputs: [{ item_id: 'hyper-potion', qty: 1 }],
    ingredients: [
      { item_id: 'sitrus-berry', qty: 2 },
      { item_id: 'medicinal-leek', qty: 2 },
      { item_id: 'kings-leaf', qty: 1 },
    ],
    unlock_notes_ar: 'يُفتح بعد الوصول للرتبة الخامسة',
    unlock_notes_en: 'Unlocks at Star Rank 5',
  },
  {
    id: 'recipe-maxpotion',
    name_ar: 'صنع جرعة قصوى',
    name_en: 'Craft Max Potion',
    outputs: [{ item_id: 'max-potion', qty: 1 }],
    ingredients: [
      { item_id: 'sitrus-berry', qty: 3 },
      { item_id: 'medicinal-leek', qty: 3 },
      { item_id: 'kings-leaf', qty: 2 },
    ],
    unlock_notes_ar: 'يُفتح بعد الوصول للرتبة السابعة',
    unlock_notes_en: 'Unlocks at Star Rank 7',
  },
  {
    id: 'recipe-fullrestore',
    name_ar: 'صنع استعادة كاملة',
    name_en: 'Craft Full Restore',
    outputs: [{ item_id: 'full-restore', qty: 1 }],
    ingredients: [
      { item_id: 'sitrus-berry', qty: 3 },
      { item_id: 'medicinal-leek', qty: 3 },
      { item_id: 'kings-leaf', qty: 3 },
    ],
    unlock_notes_ar: 'يُفتح بعد الوصول للرتبة الثامنة',
    unlock_notes_en: 'Unlocks at Star Rank 8',
  },
  {
    id: 'recipe-revive',
    name_ar: 'صنع إحياء',
    name_en: 'Craft Revive',
    outputs: [{ item_id: 'revive', qty: 1 }],
    ingredients: [
      { item_id: 'medicinal-leek', qty: 2 },
      { item_id: 'caster-fern', qty: 2 },
    ],
    unlock_notes_ar: 'يُفتح بعد الوصول للرتبة الرابعة',
    unlock_notes_en: 'Unlocks at Star Rank 4',
  },
  {
    id: 'recipe-maxrevive',
    name_ar: 'صنع إحياء أقصى',
    name_en: 'Craft Max Revive',
    outputs: [{ item_id: 'max-revive', qty: 1 }],
    ingredients: [
      { item_id: 'medicinal-leek', qty: 3 },
      { item_id: 'caster-fern', qty: 3 },
      { item_id: 'kings-leaf', qty: 2 },
    ],
    unlock_notes_ar: 'يُفتح بعد الوصول للرتبة السادسة',
    unlock_notes_en: 'Unlocks at Star Rank 6',
  },
  {
    id: 'recipe-antidote',
    name_ar: 'صنع ترياق',
    name_en: 'Craft Antidote',
    outputs: [{ item_id: 'antidote', qty: 1 }],
    ingredients: [
      { item_id: 'pecha-berry', qty: 2 },
    ],
    unlock_notes_ar: 'متاح من البداية',
    unlock_notes_en: 'Available from the start',
  },
  {
    id: 'recipe-paralyzeheal',
    name_ar: 'صنع شفاء الشلل',
    name_en: 'Craft Paralyze Heal',
    outputs: [{ item_id: 'paralyze-heal', qty: 1 }],
    ingredients: [
      { item_id: 'cheri-berry', qty: 2 },
    ],
    unlock_notes_ar: 'متاح من البداية',
    unlock_notes_en: 'Available from the start',
  },
  {
    id: 'recipe-burnheal',
    name_ar: 'صنع شفاء الحروق',
    name_en: 'Craft Burn Heal',
    outputs: [{ item_id: 'burn-heal', qty: 1 }],
    ingredients: [
      { item_id: 'rawst-berry', qty: 2 },
    ],
    unlock_notes_ar: 'متاح من البداية',
    unlock_notes_en: 'Available from the start',
  },
  {
    id: 'recipe-iceheal',
    name_ar: 'صنع شفاء التجمد',
    name_en: 'Craft Ice Heal',
    outputs: [{ item_id: 'ice-heal', qty: 1 }],
    ingredients: [
      { item_id: 'aspear-berry', qty: 2 },
    ],
    unlock_notes_ar: 'متاح من البداية',
    unlock_notes_en: 'Available from the start',
  },
  {
    id: 'recipe-fullheal',
    name_ar: 'صنع شفاء كامل',
    name_en: 'Craft Full Heal',
    outputs: [{ item_id: 'full-heal', qty: 1 }],
    ingredients: [
      { item_id: 'cheri-berry', qty: 1 },
      { item_id: 'pecha-berry', qty: 1 },
      { item_id: 'rawst-berry', qty: 1 },
      { item_id: 'aspear-berry', qty: 1 },
    ],
    unlock_notes_ar: 'يُفتح بعد الوصول للرتبة الثالثة',
    unlock_notes_en: 'Unlocks at Star Rank 3',
  },

  // ===== BATTLE ITEMS =====
  {
    id: 'recipe-smokebomb',
    name_ar: 'صنع قنبلة دخانية',
    name_en: 'Craft Smoke Bomb',
    outputs: [{ item_id: 'smoke-bomb', qty: 1 }],
    ingredients: [
      { item_id: 'sootfoot-root', qty: 1 },
      { item_id: 'caster-fern', qty: 1 },
    ],
    unlock_notes_ar: 'متاح من البداية',
    unlock_notes_en: 'Available from the start',
  },
  {
    id: 'recipe-scatterbang',
    name_ar: 'صنع كرة صادمة',
    name_en: 'Craft Scatter Bang',
    outputs: [{ item_id: 'scatter-bang', qty: 1 }],
    ingredients: [
      { item_id: 'pop-pod', qty: 1 },
      { item_id: 'iron-chunk', qty: 1 },
    ],
    unlock_notes_ar: 'يُفتح بعد الوصول للرتبة الثانية',
    unlock_notes_en: 'Unlocks at Star Rank 2',
  },
  {
    id: 'recipe-stickyglobt',
    name_ar: 'صنع كرة لاصقة',
    name_en: 'Craft Sticky Glob',
    outputs: [{ item_id: 'sticky-glob', qty: 1 }],
    ingredients: [
      { item_id: 'plump-beans', qty: 1 },
      { item_id: 'dazzling-honey', qty: 1 },
    ],
    unlock_notes_ar: 'يُفتح بعد الوصول للرتبة الثانية',
    unlock_notes_en: 'Unlocks at Star Rank 2',
  },
  {
    id: 'recipe-stealthspray',
    name_ar: 'صنع رذاذ التخفي',
    name_en: 'Craft Stealth Spray',
    outputs: [{ item_id: 'stealth-spray', qty: 1 }],
    ingredients: [
      { item_id: 'sootfoot-root', qty: 2 },
      { item_id: 'bugwort', qty: 1 },
    ],
    unlock_notes_ar: 'يُفتح بعد الوصول للرتبة الثالثة',
    unlock_notes_en: 'Unlocks at Star Rank 3',
  },

  // ===== LURES & BAITS =====
  {
    id: 'recipe-saltcake',
    name_ar: 'صنع كعكة ملح',
    name_en: 'Craft Salt Cake',
    outputs: [{ item_id: 'salt-cake', qty: 1 }],
    ingredients: [
      { item_id: 'hearty-grains', qty: 1 },
      { item_id: 'plump-beans', qty: 1 },
    ],
    unlock_notes_ar: 'يُفتح بعد الوصول للرتبة الثانية',
    unlock_notes_en: 'Unlocks at Star Rank 2',
  },
  {
    id: 'recipe-beancake',
    name_ar: 'صنع كعكة فاصولياء',
    name_en: 'Craft Bean Cake',
    outputs: [{ item_id: 'bean-cake', qty: 1 }],
    ingredients: [
      { item_id: 'plump-beans', qty: 2 },
      { item_id: 'hearty-grains', qty: 1 },
    ],
    unlock_notes_ar: 'يُفتح بعد الوصول للرتبة الثانية',
    unlock_notes_en: 'Unlocks at Star Rank 2',
  },
  {
    id: 'recipe-graincake',
    name_ar: 'صنع كعكة حبوب',
    name_en: 'Craft Grain Cake',
    outputs: [{ item_id: 'grain-cake', qty: 1 }],
    ingredients: [
      { item_id: 'hearty-grains', qty: 2 },
      { item_id: 'plump-beans', qty: 1 },
    ],
    unlock_notes_ar: 'يُفتح بعد الوصول للرتبة الثانية',
    unlock_notes_en: 'Unlocks at Star Rank 2',
  },
  {
    id: 'recipe-honeycake',
    name_ar: 'صنع كعكة عسل',
    name_en: 'Craft Honey Cake',
    outputs: [{ item_id: 'honey-cake', qty: 1 }],
    ingredients: [
      { item_id: 'dazzling-honey', qty: 2 },
      { item_id: 'hearty-grains', qty: 1 },
    ],
    unlock_notes_ar: 'يُفتح بعد الوصول للرتبة الثالثة',
    unlock_notes_en: 'Unlocks at Star Rank 3',
  },
  {
    id: 'recipe-mushroomcake',
    name_ar: 'صنع كعكة فطر',
    name_en: 'Craft Mushroom Cake',
    outputs: [{ item_id: 'mushroom-cake', qty: 1 }],
    ingredients: [
      { item_id: 'springy-mushroom', qty: 2 },
      { item_id: 'hearty-grains', qty: 1 },
    ],
    unlock_notes_ar: 'يُفتح بعد الوصول للرتبة الثالثة',
    unlock_notes_en: 'Unlocks at Star Rank 3',
  },

  // ===== SPECIAL ITEMS =====
  {
    id: 'recipe-auxpower',
    name_ar: 'صنع مساعد القوة',
    name_en: 'Craft Aux Power',
    outputs: [{ item_id: 'aux-power', qty: 1 }],
    ingredients: [
      { item_id: 'iron-chunk', qty: 1 },
      { item_id: 'sand-radish', qty: 1 },
    ],
    unlock_notes_ar: 'يُفتح بعد الوصول للرتبة الرابعة',
    unlock_notes_en: 'Unlocks at Star Rank 4',
  },
  {
    id: 'recipe-auxguard',
    name_ar: 'صنع مساعد الحماية',
    name_en: 'Craft Aux Guard',
    outputs: [{ item_id: 'aux-guard', qty: 1 }],
    ingredients: [
      { item_id: 'iron-chunk', qty: 1 },
      { item_id: 'caster-fern', qty: 1 },
    ],
    unlock_notes_ar: 'يُفتح بعد الوصول للرتبة الرابعة',
    unlock_notes_en: 'Unlocks at Star Rank 4',
  },
  {
    id: 'recipe-maxether',
    name_ar: 'صنع إيثر أقصى',
    name_en: 'Craft Max Ether',
    outputs: [{ item_id: 'max-ether', qty: 1 }],
    ingredients: [
      { item_id: 'leppa-berry', qty: 2 },
      { item_id: 'hopo-berry', qty: 2 },
    ],
    unlock_notes_ar: 'يُفتح بعد الوصول للرتبة الخامسة',
    unlock_notes_en: 'Unlocks at Star Rank 5',
  },
  {
    id: 'recipe-maxelixir',
    name_ar: 'صنع إكسير أقصى',
    name_en: 'Craft Max Elixir',
    outputs: [{ item_id: 'max-elixir', qty: 1 }],
    ingredients: [
      { item_id: 'leppa-berry', qty: 3 },
      { item_id: 'hopo-berry', qty: 3 },
      { item_id: 'kings-leaf', qty: 1 },
    ],
    unlock_notes_ar: 'يُفتح بعد الوصول للرتبة السابعة',
    unlock_notes_en: 'Unlocks at Star Rank 7',
  },
];

export async function loadSeedData() {
  const { db } = await import('./db');
  
  // Check if already has data
  const count = await db.pokemon.count();
  if (count > 0) return;
  
  // Load seed data with complete 242 Pokémon
  await Promise.all([
    db.pokemon.bulkAdd(seedPokemon),
    db.locations.bulkAdd(seedLocations),
    db.spawns.bulkAdd(seedSpawns),
    db.moves.bulkAdd(seedMoves),
    db.items.bulkAdd(seedItems),
    db.requests.bulkAdd(seedRequests),
    db.recipes.bulkAdd(seedRecipes),
  ]);
  
  console.log('Seed data loaded: 242 Pokémon + all game data!');
}

// Force reload all data (useful when updating to new data)
export async function reloadAllData() {
  const { db, clearAllData } = await import('./db');
  
  // Clear existing data
  await clearAllData();
  
  // Reload with complete 242 Pokémon data
  await Promise.all([
    db.pokemon.bulkAdd(seedPokemon),
    db.locations.bulkAdd(seedLocations),
    db.spawns.bulkAdd(seedSpawns),
    db.moves.bulkAdd(seedMoves),
    db.items.bulkAdd(seedItems),
    db.requests.bulkAdd(seedRequests),
    db.recipes.bulkAdd(seedRecipes),
  ]);
  
  console.log('Data reloaded: 242 Pokémon!');
}