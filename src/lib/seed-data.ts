import type { Pokemon, Move, Location, Spawn, Item, Request, Recipe } from '@/types/pokemon';
import hisuiPokemon from '@/data/hisui-pokemon';
import { hisuiMoves } from '@/data/hisui-moves';
import { hisuiItems } from '@/data/hisui-items';

// Re-export hisuiPokemon as seedPokemon for backward compatibility
export const seedPokemon = hisuiPokemon;

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

export const seedSpawns: Spawn[] = [
  { id: 'spawn-rowlet-1', pokemon_id: 'rowlet', location_id: 'obsidian-fieldlands', area_ar: 'ساحة آسباراتيون', area_en: 'Aspiration Hill', conditions_ar: 'نهاراً', conditions_en: 'During the day', rarity: 'uncommon', is_alpha: false },
  { id: 'spawn-bidoof-1', pokemon_id: 'bidoof', location_id: 'obsidian-fieldlands', area_ar: 'ساحة آسباراتيون', area_en: 'Aspiration Hill', conditions_ar: 'دائماً', conditions_en: 'Always', rarity: 'common', is_alpha: false },
  { id: 'spawn-starly-1', pokemon_id: 'starly', location_id: 'obsidian-fieldlands', area_ar: 'ساحة آسباراتيون', area_en: 'Aspiration Hill', conditions_ar: 'دائماً', conditions_en: 'Always', rarity: 'common', is_alpha: false },
  { id: 'spawn-shinx-1', pokemon_id: 'shinx', location_id: 'obsidian-fieldlands', area_ar: 'غابة خشب القلب', area_en: 'Heartwood', conditions_ar: 'نهاراً', conditions_en: 'During the day', rarity: 'uncommon', is_alpha: false },
  { id: 'spawn-ponyta-1', pokemon_id: 'ponyta', location_id: 'obsidian-fieldlands', area_ar: 'ساحة الحصان', area_en: 'Horseshoe Plains', conditions_ar: 'دائماً', conditions_en: 'Always', rarity: 'common', is_alpha: false },
  { id: 'spawn-eevee-1', pokemon_id: 'eevee', location_id: 'obsidian-fieldlands', area_ar: 'غابة خشب القلب', area_en: 'Heartwood', conditions_ar: 'نهاراً', conditions_en: 'During the day', rarity: 'rare', is_alpha: false },
  { id: 'spawn-pikachu-1', pokemon_id: 'pikachu', location_id: 'obsidian-fieldlands', area_ar: 'طبيعة البرق', area_en: "Nature's Pantry", conditions_ar: 'أثناء العواصف', conditions_en: 'During storms', rarity: 'rare', is_alpha: false },
  { id: 'spawn-gastly-1', pokemon_id: 'gastly', location_id: 'obsidian-fieldlands', area_ar: 'قلعة الخراب', area_en: 'Ruined Heap', conditions_ar: 'ليلاً', conditions_en: 'At night', rarity: 'uncommon', is_alpha: false },
  { id: 'spawn-abra-1', pokemon_id: 'abra', location_id: 'obsidian-fieldlands', area_ar: 'بحيرة الحق', area_en: 'Lake Verity', conditions_ar: 'دائماً', conditions_en: 'Always', rarity: 'rare', is_alpha: false },
  { id: 'spawn-machop-1', pokemon_id: 'machop', location_id: 'crimson-mirelands', area_ar: 'تلال الكهف', area_en: 'Bolderoll Slope', conditions_ar: 'دائماً', conditions_en: 'Always', rarity: 'uncommon', is_alpha: false },
  { id: 'spawn-geodude-1', pokemon_id: 'geodude', location_id: 'crimson-mirelands', area_ar: 'منحدر الصخور', area_en: 'Bolderoll Ravine', conditions_ar: 'دائماً', conditions_en: 'Always', rarity: 'common', is_alpha: false },
  { id: 'spawn-drifloon-1', pokemon_id: 'drifloon', location_id: 'obsidian-fieldlands', area_ar: 'غابة خشب القلب', area_en: 'Heartwood', conditions_ar: 'ليلاً', conditions_en: 'At night', rarity: 'uncommon', is_alpha: false },
  { id: 'spawn-hgrowlithe-1', pokemon_id: 'hisuian-growlithe', location_id: 'cobalt-coastlands', area_ar: 'جزيرة الطوفان', area_en: 'Firespit Island', conditions_ar: 'دائماً', conditions_en: 'Always', rarity: 'uncommon', is_alpha: false },
  { id: 'spawn-kleavor-1', pokemon_id: 'kleavor', location_id: 'obsidian-fieldlands', area_ar: 'ساحة الكليفور', area_en: 'Grandtree Arena', conditions_ar: 'بعد هزيمته', conditions_en: 'After defeating it', rarity: 'very_rare', is_alpha: false },
  { id: 'spawn-alpha-snorlax-1', pokemon_id: 'alpha-snorlax', location_id: 'obsidian-fieldlands', area_ar: 'بحيرة الحق', area_en: 'Lake Verity', conditions_ar: 'ثابت', conditions_en: 'Static spawn', rarity: 'very_rare', is_alpha: true },
  { id: 'spawn-dialga-1', pokemon_id: 'dialga-origin', location_id: 'coronet-highlands', area_ar: 'معبد سينجو', area_en: 'Sinnoh Temple', conditions_ar: 'بعد إكمال القصة', conditions_en: 'After completing the story', rarity: 'very_rare', is_alpha: false },
  { id: 'spawn-palkia-1', pokemon_id: 'palkia-origin', location_id: 'coronet-highlands', area_ar: 'معبد سينجو', area_en: 'Sinnoh Temple', conditions_ar: 'بعد إكمال القصة', conditions_en: 'After completing the story', rarity: 'very_rare', is_alpha: false },
  { id: 'spawn-arceus-1', pokemon_id: 'arceus', location_id: 'coronet-highlands', area_ar: 'قمة كورونيت', area_en: 'Coronet Peak', conditions_ar: 'بعد إكمال كل شيء', conditions_en: 'After completing everything', rarity: 'very_rare', is_alpha: false },
];

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
  {
    id: 'recipe-pokeball',
    name_ar: 'صنع كرة بوكي',
    name_en: 'Craft Poké Ball',
    outputs: [{ item_id: 'poke-ball', qty: 1 }],
    ingredients: [
      { item_id: 'black-tumblestone', qty: 1 },
      { item_id: 'oran-berry', qty: 1 },
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
      { item_id: 'black-tumblestone', qty: 2 },
      { item_id: 'oran-berry', qty: 2 },
    ],
    unlock_notes_ar: 'يُفتح بعد الوصول للرتبة الثانية',
    unlock_notes_en: 'Unlocks at Star Rank 2',
  },
  {
    id: 'recipe-potion',
    name_ar: 'صنع جرعة',
    name_en: 'Craft Potion',
    outputs: [{ item_id: 'potion', qty: 1 }],
    ingredients: [
      { item_id: 'oran-berry', qty: 2 },
    ],
    unlock_notes_ar: 'متاح من البداية',
    unlock_notes_en: 'Available from the start',
  },
  {
    id: 'recipe-superpotion',
    name_ar: 'صنع جرعة فائقة',
    name_en: 'Craft Super Potion',
    outputs: [{ item_id: 'super-potion', qty: 1 }],
    ingredients: [
      { item_id: 'oran-berry', qty: 3 },
      { item_id: 'potion', qty: 1 },
    ],
    unlock_notes_ar: 'يُفتح بعد الوصول للرتبة الثالثة',
    unlock_notes_en: 'Unlocks at Star Rank 3',
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