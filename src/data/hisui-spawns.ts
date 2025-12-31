// Pokémon Legends: Arceus - Comprehensive Spawn Data for All Hisui Regions
import type { Spawn } from '@/types/pokemon';

// Helper to generate spawn IDs
let spawnCounter = 0;
const spawnId = (pokemonId: string, locationId: string) => `spawn-${pokemonId}-${locationId}-${++spawnCounter}`;

export const hisuiSpawns: Spawn[] = [
  // ============================================
  // OBSIDIAN FIELDLANDS - أراضي السبج
  // ============================================
  
  // Aspiration Hill - ساحة آسباراتيون
  { id: spawnId('bidoof', 'obsidian-fieldlands'), pokemon_id: 'bidoof', location_id: 'obsidian-fieldlands', area_ar: 'ساحة آسباراتيون', area_en: 'Aspiration Hill', conditions_ar: 'دائماً', conditions_en: 'Always', rarity: 'common', is_alpha: false },
  { id: spawnId('starly', 'obsidian-fieldlands'), pokemon_id: 'starly', location_id: 'obsidian-fieldlands', area_ar: 'ساحة آسباراتيون', area_en: 'Aspiration Hill', conditions_ar: 'دائماً', conditions_en: 'Always', rarity: 'common', is_alpha: false },
  { id: spawnId('wurmple', 'obsidian-fieldlands'), pokemon_id: 'wurmple', location_id: 'obsidian-fieldlands', area_ar: 'ساحة آسباراتيون', area_en: 'Aspiration Hill', conditions_ar: 'دائماً', conditions_en: 'Always', rarity: 'common', is_alpha: false },
  { id: spawnId('shinx', 'obsidian-fieldlands'), pokemon_id: 'shinx', location_id: 'obsidian-fieldlands', area_ar: 'ساحة آسباراتيون', area_en: 'Aspiration Hill', conditions_ar: 'نهاراً', conditions_en: 'During the day', rarity: 'uncommon', is_alpha: false },
  { id: spawnId('kricketot', 'obsidian-fieldlands'), pokemon_id: 'kricketot', location_id: 'obsidian-fieldlands', area_ar: 'ساحة آسباراتيون', area_en: 'Aspiration Hill', conditions_ar: 'ليلاً', conditions_en: 'At night', rarity: 'common', is_alpha: false },
  { id: spawnId('bibarel', 'obsidian-fieldlands'), pokemon_id: 'bibarel', location_id: 'obsidian-fieldlands', area_ar: 'ساحة آسباراتيون', area_en: 'Aspiration Hill', conditions_ar: 'دائماً', conditions_en: 'Always', rarity: 'uncommon', is_alpha: false },
  { id: spawnId('staravia', 'obsidian-fieldlands'), pokemon_id: 'staravia', location_id: 'obsidian-fieldlands', area_ar: 'ساحة آسباراتيون', area_en: 'Aspiration Hill', conditions_ar: 'دائماً', conditions_en: 'Always', rarity: 'uncommon', is_alpha: false },
  
  // Horseshoe Plains - ساحة الحصان
  { id: spawnId('ponyta', 'obsidian-fieldlands'), pokemon_id: 'ponyta', location_id: 'obsidian-fieldlands', area_ar: 'ساحة الحصان', area_en: 'Horseshoe Plains', conditions_ar: 'دائماً', conditions_en: 'Always', rarity: 'common', is_alpha: false },
  { id: spawnId('buneary', 'obsidian-fieldlands'), pokemon_id: 'buneary', location_id: 'obsidian-fieldlands', area_ar: 'ساحة الحصان', area_en: 'Horseshoe Plains', conditions_ar: 'دائماً', conditions_en: 'Always', rarity: 'common', is_alpha: false },
  { id: spawnId('rapidash', 'obsidian-fieldlands'), pokemon_id: 'rapidash', location_id: 'obsidian-fieldlands', area_ar: 'ساحة الحصان', area_en: 'Horseshoe Plains', conditions_ar: 'دائماً', conditions_en: 'Always', rarity: 'rare', is_alpha: false },
  { id: spawnId('lopunny', 'obsidian-fieldlands'), pokemon_id: 'lopunny', location_id: 'obsidian-fieldlands', area_ar: 'ساحة الحصان', area_en: 'Horseshoe Plains', conditions_ar: 'دائماً', conditions_en: 'Always', rarity: 'uncommon', is_alpha: false },
  { id: spawnId('ponyta', 'obsidian-fieldlands'), pokemon_id: 'ponyta', location_id: 'obsidian-fieldlands', area_ar: 'ساحة الحصان', area_en: 'Horseshoe Plains', conditions_ar: 'ثابت', conditions_en: 'Fixed spawn', rarity: 'very_rare', is_alpha: true },
  
  // Heartwood - غابة خشب القلب
  { id: spawnId('eevee', 'obsidian-fieldlands'), pokemon_id: 'eevee', location_id: 'obsidian-fieldlands', area_ar: 'غابة خشب القلب', area_en: 'Heartwood', conditions_ar: 'نهاراً', conditions_en: 'During the day', rarity: 'rare', is_alpha: false },
  { id: spawnId('combee', 'obsidian-fieldlands'), pokemon_id: 'combee', location_id: 'obsidian-fieldlands', area_ar: 'غابة خشب القلب', area_en: 'Heartwood', conditions_ar: 'دائماً', conditions_en: 'Always', rarity: 'common', is_alpha: false },
  { id: spawnId('wormadam', 'obsidian-fieldlands'), pokemon_id: 'wormadam', location_id: 'obsidian-fieldlands', area_ar: 'غابة خشب القلب', area_en: 'Heartwood', conditions_ar: 'دائماً', conditions_en: 'Always', rarity: 'uncommon', is_alpha: false },
  { id: spawnId('beautifly', 'obsidian-fieldlands'), pokemon_id: 'beautifly', location_id: 'obsidian-fieldlands', area_ar: 'غابة خشب القلب', area_en: 'Heartwood', conditions_ar: 'نهاراً', conditions_en: 'During the day', rarity: 'uncommon', is_alpha: false },
  { id: spawnId('dustox', 'obsidian-fieldlands'), pokemon_id: 'dustox', location_id: 'obsidian-fieldlands', area_ar: 'غابة خشب القلب', area_en: 'Heartwood', conditions_ar: 'ليلاً', conditions_en: 'At night', rarity: 'uncommon', is_alpha: false },
  { id: spawnId('drifloon', 'obsidian-fieldlands'), pokemon_id: 'drifloon', location_id: 'obsidian-fieldlands', area_ar: 'غابة خشب القلب', area_en: 'Heartwood', conditions_ar: 'ليلاً', conditions_en: 'At night', rarity: 'uncommon', is_alpha: false },
  { id: spawnId('buizel', 'obsidian-fieldlands'), pokemon_id: 'buizel', location_id: 'obsidian-fieldlands', area_ar: 'غابة خشب القلب', area_en: 'Heartwood', conditions_ar: 'دائماً', conditions_en: 'Always', rarity: 'common', is_alpha: false },
  { id: spawnId('vespiquen', 'obsidian-fieldlands'), pokemon_id: 'vespiquen', location_id: 'obsidian-fieldlands', area_ar: 'غابة خشب القلب', area_en: 'Heartwood', conditions_ar: 'ثابت', conditions_en: 'Fixed spawn', rarity: 'very_rare', is_alpha: true },
  
  // Lake Verity - بحيرة الحق
  { id: spawnId('psyduck', 'obsidian-fieldlands'), pokemon_id: 'psyduck', location_id: 'obsidian-fieldlands', area_ar: 'بحيرة الحق', area_en: 'Lake Verity', conditions_ar: 'دائماً', conditions_en: 'Always', rarity: 'common', is_alpha: false },
  { id: spawnId('golduck', 'obsidian-fieldlands'), pokemon_id: 'golduck', location_id: 'obsidian-fieldlands', area_ar: 'بحيرة الحق', area_en: 'Lake Verity', conditions_ar: 'دائماً', conditions_en: 'Always', rarity: 'uncommon', is_alpha: false },
  { id: spawnId('abra', 'obsidian-fieldlands'), pokemon_id: 'abra', location_id: 'obsidian-fieldlands', area_ar: 'بحيرة الحق', area_en: 'Lake Verity', conditions_ar: 'دائماً', conditions_en: 'Always', rarity: 'rare', is_alpha: false },
  { id: spawnId('kadabra', 'obsidian-fieldlands'), pokemon_id: 'kadabra', location_id: 'obsidian-fieldlands', area_ar: 'بحيرة الحق', area_en: 'Lake Verity', conditions_ar: 'دائماً', conditions_en: 'Always', rarity: 'rare', is_alpha: false },
  { id: spawnId('magikarp', 'obsidian-fieldlands'), pokemon_id: 'magikarp', location_id: 'obsidian-fieldlands', area_ar: 'بحيرة الحق', area_en: 'Lake Verity', conditions_ar: 'صيد', conditions_en: 'Fishing', rarity: 'common', is_alpha: false },
  { id: spawnId('gyarados', 'obsidian-fieldlands'), pokemon_id: 'gyarados', location_id: 'obsidian-fieldlands', area_ar: 'بحيرة الحق', area_en: 'Lake Verity', conditions_ar: 'صيد نادر', conditions_en: 'Rare fishing', rarity: 'rare', is_alpha: false },
  { id: spawnId('mesprit', 'obsidian-fieldlands'), pokemon_id: 'mesprit', location_id: 'obsidian-fieldlands', area_ar: 'بحيرة الحق', area_en: 'Lake Verity', conditions_ar: 'بعد القصة', conditions_en: 'Post-game', rarity: 'very_rare', is_alpha: false },
  { id: spawnId('snorlax', 'obsidian-fieldlands'), pokemon_id: 'snorlax', location_id: 'obsidian-fieldlands', area_ar: 'بحيرة الحق', area_en: 'Lake Verity', conditions_ar: 'ثابت', conditions_en: 'Fixed spawn', rarity: 'very_rare', is_alpha: true },
  
  // Nature's Pantry - طبيعة البرق
  { id: spawnId('pichu', 'obsidian-fieldlands'), pokemon_id: 'pichu', location_id: 'obsidian-fieldlands', area_ar: 'طبيعة البرق', area_en: "Nature's Pantry", conditions_ar: 'أثناء العواصف', conditions_en: 'During storms', rarity: 'rare', is_alpha: false },
  { id: spawnId('pikachu', 'obsidian-fieldlands'), pokemon_id: 'pikachu', location_id: 'obsidian-fieldlands', area_ar: 'طبيعة البرق', area_en: "Nature's Pantry", conditions_ar: 'أثناء العواصف', conditions_en: 'During storms', rarity: 'rare', is_alpha: false },
  { id: spawnId('aipom', 'obsidian-fieldlands'), pokemon_id: 'aipom', location_id: 'obsidian-fieldlands', area_ar: 'طبيعة البرق', area_en: "Nature's Pantry", conditions_ar: 'دائماً', conditions_en: 'Always', rarity: 'common', is_alpha: false },
  { id: spawnId('ambipom', 'obsidian-fieldlands'), pokemon_id: 'ambipom', location_id: 'obsidian-fieldlands', area_ar: 'طبيعة البرق', area_en: "Nature's Pantry", conditions_ar: 'دائماً', conditions_en: 'Always', rarity: 'uncommon', is_alpha: false },
  { id: spawnId('munchlax', 'obsidian-fieldlands'), pokemon_id: 'munchlax', location_id: 'obsidian-fieldlands', area_ar: 'طبيعة البرق', area_en: "Nature's Pantry", conditions_ar: 'من الأشجار', conditions_en: 'Tree shaking', rarity: 'rare', is_alpha: false },
  { id: spawnId('cherubi', 'obsidian-fieldlands'), pokemon_id: 'cherubi', location_id: 'obsidian-fieldlands', area_ar: 'طبيعة البرق', area_en: "Nature's Pantry", conditions_ar: 'من الأشجار', conditions_en: 'Tree shaking', rarity: 'uncommon', is_alpha: false },
  { id: spawnId('cherrim', 'obsidian-fieldlands'), pokemon_id: 'cherrim', location_id: 'obsidian-fieldlands', area_ar: 'طبيعة البرق', area_en: "Nature's Pantry", conditions_ar: 'نهاراً مشمس', conditions_en: 'Sunny day', rarity: 'rare', is_alpha: false },
  
  // Ruined Heap - قلعة الخراب
  { id: spawnId('gastly', 'obsidian-fieldlands'), pokemon_id: 'gastly', location_id: 'obsidian-fieldlands', area_ar: 'قلعة الخراب', area_en: 'Ruined Heap', conditions_ar: 'ليلاً', conditions_en: 'At night', rarity: 'common', is_alpha: false },
  { id: spawnId('haunter', 'obsidian-fieldlands'), pokemon_id: 'haunter', location_id: 'obsidian-fieldlands', area_ar: 'قلعة الخراب', area_en: 'Ruined Heap', conditions_ar: 'ليلاً', conditions_en: 'At night', rarity: 'uncommon', is_alpha: false },
  { id: spawnId('gengar', 'obsidian-fieldlands'), pokemon_id: 'gengar', location_id: 'obsidian-fieldlands', area_ar: 'قلعة الخراب', area_en: 'Ruined Heap', conditions_ar: 'ليلاً', conditions_en: 'At night', rarity: 'rare', is_alpha: false },
  { id: spawnId('zubat', 'obsidian-fieldlands'), pokemon_id: 'zubat', location_id: 'obsidian-fieldlands', area_ar: 'قلعة الخراب', area_en: 'Ruined Heap', conditions_ar: 'ليلاً', conditions_en: 'At night', rarity: 'common', is_alpha: false },
  { id: spawnId('golbat', 'obsidian-fieldlands'), pokemon_id: 'golbat', location_id: 'obsidian-fieldlands', area_ar: 'قلعة الخراب', area_en: 'Ruined Heap', conditions_ar: 'ليلاً', conditions_en: 'At night', rarity: 'uncommon', is_alpha: false },
  
  // Grandtree Arena - ساحة الكليفور
  { id: spawnId('kleavor', 'obsidian-fieldlands'), pokemon_id: 'kleavor', location_id: 'obsidian-fieldlands', area_ar: 'ساحة الكليفور', area_en: 'Grandtree Arena', conditions_ar: 'بعد الهزيمة', conditions_en: 'After battle', rarity: 'very_rare', is_alpha: false },
  { id: spawnId('scyther', 'obsidian-fieldlands'), pokemon_id: 'scyther', location_id: 'obsidian-fieldlands', area_ar: 'ساحة الكليفور', area_en: 'Grandtree Arena', conditions_ar: 'دائماً', conditions_en: 'Always', rarity: 'uncommon', is_alpha: false },
  { id: spawnId('paras', 'obsidian-fieldlands'), pokemon_id: 'paras', location_id: 'obsidian-fieldlands', area_ar: 'ساحة الكليفور', area_en: 'Grandtree Arena', conditions_ar: 'دائماً', conditions_en: 'Always', rarity: 'common', is_alpha: false },
  { id: spawnId('parasect', 'obsidian-fieldlands'), pokemon_id: 'parasect', location_id: 'obsidian-fieldlands', area_ar: 'ساحة الكليفور', area_en: 'Grandtree Arena', conditions_ar: 'دائماً', conditions_en: 'Always', rarity: 'uncommon', is_alpha: false },
  { id: spawnId('scyther', 'obsidian-fieldlands'), pokemon_id: 'scyther', location_id: 'obsidian-fieldlands', area_ar: 'ساحة الكليفور', area_en: 'Grandtree Arena', conditions_ar: 'ثابت', conditions_en: 'Fixed spawn', rarity: 'very_rare', is_alpha: true },
  
  // Floaro Gardens
  { id: spawnId('happiny', 'obsidian-fieldlands'), pokemon_id: 'happiny', location_id: 'obsidian-fieldlands', area_ar: 'حدائق فلوارو', area_en: 'Floaro Gardens', conditions_ar: 'نهاراً', conditions_en: 'During the day', rarity: 'rare', is_alpha: false },
  { id: spawnId('chansey', 'obsidian-fieldlands'), pokemon_id: 'chansey', location_id: 'obsidian-fieldlands', area_ar: 'حدائق فلوارو', area_en: 'Floaro Gardens', conditions_ar: 'نهاراً', conditions_en: 'During the day', rarity: 'rare', is_alpha: false },
  { id: spawnId('blissey', 'obsidian-fieldlands'), pokemon_id: 'blissey', location_id: 'obsidian-fieldlands', area_ar: 'حدائق فلوارو', area_en: 'Floaro Gardens', conditions_ar: 'ثابت', conditions_en: 'Fixed spawn', rarity: 'very_rare', is_alpha: true },
  
  // Deertrack Path
  { id: spawnId('geodude', 'obsidian-fieldlands'), pokemon_id: 'geodude', location_id: 'obsidian-fieldlands', area_ar: 'مسار الغزال', area_en: 'Deertrack Path', conditions_ar: 'دائماً', conditions_en: 'Always', rarity: 'common', is_alpha: false },
  { id: spawnId('graveler', 'obsidian-fieldlands'), pokemon_id: 'graveler', location_id: 'obsidian-fieldlands', area_ar: 'مسار الغزال', area_en: 'Deertrack Path', conditions_ar: 'دائماً', conditions_en: 'Always', rarity: 'uncommon', is_alpha: false },
  
  // ============================================
  // CRIMSON MIRELANDS - مستنقعات القرمز
  // ============================================
  
  // Cloudpool Ridge - غابة السحابة
  { id: spawnId('croagunk', 'crimson-mirelands'), pokemon_id: 'croagunk', location_id: 'crimson-mirelands', area_ar: 'غابة السحابة', area_en: 'Cloudpool Ridge', conditions_ar: 'دائماً', conditions_en: 'Always', rarity: 'common', is_alpha: false },
  { id: spawnId('toxicroak', 'crimson-mirelands'), pokemon_id: 'toxicroak', location_id: 'crimson-mirelands', area_ar: 'غابة السحابة', area_en: 'Cloudpool Ridge', conditions_ar: 'دائماً', conditions_en: 'Always', rarity: 'uncommon', is_alpha: false },
  { id: spawnId('stunky', 'crimson-mirelands'), pokemon_id: 'stunky', location_id: 'crimson-mirelands', area_ar: 'غابة السحابة', area_en: 'Cloudpool Ridge', conditions_ar: 'دائماً', conditions_en: 'Always', rarity: 'common', is_alpha: false },
  { id: spawnId('skuntank', 'crimson-mirelands'), pokemon_id: 'skuntank', location_id: 'crimson-mirelands', area_ar: 'غابة السحابة', area_en: 'Cloudpool Ridge', conditions_ar: 'دائماً', conditions_en: 'Always', rarity: 'uncommon', is_alpha: false },
  { id: spawnId('yanma', 'crimson-mirelands'), pokemon_id: 'yanma', location_id: 'crimson-mirelands', area_ar: 'غابة السحابة', area_en: 'Cloudpool Ridge', conditions_ar: 'نهاراً', conditions_en: 'During the day', rarity: 'common', is_alpha: false },
  { id: spawnId('yanmega', 'crimson-mirelands'), pokemon_id: 'yanmega', location_id: 'crimson-mirelands', area_ar: 'غابة السحابة', area_en: 'Cloudpool Ridge', conditions_ar: 'نهاراً', conditions_en: 'During the day', rarity: 'uncommon', is_alpha: false },
  { id: spawnId('hippopotas', 'crimson-mirelands'), pokemon_id: 'hippopotas', location_id: 'crimson-mirelands', area_ar: 'غابة السحابة', area_en: 'Cloudpool Ridge', conditions_ar: 'دائماً', conditions_en: 'Always', rarity: 'common', is_alpha: false },
  { id: spawnId('hippowdon', 'crimson-mirelands'), pokemon_id: 'hippowdon', location_id: 'crimson-mirelands', area_ar: 'غابة السحابة', area_en: 'Cloudpool Ridge', conditions_ar: 'ثابت', conditions_en: 'Fixed spawn', rarity: 'very_rare', is_alpha: true },
  
  // Bogbound Camp - معسكر البوغ
  { id: spawnId('petilil', 'crimson-mirelands'), pokemon_id: 'petilil', location_id: 'crimson-mirelands', area_ar: 'معسكر البوغ', area_en: 'Bogbound Camp', conditions_ar: 'دائماً', conditions_en: 'Always', rarity: 'common', is_alpha: false },
  { id: spawnId('hisuian-lilligant', 'crimson-mirelands'), pokemon_id: 'hisuian-lilligant', location_id: 'crimson-mirelands', area_ar: 'ساحة ليليغانت', area_en: 'Lilligant Arena', conditions_ar: 'بعد الهزيمة', conditions_en: 'After battle', rarity: 'very_rare', is_alpha: false },
  { id: spawnId('tangela', 'crimson-mirelands'), pokemon_id: 'tangela', location_id: 'crimson-mirelands', area_ar: 'معسكر البوغ', area_en: 'Bogbound Camp', conditions_ar: 'دائماً', conditions_en: 'Always', rarity: 'common', is_alpha: false },
  { id: spawnId('tangrowth', 'crimson-mirelands'), pokemon_id: 'tangrowth', location_id: 'crimson-mirelands', area_ar: 'معسكر البوغ', area_en: 'Bogbound Camp', conditions_ar: 'دائماً', conditions_en: 'Always', rarity: 'uncommon', is_alpha: false },
  
  // Bolderoll Slope - تلال الكهف
  { id: spawnId('machop', 'crimson-mirelands'), pokemon_id: 'machop', location_id: 'crimson-mirelands', area_ar: 'تلال الكهف', area_en: 'Bolderoll Slope', conditions_ar: 'دائماً', conditions_en: 'Always', rarity: 'common', is_alpha: false },
  { id: spawnId('machoke', 'crimson-mirelands'), pokemon_id: 'machoke', location_id: 'crimson-mirelands', area_ar: 'تلال الكهف', area_en: 'Bolderoll Slope', conditions_ar: 'دائماً', conditions_en: 'Always', rarity: 'uncommon', is_alpha: false },
  { id: spawnId('machamp', 'crimson-mirelands'), pokemon_id: 'machamp', location_id: 'crimson-mirelands', area_ar: 'تلال الكهف', area_en: 'Bolderoll Slope', conditions_ar: 'ثابت', conditions_en: 'Fixed spawn', rarity: 'very_rare', is_alpha: true },
  { id: spawnId('geodude', 'crimson-mirelands'), pokemon_id: 'geodude', location_id: 'crimson-mirelands', area_ar: 'تلال الكهف', area_en: 'Bolderoll Slope', conditions_ar: 'دائماً', conditions_en: 'Always', rarity: 'common', is_alpha: false },
  { id: spawnId('graveler', 'crimson-mirelands'), pokemon_id: 'graveler', location_id: 'crimson-mirelands', area_ar: 'تلال الكهف', area_en: 'Bolderoll Slope', conditions_ar: 'دائماً', conditions_en: 'Always', rarity: 'uncommon', is_alpha: false },
  { id: spawnId('golem', 'crimson-mirelands'), pokemon_id: 'golem', location_id: 'crimson-mirelands', area_ar: 'تلال الكهف', area_en: 'Bolderoll Slope', conditions_ar: 'دائماً', conditions_en: 'Always', rarity: 'rare', is_alpha: false },
  { id: spawnId('rhyhorn', 'crimson-mirelands'), pokemon_id: 'rhyhorn', location_id: 'crimson-mirelands', area_ar: 'تلال الكهف', area_en: 'Bolderoll Slope', conditions_ar: 'دائماً', conditions_en: 'Always', rarity: 'common', is_alpha: false },
  { id: spawnId('rhydon', 'crimson-mirelands'), pokemon_id: 'rhydon', location_id: 'crimson-mirelands', area_ar: 'تلال الكهف', area_en: 'Bolderoll Slope', conditions_ar: 'دائماً', conditions_en: 'Always', rarity: 'uncommon', is_alpha: false },
  
  // Scarlet Bog - المستنقع القرمزي
  { id: spawnId('barboach', 'crimson-mirelands'), pokemon_id: 'barboach', location_id: 'crimson-mirelands', area_ar: 'المستنقع القرمزي', area_en: 'Scarlet Bog', conditions_ar: 'في الماء', conditions_en: 'In water', rarity: 'common', is_alpha: false },
  { id: spawnId('whiscash', 'crimson-mirelands'), pokemon_id: 'whiscash', location_id: 'crimson-mirelands', area_ar: 'المستنقع القرمزي', area_en: 'Scarlet Bog', conditions_ar: 'في الماء', conditions_en: 'In water', rarity: 'uncommon', is_alpha: false },
  { id: spawnId('skorupi', 'crimson-mirelands'), pokemon_id: 'skorupi', location_id: 'crimson-mirelands', area_ar: 'المستنقع القرمزي', area_en: 'Scarlet Bog', conditions_ar: 'دائماً', conditions_en: 'Always', rarity: 'uncommon', is_alpha: false },
  { id: spawnId('drapion', 'crimson-mirelands'), pokemon_id: 'drapion', location_id: 'crimson-mirelands', area_ar: 'المستنقع القرمزي', area_en: 'Scarlet Bog', conditions_ar: 'دائماً', conditions_en: 'Always', rarity: 'rare', is_alpha: false },
  { id: spawnId('pachirisu', 'crimson-mirelands'), pokemon_id: 'pachirisu', location_id: 'crimson-mirelands', area_ar: 'المستنقع القرمزي', area_en: 'Scarlet Bog', conditions_ar: 'دائماً', conditions_en: 'Always', rarity: 'uncommon', is_alpha: false },
  { id: spawnId('uxie', 'crimson-mirelands'), pokemon_id: 'uxie', location_id: 'crimson-mirelands', area_ar: 'بحيرة المعرفة', area_en: 'Lake Valor', conditions_ar: 'بعد القصة', conditions_en: 'Post-game', rarity: 'very_rare', is_alpha: false },
  
  // Gapejaw Bog
  { id: spawnId('carnivine', 'crimson-mirelands'), pokemon_id: 'carnivine', location_id: 'crimson-mirelands', area_ar: 'مستنقع الفك', area_en: 'Gapejaw Bog', conditions_ar: 'دائماً', conditions_en: 'Always', rarity: 'uncommon', is_alpha: false },
  { id: spawnId('roselia', 'crimson-mirelands'), pokemon_id: 'roselia', location_id: 'crimson-mirelands', area_ar: 'مستنقع الفك', area_en: 'Gapejaw Bog', conditions_ar: 'نهاراً', conditions_en: 'During the day', rarity: 'uncommon', is_alpha: false },
  { id: spawnId('roserade', 'crimson-mirelands'), pokemon_id: 'roserade', location_id: 'crimson-mirelands', area_ar: 'مستنقع الفك', area_en: 'Gapejaw Bog', conditions_ar: 'نهاراً', conditions_en: 'During the day', rarity: 'rare', is_alpha: false },
  
  // ============================================
  // COBALT COASTLANDS - سواحل الكوبالت
  // ============================================
  
  // Ginkgo Landing - شاطئ جينكو
  { id: spawnId('wingull', 'cobalt-coastlands'), pokemon_id: 'wingull', location_id: 'cobalt-coastlands', area_ar: 'شاطئ جينكو', area_en: 'Ginkgo Landing', conditions_ar: 'دائماً', conditions_en: 'Always', rarity: 'common', is_alpha: false },
  { id: spawnId('pelipper', 'cobalt-coastlands'), pokemon_id: 'pelipper', location_id: 'cobalt-coastlands', area_ar: 'شاطئ جينكو', area_en: 'Ginkgo Landing', conditions_ar: 'دائماً', conditions_en: 'Always', rarity: 'uncommon', is_alpha: false },
  { id: spawnId('tentacool', 'cobalt-coastlands'), pokemon_id: 'tentacool', location_id: 'cobalt-coastlands', area_ar: 'شاطئ جينكو', area_en: 'Ginkgo Landing', conditions_ar: 'في الماء', conditions_en: 'In water', rarity: 'common', is_alpha: false },
  { id: spawnId('tentacruel', 'cobalt-coastlands'), pokemon_id: 'tentacruel', location_id: 'cobalt-coastlands', area_ar: 'شاطئ جينكو', area_en: 'Ginkgo Landing', conditions_ar: 'في الماء', conditions_en: 'In water', rarity: 'uncommon', is_alpha: false },
  { id: spawnId('drifblim', 'cobalt-coastlands'), pokemon_id: 'drifblim', location_id: 'cobalt-coastlands', area_ar: 'شاطئ جينكو', area_en: 'Ginkgo Landing', conditions_ar: 'ليلاً', conditions_en: 'At night', rarity: 'uncommon', is_alpha: false },
  { id: spawnId('shellos', 'cobalt-coastlands'), pokemon_id: 'shellos', location_id: 'cobalt-coastlands', area_ar: 'شاطئ جينكو', area_en: 'Ginkgo Landing', conditions_ar: 'دائماً', conditions_en: 'Always', rarity: 'common', is_alpha: false },
  { id: spawnId('gastrodon', 'cobalt-coastlands'), pokemon_id: 'gastrodon', location_id: 'cobalt-coastlands', area_ar: 'شاطئ جينكو', area_en: 'Ginkgo Landing', conditions_ar: 'دائماً', conditions_en: 'Always', rarity: 'uncommon', is_alpha: false },
  
  // Firespit Island - جزيرة الطوفان
  { id: spawnId('hisuian-growlithe', 'cobalt-coastlands'), pokemon_id: 'hisuian-growlithe', location_id: 'cobalt-coastlands', area_ar: 'جزيرة الطوفان', area_en: 'Firespit Island', conditions_ar: 'دائماً', conditions_en: 'Always', rarity: 'uncommon', is_alpha: false },
  { id: spawnId('hisuian-arcanine', 'cobalt-coastlands'), pokemon_id: 'hisuian-arcanine', location_id: 'cobalt-coastlands', area_ar: 'ساحة أركاناين', area_en: 'Arcanine Arena', conditions_ar: 'بعد الهزيمة', conditions_en: 'After battle', rarity: 'very_rare', is_alpha: false },
  { id: spawnId('magmar', 'cobalt-coastlands'), pokemon_id: 'magmar', location_id: 'cobalt-coastlands', area_ar: 'جزيرة الطوفان', area_en: 'Firespit Island', conditions_ar: 'دائماً', conditions_en: 'Always', rarity: 'uncommon', is_alpha: false },
  { id: spawnId('magmortar', 'cobalt-coastlands'), pokemon_id: 'magmortar', location_id: 'cobalt-coastlands', area_ar: 'جزيرة الطوفان', area_en: 'Firespit Island', conditions_ar: 'ثابت', conditions_en: 'Fixed spawn', rarity: 'very_rare', is_alpha: true },
  { id: spawnId('ninetales', 'cobalt-coastlands'), pokemon_id: 'ninetales', location_id: 'cobalt-coastlands', area_ar: 'جزيرة الطوفان', area_en: 'Firespit Island', conditions_ar: 'دائماً', conditions_en: 'Always', rarity: 'rare', is_alpha: false },
  { id: spawnId('vulpix', 'cobalt-coastlands'), pokemon_id: 'vulpix', location_id: 'cobalt-coastlands', area_ar: 'جزيرة الطوفان', area_en: 'Firespit Island', conditions_ar: 'دائماً', conditions_en: 'Always', rarity: 'uncommon', is_alpha: false },
  
  // Seagrass Haven
  { id: spawnId('basculin', 'cobalt-coastlands'), pokemon_id: 'basculin', location_id: 'cobalt-coastlands', area_ar: 'ملاذ الأعشاب', area_en: 'Seagrass Haven', conditions_ar: 'في الماء', conditions_en: 'In water', rarity: 'common', is_alpha: false },
  { id: spawnId('basculegion', 'cobalt-coastlands'), pokemon_id: 'basculegion', location_id: 'cobalt-coastlands', area_ar: 'ملاذ الأعشاب', area_en: 'Seagrass Haven', conditions_ar: 'في الماء', conditions_en: 'In water', rarity: 'rare', is_alpha: false },
  { id: spawnId('qwilfish', 'cobalt-coastlands'), pokemon_id: 'hisuian-qwilfish', location_id: 'cobalt-coastlands', area_ar: 'ملاذ الأعشاب', area_en: 'Seagrass Haven', conditions_ar: 'في الماء', conditions_en: 'In water', rarity: 'uncommon', is_alpha: false },
  { id: spawnId('overqwil', 'cobalt-coastlands'), pokemon_id: 'overqwil', location_id: 'cobalt-coastlands', area_ar: 'ملاذ الأعشاب', area_en: 'Seagrass Haven', conditions_ar: 'في الماء', conditions_en: 'In water', rarity: 'rare', is_alpha: false },
  { id: spawnId('mantine', 'cobalt-coastlands'), pokemon_id: 'mantine', location_id: 'cobalt-coastlands', area_ar: 'ملاذ الأعشاب', area_en: 'Seagrass Haven', conditions_ar: 'في الماء', conditions_en: 'In water', rarity: 'uncommon', is_alpha: false },
  { id: spawnId('mantyke', 'cobalt-coastlands'), pokemon_id: 'mantyke', location_id: 'cobalt-coastlands', area_ar: 'ملاذ الأعشاب', area_en: 'Seagrass Haven', conditions_ar: 'في الماء', conditions_en: 'In water', rarity: 'common', is_alpha: false },
  { id: spawnId('remoraid', 'cobalt-coastlands'), pokemon_id: 'remoraid', location_id: 'cobalt-coastlands', area_ar: 'ملاذ الأعشاب', area_en: 'Seagrass Haven', conditions_ar: 'في الماء', conditions_en: 'In water', rarity: 'common', is_alpha: false },
  { id: spawnId('octillery', 'cobalt-coastlands'), pokemon_id: 'octillery', location_id: 'cobalt-coastlands', area_ar: 'ملاذ الأعشاب', area_en: 'Seagrass Haven', conditions_ar: 'في الماء', conditions_en: 'In water', rarity: 'uncommon', is_alpha: false },
  
  // Tranquility Cove
  { id: spawnId('spheal', 'cobalt-coastlands'), pokemon_id: 'spheal', location_id: 'cobalt-coastlands', area_ar: 'خليج الهدوء', area_en: 'Tranquility Cove', conditions_ar: 'دائماً', conditions_en: 'Always', rarity: 'common', is_alpha: false },
  { id: spawnId('sealeo', 'cobalt-coastlands'), pokemon_id: 'sealeo', location_id: 'cobalt-coastlands', area_ar: 'خليج الهدوء', area_en: 'Tranquility Cove', conditions_ar: 'دائماً', conditions_en: 'Always', rarity: 'uncommon', is_alpha: false },
  { id: spawnId('walrein', 'cobalt-coastlands'), pokemon_id: 'walrein', location_id: 'cobalt-coastlands', area_ar: 'خليج الهدوء', area_en: 'Tranquility Cove', conditions_ar: 'ثابت', conditions_en: 'Fixed spawn', rarity: 'very_rare', is_alpha: true },
  { id: spawnId('buizel', 'cobalt-coastlands'), pokemon_id: 'buizel', location_id: 'cobalt-coastlands', area_ar: 'خليج الهدوء', area_en: 'Tranquility Cove', conditions_ar: 'في الماء', conditions_en: 'In water', rarity: 'common', is_alpha: false },
  { id: spawnId('floatzel', 'cobalt-coastlands'), pokemon_id: 'floatzel', location_id: 'cobalt-coastlands', area_ar: 'خليج الهدوء', area_en: 'Tranquility Cove', conditions_ar: 'في الماء', conditions_en: 'In water', rarity: 'uncommon', is_alpha: false },
  
  // Lunker's Lair
  { id: spawnId('lumineon', 'cobalt-coastlands'), pokemon_id: 'lumineon', location_id: 'cobalt-coastlands', area_ar: 'وكر السمكة', area_en: "Lunker's Lair", conditions_ar: 'في الماء', conditions_en: 'In water', rarity: 'uncommon', is_alpha: false },
  { id: spawnId('finneon', 'cobalt-coastlands'), pokemon_id: 'finneon', location_id: 'cobalt-coastlands', area_ar: 'وكر السمكة', area_en: "Lunker's Lair", conditions_ar: 'في الماء', conditions_en: 'In water', rarity: 'common', is_alpha: false },
  
  // ============================================
  // CORONET HIGHLANDS - مرتفعات كورونيت
  // ============================================
  
  // Sinnoh Temple - معبد سينجو
  { id: spawnId('dialga-origin', 'coronet-highlands'), pokemon_id: 'dialga-origin', location_id: 'coronet-highlands', area_ar: 'معبد سينجو', area_en: 'Sinnoh Temple', conditions_ar: 'بعد القصة', conditions_en: 'Post-game', rarity: 'very_rare', is_alpha: false },
  { id: spawnId('palkia-origin', 'coronet-highlands'), pokemon_id: 'palkia-origin', location_id: 'coronet-highlands', area_ar: 'معبد سينجو', area_en: 'Sinnoh Temple', conditions_ar: 'بعد القصة', conditions_en: 'Post-game', rarity: 'very_rare', is_alpha: false },
  { id: spawnId('bronzong', 'coronet-highlands'), pokemon_id: 'bronzong', location_id: 'coronet-highlands', area_ar: 'معبد سينجو', area_en: 'Sinnoh Temple', conditions_ar: 'دائماً', conditions_en: 'Always', rarity: 'uncommon', is_alpha: false },
  { id: spawnId('bronzor', 'coronet-highlands'), pokemon_id: 'bronzor', location_id: 'coronet-highlands', area_ar: 'معبد سينجو', area_en: 'Sinnoh Temple', conditions_ar: 'دائماً', conditions_en: 'Always', rarity: 'common', is_alpha: false },
  
  // Coronet Peak - قمة كورونيت
  { id: spawnId('arceus', 'coronet-highlands'), pokemon_id: 'arceus', location_id: 'coronet-highlands', area_ar: 'قمة كورونيت', area_en: 'Coronet Peak', conditions_ar: 'بعد إكمال كل شيء', conditions_en: 'After 100% completion', rarity: 'very_rare', is_alpha: false },
  { id: spawnId('clefairy', 'coronet-highlands'), pokemon_id: 'clefairy', location_id: 'coronet-highlands', area_ar: 'قمة كورونيت', area_en: 'Coronet Peak', conditions_ar: 'ليلاً', conditions_en: 'At night', rarity: 'uncommon', is_alpha: false },
  { id: spawnId('clefable', 'coronet-highlands'), pokemon_id: 'clefable', location_id: 'coronet-highlands', area_ar: 'قمة كورونيت', area_en: 'Coronet Peak', conditions_ar: 'ليلاً', conditions_en: 'At night', rarity: 'rare', is_alpha: false },
  { id: spawnId('cleffa', 'coronet-highlands'), pokemon_id: 'cleffa', location_id: 'coronet-highlands', area_ar: 'قمة كورونيت', area_en: 'Coronet Peak', conditions_ar: 'ليلاً', conditions_en: 'At night', rarity: 'rare', is_alpha: false },
  
  // Celestica Trail
  { id: spawnId('gligar', 'coronet-highlands'), pokemon_id: 'gligar', location_id: 'coronet-highlands', area_ar: 'مسار سيليستيكا', area_en: 'Celestica Trail', conditions_ar: 'دائماً', conditions_en: 'Always', rarity: 'common', is_alpha: false },
  { id: spawnId('gliscor', 'coronet-highlands'), pokemon_id: 'gliscor', location_id: 'coronet-highlands', area_ar: 'مسار سيليستيكا', area_en: 'Celestica Trail', conditions_ar: 'ليلاً', conditions_en: 'At night', rarity: 'uncommon', is_alpha: false },
  { id: spawnId('misdreavus', 'coronet-highlands'), pokemon_id: 'misdreavus', location_id: 'coronet-highlands', area_ar: 'مسار سيليستيكا', area_en: 'Celestica Trail', conditions_ar: 'ليلاً', conditions_en: 'At night', rarity: 'common', is_alpha: false },
  { id: spawnId('mismagius', 'coronet-highlands'), pokemon_id: 'mismagius', location_id: 'coronet-highlands', area_ar: 'مسار سيليستيكا', area_en: 'Celestica Trail', conditions_ar: 'ليلاً', conditions_en: 'At night', rarity: 'uncommon', is_alpha: false },
  { id: spawnId('chimchar', 'coronet-highlands'), pokemon_id: 'chimchar', location_id: 'coronet-highlands', area_ar: 'مسار سيليستيكا', area_en: 'Celestica Trail', conditions_ar: 'دائماً', conditions_en: 'Always', rarity: 'rare', is_alpha: false },
  { id: spawnId('monferno', 'coronet-highlands'), pokemon_id: 'monferno', location_id: 'coronet-highlands', area_ar: 'مسار سيليستيكا', area_en: 'Celestica Trail', conditions_ar: 'دائماً', conditions_en: 'Always', rarity: 'rare', is_alpha: false },
  { id: spawnId('infernape', 'coronet-highlands'), pokemon_id: 'infernape', location_id: 'coronet-highlands', area_ar: 'مسار سيليستيكا', area_en: 'Celestica Trail', conditions_ar: 'ثابت', conditions_en: 'Fixed spawn', rarity: 'very_rare', is_alpha: true },
  
  // Wayward Cave
  { id: spawnId('gible', 'coronet-highlands'), pokemon_id: 'gible', location_id: 'coronet-highlands', area_ar: 'كهف الضياع', area_en: 'Wayward Cave', conditions_ar: 'دائماً', conditions_en: 'Always', rarity: 'rare', is_alpha: false },
  { id: spawnId('gabite', 'coronet-highlands'), pokemon_id: 'gabite', location_id: 'coronet-highlands', area_ar: 'كهف الضياع', area_en: 'Wayward Cave', conditions_ar: 'دائماً', conditions_en: 'Always', rarity: 'rare', is_alpha: false },
  { id: spawnId('garchomp', 'coronet-highlands'), pokemon_id: 'garchomp', location_id: 'coronet-highlands', area_ar: 'كهف الضياع', area_en: 'Wayward Cave', conditions_ar: 'ثابت', conditions_en: 'Fixed spawn', rarity: 'very_rare', is_alpha: true },
  { id: spawnId('onix', 'coronet-highlands'), pokemon_id: 'onix', location_id: 'coronet-highlands', area_ar: 'كهف الضياع', area_en: 'Wayward Cave', conditions_ar: 'دائماً', conditions_en: 'Always', rarity: 'uncommon', is_alpha: false },
  { id: spawnId('steelix', 'coronet-highlands'), pokemon_id: 'steelix', location_id: 'coronet-highlands', area_ar: 'كهف الضياع', area_en: 'Wayward Cave', conditions_ar: 'دائماً', conditions_en: 'Always', rarity: 'rare', is_alpha: false },
  { id: spawnId('nosepass', 'coronet-highlands'), pokemon_id: 'nosepass', location_id: 'coronet-highlands', area_ar: 'كهف الضياع', area_en: 'Wayward Cave', conditions_ar: 'دائماً', conditions_en: 'Always', rarity: 'uncommon', is_alpha: false },
  { id: spawnId('probopass', 'coronet-highlands'), pokemon_id: 'probopass', location_id: 'coronet-highlands', area_ar: 'كهف الضياع', area_en: 'Wayward Cave', conditions_ar: 'دائماً', conditions_en: 'Always', rarity: 'rare', is_alpha: false },
  
  // Bolderoll Ravine
  { id: spawnId('electrode', 'coronet-highlands'), pokemon_id: 'hisuian-electrode', location_id: 'coronet-highlands', area_ar: 'ساحة إلكترود', area_en: 'Electrode Arena', conditions_ar: 'بعد الهزيمة', conditions_en: 'After battle', rarity: 'very_rare', is_alpha: false },
  { id: spawnId('voltorb', 'coronet-highlands'), pokemon_id: 'hisuian-voltorb', location_id: 'coronet-highlands', area_ar: 'منحدر بولدرول', area_en: 'Bolderoll Ravine', conditions_ar: 'دائماً', conditions_en: 'Always', rarity: 'uncommon', is_alpha: false },
  { id: spawnId('electabuzz', 'coronet-highlands'), pokemon_id: 'electabuzz', location_id: 'coronet-highlands', area_ar: 'منحدر بولدرول', area_en: 'Bolderoll Ravine', conditions_ar: 'أثناء العواصف', conditions_en: 'During storms', rarity: 'uncommon', is_alpha: false },
  { id: spawnId('electivire', 'coronet-highlands'), pokemon_id: 'electivire', location_id: 'coronet-highlands', area_ar: 'منحدر بولدرول', area_en: 'Bolderoll Ravine', conditions_ar: 'أثناء العواصف', conditions_en: 'During storms', rarity: 'rare', is_alpha: false },
  { id: spawnId('elekid', 'coronet-highlands'), pokemon_id: 'elekid', location_id: 'coronet-highlands', area_ar: 'منحدر بولدرول', area_en: 'Bolderoll Ravine', conditions_ar: 'أثناء العواصف', conditions_en: 'During storms', rarity: 'uncommon', is_alpha: false },
  
  // Ancient Quarry
  { id: spawnId('cranidos', 'coronet-highlands'), pokemon_id: 'cranidos', location_id: 'coronet-highlands', area_ar: 'المحجر القديم', area_en: 'Ancient Quarry', conditions_ar: 'تشويه الفضاء-الزمان', conditions_en: 'Space-Time Distortion', rarity: 'rare', is_alpha: false },
  { id: spawnId('rampardos', 'coronet-highlands'), pokemon_id: 'rampardos', location_id: 'coronet-highlands', area_ar: 'المحجر القديم', area_en: 'Ancient Quarry', conditions_ar: 'تشويه الفضاء-الزمان', conditions_en: 'Space-Time Distortion', rarity: 'very_rare', is_alpha: false },
  { id: spawnId('shieldon', 'coronet-highlands'), pokemon_id: 'shieldon', location_id: 'coronet-highlands', area_ar: 'المحجر القديم', area_en: 'Ancient Quarry', conditions_ar: 'تشويه الفضاء-الزمان', conditions_en: 'Space-Time Distortion', rarity: 'rare', is_alpha: false },
  { id: spawnId('bastiodon', 'coronet-highlands'), pokemon_id: 'bastiodon', location_id: 'coronet-highlands', area_ar: 'المحجر القديم', area_en: 'Ancient Quarry', conditions_ar: 'تشويه الفضاء-الزمان', conditions_en: 'Space-Time Distortion', rarity: 'very_rare', is_alpha: false },
  
  // Sacred Plaza
  { id: spawnId('luxray', 'coronet-highlands'), pokemon_id: 'luxray', location_id: 'coronet-highlands', area_ar: 'الساحة المقدسة', area_en: 'Sacred Plaza', conditions_ar: 'ثابت', conditions_en: 'Fixed spawn', rarity: 'very_rare', is_alpha: true },
  { id: spawnId('luxio', 'coronet-highlands'), pokemon_id: 'luxio', location_id: 'coronet-highlands', area_ar: 'الساحة المقدسة', area_en: 'Sacred Plaza', conditions_ar: 'دائماً', conditions_en: 'Always', rarity: 'uncommon', is_alpha: false },
  
  // ============================================
  // ALABASTER ICELANDS - أراضي الثلج البيضاء
  // ============================================
  
  // Lake Acuity - بحيرة أكويتي
  { id: spawnId('snorunt', 'alabaster-icelands'), pokemon_id: 'snorunt', location_id: 'alabaster-icelands', area_ar: 'بحيرة أكويتي', area_en: 'Lake Acuity', conditions_ar: 'دائماً', conditions_en: 'Always', rarity: 'common', is_alpha: false },
  { id: spawnId('glalie', 'alabaster-icelands'), pokemon_id: 'glalie', location_id: 'alabaster-icelands', area_ar: 'بحيرة أكويتي', area_en: 'Lake Acuity', conditions_ar: 'دائماً', conditions_en: 'Always', rarity: 'uncommon', is_alpha: false },
  { id: spawnId('froslass', 'alabaster-icelands'), pokemon_id: 'froslass', location_id: 'alabaster-icelands', area_ar: 'بحيرة أكويتي', area_en: 'Lake Acuity', conditions_ar: 'ليلاً', conditions_en: 'At night', rarity: 'rare', is_alpha: false },
  { id: spawnId('azelf', 'alabaster-icelands'), pokemon_id: 'azelf', location_id: 'alabaster-icelands', area_ar: 'بحيرة أكويتي', area_en: 'Lake Acuity', conditions_ar: 'بعد القصة', conditions_en: 'Post-game', rarity: 'very_rare', is_alpha: false },
  { id: spawnId('bergmite', 'alabaster-icelands'), pokemon_id: 'bergmite', location_id: 'alabaster-icelands', area_ar: 'بحيرة أكويتي', area_en: 'Lake Acuity', conditions_ar: 'دائماً', conditions_en: 'Always', rarity: 'common', is_alpha: false },
  { id: spawnId('hisuian-avalugg', 'alabaster-icelands'), pokemon_id: 'hisuian-avalugg', location_id: 'alabaster-icelands', area_ar: 'ساحة أفالوج', area_en: 'Avalugg Arena', conditions_ar: 'بعد الهزيمة', conditions_en: 'After battle', rarity: 'very_rare', is_alpha: false },
  
  // Snowpoint Temple - أرينا الثلج
  { id: spawnId('regigigas', 'alabaster-icelands'), pokemon_id: 'regigigas', location_id: 'alabaster-icelands', area_ar: 'معبد سنوبوينت', area_en: 'Snowpoint Temple', conditions_ar: 'بعد القصة', conditions_en: 'Post-game', rarity: 'very_rare', is_alpha: false },
  { id: spawnId('bronzong', 'alabaster-icelands'), pokemon_id: 'bronzong', location_id: 'alabaster-icelands', area_ar: 'معبد سنوبوينت', area_en: 'Snowpoint Temple', conditions_ar: 'دائماً', conditions_en: 'Always', rarity: 'uncommon', is_alpha: false },
  { id: spawnId('bronzor', 'alabaster-icelands'), pokemon_id: 'bronzor', location_id: 'alabaster-icelands', area_ar: 'معبد سنوبوينت', area_en: 'Snowpoint Temple', conditions_ar: 'دائماً', conditions_en: 'Always', rarity: 'common', is_alpha: false },
  
  // Bonechill Wastes
  { id: spawnId('swinub', 'alabaster-icelands'), pokemon_id: 'swinub', location_id: 'alabaster-icelands', area_ar: 'أراضي البرد', area_en: 'Bonechill Wastes', conditions_ar: 'دائماً', conditions_en: 'Always', rarity: 'common', is_alpha: false },
  { id: spawnId('piloswine', 'alabaster-icelands'), pokemon_id: 'piloswine', location_id: 'alabaster-icelands', area_ar: 'أراضي البرد', area_en: 'Bonechill Wastes', conditions_ar: 'دائماً', conditions_en: 'Always', rarity: 'uncommon', is_alpha: false },
  { id: spawnId('mamoswine', 'alabaster-icelands'), pokemon_id: 'mamoswine', location_id: 'alabaster-icelands', area_ar: 'أراضي البرد', area_en: 'Bonechill Wastes', conditions_ar: 'ثابت', conditions_en: 'Fixed spawn', rarity: 'very_rare', is_alpha: true },
  { id: spawnId('snover', 'alabaster-icelands'), pokemon_id: 'snover', location_id: 'alabaster-icelands', area_ar: 'أراضي البرد', area_en: 'Bonechill Wastes', conditions_ar: 'دائماً', conditions_en: 'Always', rarity: 'common', is_alpha: false },
  { id: spawnId('abomasnow', 'alabaster-icelands'), pokemon_id: 'abomasnow', location_id: 'alabaster-icelands', area_ar: 'أراضي البرد', area_en: 'Bonechill Wastes', conditions_ar: 'دائماً', conditions_en: 'Always', rarity: 'uncommon', is_alpha: false },
  { id: spawnId('sneasel', 'alabaster-icelands'), pokemon_id: 'hisuian-sneasel', location_id: 'alabaster-icelands', area_ar: 'أراضي البرد', area_en: 'Bonechill Wastes', conditions_ar: 'دائماً', conditions_en: 'Always', rarity: 'uncommon', is_alpha: false },
  { id: spawnId('sneasler', 'alabaster-icelands'), pokemon_id: 'sneasler', location_id: 'alabaster-icelands', area_ar: 'أراضي البرد', area_en: 'Bonechill Wastes', conditions_ar: 'دائماً', conditions_en: 'Always', rarity: 'rare', is_alpha: false },
  
  // Arena's Approach
  { id: spawnId('zorua', 'alabaster-icelands'), pokemon_id: 'hisuian-zorua', location_id: 'alabaster-icelands', area_ar: 'مقاربة الساحة', area_en: "Arena's Approach", conditions_ar: 'ليلاً', conditions_en: 'At night', rarity: 'rare', is_alpha: false },
  { id: spawnId('zoroark', 'alabaster-icelands'), pokemon_id: 'hisuian-zoroark', location_id: 'alabaster-icelands', area_ar: 'مقاربة الساحة', area_en: "Arena's Approach", conditions_ar: 'ليلاً', conditions_en: 'At night', rarity: 'rare', is_alpha: false },
  { id: spawnId('zoroark', 'alabaster-icelands'), pokemon_id: 'hisuian-zoroark', location_id: 'alabaster-icelands', area_ar: 'مقاربة الساحة', area_en: "Arena's Approach", conditions_ar: 'ثابت', conditions_en: 'Fixed spawn', rarity: 'very_rare', is_alpha: true },
  
  // Icebound Falls
  { id: spawnId('hisuian-braviary', 'alabaster-icelands'), pokemon_id: 'hisuian-braviary', location_id: 'alabaster-icelands', area_ar: 'شلالات الجليد', area_en: 'Icebound Falls', conditions_ar: 'بعد الهزيمة', conditions_en: 'After battle', rarity: 'very_rare', is_alpha: false },
  { id: spawnId('rufflet', 'alabaster-icelands'), pokemon_id: 'rufflet', location_id: 'alabaster-icelands', area_ar: 'شلالات الجليد', area_en: 'Icebound Falls', conditions_ar: 'دائماً', conditions_en: 'Always', rarity: 'uncommon', is_alpha: false },
  { id: spawnId('weavile', 'alabaster-icelands'), pokemon_id: 'weavile', location_id: 'alabaster-icelands', area_ar: 'شلالات الجليد', area_en: 'Icebound Falls', conditions_ar: 'ليلاً', conditions_en: 'At night', rarity: 'rare', is_alpha: false },
  
  // Avalanche Slopes
  { id: spawnId('riolu', 'alabaster-icelands'), pokemon_id: 'riolu', location_id: 'alabaster-icelands', area_ar: 'منحدرات الانهيار', area_en: 'Avalanche Slopes', conditions_ar: 'دائماً', conditions_en: 'Always', rarity: 'rare', is_alpha: false },
  { id: spawnId('lucario', 'alabaster-icelands'), pokemon_id: 'lucario', location_id: 'alabaster-icelands', area_ar: 'منحدرات الانهيار', area_en: 'Avalanche Slopes', conditions_ar: 'ثابت', conditions_en: 'Fixed spawn', rarity: 'very_rare', is_alpha: true },
  { id: spawnId('machoke', 'alabaster-icelands'), pokemon_id: 'machoke', location_id: 'alabaster-icelands', area_ar: 'منحدرات الانهيار', area_en: 'Avalanche Slopes', conditions_ar: 'دائماً', conditions_en: 'Always', rarity: 'uncommon', is_alpha: false },
  { id: spawnId('machamp', 'alabaster-icelands'), pokemon_id: 'machamp', location_id: 'alabaster-icelands', area_ar: 'منحدرات الانهيار', area_en: 'Avalanche Slopes', conditions_ar: 'دائماً', conditions_en: 'Always', rarity: 'rare', is_alpha: false },
  
  // Glacier Terrace
  { id: spawnId('hisuian-goodra', 'alabaster-icelands'), pokemon_id: 'hisuian-goodra', location_id: 'alabaster-icelands', area_ar: 'شرفة الجليد', area_en: 'Glacier Terrace', conditions_ar: 'عند المطر', conditions_en: 'During rain', rarity: 'very_rare', is_alpha: false },
  { id: spawnId('sliggoo', 'alabaster-icelands'), pokemon_id: 'hisuian-sliggoo', location_id: 'alabaster-icelands', area_ar: 'شرفة الجليد', area_en: 'Glacier Terrace', conditions_ar: 'عند المطر', conditions_en: 'During rain', rarity: 'rare', is_alpha: false },
  { id: spawnId('goomy', 'alabaster-icelands'), pokemon_id: 'goomy', location_id: 'alabaster-icelands', area_ar: 'شرفة الجليد', area_en: 'Glacier Terrace', conditions_ar: 'عند المطر', conditions_en: 'During rain', rarity: 'uncommon', is_alpha: false },
  
  // ============================================
  // SPACE-TIME DISTORTIONS - تشويهات الفضاء-الزمان
  // ============================================
  
  // Obsidian Fieldlands Distortions
  { id: spawnId('johtonian-sneasel', 'obsidian-fieldlands'), pokemon_id: 'sneasel', location_id: 'obsidian-fieldlands', area_ar: 'تشويه الفضاء-الزمان', area_en: 'Space-Time Distortion', conditions_ar: 'تشويه الفضاء-الزمان', conditions_en: 'Space-Time Distortion', rarity: 'rare', is_alpha: false },
  { id: spawnId('weavile', 'obsidian-fieldlands'), pokemon_id: 'weavile', location_id: 'obsidian-fieldlands', area_ar: 'تشويه الفضاء-الزمان', area_en: 'Space-Time Distortion', conditions_ar: 'تشويه الفضاء-الزمان', conditions_en: 'Space-Time Distortion', rarity: 'very_rare', is_alpha: false },
  { id: spawnId('sylveon', 'obsidian-fieldlands'), pokemon_id: 'sylveon', location_id: 'obsidian-fieldlands', area_ar: 'تشويه الفضاء-الزمان', area_en: 'Space-Time Distortion', conditions_ar: 'تشويه الفضاء-الزمان', conditions_en: 'Space-Time Distortion', rarity: 'very_rare', is_alpha: false },
  
  // Crimson Mirelands Distortions
  { id: spawnId('porygon', 'crimson-mirelands'), pokemon_id: 'porygon', location_id: 'crimson-mirelands', area_ar: 'تشويه الفضاء-الزمان', area_en: 'Space-Time Distortion', conditions_ar: 'تشويه الفضاء-الزمان', conditions_en: 'Space-Time Distortion', rarity: 'rare', is_alpha: false },
  { id: spawnId('porygon2', 'crimson-mirelands'), pokemon_id: 'porygon2', location_id: 'crimson-mirelands', area_ar: 'تشويه الفضاء-الزمان', area_en: 'Space-Time Distortion', conditions_ar: 'تشويه الفضاء-الزمان', conditions_en: 'Space-Time Distortion', rarity: 'very_rare', is_alpha: false },
  { id: spawnId('porygon-z', 'crimson-mirelands'), pokemon_id: 'porygon-z', location_id: 'crimson-mirelands', area_ar: 'تشويه الفضاء-الزمان', area_en: 'Space-Time Distortion', conditions_ar: 'تشويه الفضاء-الزمان', conditions_en: 'Space-Time Distortion', rarity: 'very_rare', is_alpha: false },
  { id: spawnId('cyndaquil', 'crimson-mirelands'), pokemon_id: 'cyndaquil', location_id: 'crimson-mirelands', area_ar: 'تشويه الفضاء-الزمان', area_en: 'Space-Time Distortion', conditions_ar: 'تشويه الفضاء-الزمان', conditions_en: 'Space-Time Distortion', rarity: 'rare', is_alpha: false },
  
  // Cobalt Coastlands Distortions
  { id: spawnId('magnemite', 'cobalt-coastlands'), pokemon_id: 'magnemite', location_id: 'cobalt-coastlands', area_ar: 'تشويه الفضاء-الزمان', area_en: 'Space-Time Distortion', conditions_ar: 'تشويه الفضاء-الزمان', conditions_en: 'Space-Time Distortion', rarity: 'uncommon', is_alpha: false },
  { id: spawnId('magneton', 'cobalt-coastlands'), pokemon_id: 'magneton', location_id: 'cobalt-coastlands', area_ar: 'تشويه الفضاء-الزمان', area_en: 'Space-Time Distortion', conditions_ar: 'تشويه الفضاء-الزمان', conditions_en: 'Space-Time Distortion', rarity: 'rare', is_alpha: false },
  { id: spawnId('magnezone', 'cobalt-coastlands'), pokemon_id: 'magnezone', location_id: 'cobalt-coastlands', area_ar: 'تشويه الفضاء-الزمان', area_en: 'Space-Time Distortion', conditions_ar: 'تشويه الفضاء-الزمان', conditions_en: 'Space-Time Distortion', rarity: 'very_rare', is_alpha: false },
  { id: spawnId('rowlet', 'cobalt-coastlands'), pokemon_id: 'rowlet', location_id: 'cobalt-coastlands', area_ar: 'تشويه الفضاء-الزمان', area_en: 'Space-Time Distortion', conditions_ar: 'تشويه الفضاء-الزمان', conditions_en: 'Space-Time Distortion', rarity: 'rare', is_alpha: false },
  
  // Coronet Highlands Distortions
  { id: spawnId('oshawott', 'coronet-highlands'), pokemon_id: 'oshawott', location_id: 'coronet-highlands', area_ar: 'تشويه الفضاء-الزمان', area_en: 'Space-Time Distortion', conditions_ar: 'تشويه الفضاء-الزمان', conditions_en: 'Space-Time Distortion', rarity: 'rare', is_alpha: false },
  
  // Alabaster Icelands Distortions
  { id: spawnId('scizor', 'alabaster-icelands'), pokemon_id: 'scizor', location_id: 'alabaster-icelands', area_ar: 'تشويه الفضاء-الزمان', area_en: 'Space-Time Distortion', conditions_ar: 'تشويه الفضاء-الزمان', conditions_en: 'Space-Time Distortion', rarity: 'very_rare', is_alpha: false },
  
  // ============================================
  // SPECIAL / RARE SPAWNS
  // ============================================
  
  // Spiritomb
  { id: spawnId('spiritomb', 'crimson-mirelands'), pokemon_id: 'spiritomb', location_id: 'crimson-mirelands', area_ar: 'الطريق المسكون', area_en: 'Shrouded Ruins', conditions_ar: 'بعد جمع 107 روح', conditions_en: 'After collecting 107 wisps', rarity: 'very_rare', is_alpha: false },
  
  // Unown
  { id: spawnId('unown', 'crimson-mirelands'), pokemon_id: 'unown', location_id: 'crimson-mirelands', area_ar: 'أنقاض سولاسيون', area_en: 'Solaceon Ruins', conditions_ar: 'دائماً', conditions_en: 'Always', rarity: 'uncommon', is_alpha: false },
  
  // Rotom
  { id: spawnId('rotom', 'coronet-highlands'), pokemon_id: 'rotom', location_id: 'coronet-highlands', area_ar: 'أراضي القلعة', area_en: 'Stonetooth Rows', conditions_ar: 'ليلاً', conditions_en: 'At night', rarity: 'rare', is_alpha: false },
  
  // Giratina
  { id: spawnId('giratina-altered', 'cobalt-coastlands'), pokemon_id: 'giratina-altered', location_id: 'cobalt-coastlands', area_ar: 'نبع التحول', area_en: 'Turnback Cave', conditions_ar: 'بعد القصة', conditions_en: 'Post-game', rarity: 'very_rare', is_alpha: false },
  { id: spawnId('giratina-origin', 'cobalt-coastlands'), pokemon_id: 'giratina-origin', location_id: 'cobalt-coastlands', area_ar: 'نبع التحول', area_en: 'Turnback Cave', conditions_ar: 'بعد القصة (مع جريسيوس أورب)', conditions_en: 'Post-game (with Griseous Orb)', rarity: 'very_rare', is_alpha: false },
  
  // Heatran
  { id: spawnId('heatran', 'coronet-highlands'), pokemon_id: 'heatran', location_id: 'coronet-highlands', area_ar: 'أعماق الصهارة', area_en: 'Lava Dome Sanctum', conditions_ar: 'بعد القصة', conditions_en: 'Post-game', rarity: 'very_rare', is_alpha: false },
  
  // Cresselia
  { id: spawnId('cresselia', 'alabaster-icelands'), pokemon_id: 'cresselia', location_id: 'alabaster-icelands', area_ar: 'جزيرة القمر', area_en: 'Moonview Arena', conditions_ar: 'بعد القصة', conditions_en: 'Post-game', rarity: 'very_rare', is_alpha: false },
  
  // Darkrai
  { id: spawnId('darkrai', 'coronet-highlands'), pokemon_id: 'darkrai', location_id: 'coronet-highlands', area_ar: 'غابة الضلال', area_en: 'Clamberclaw Cliffs', conditions_ar: 'حدث خاص', conditions_en: 'Special event', rarity: 'very_rare', is_alpha: false },
  
  // Shaymin
  { id: spawnId('shaymin-land', 'obsidian-fieldlands'), pokemon_id: 'shaymin-land', location_id: 'obsidian-fieldlands', area_ar: 'حقل الأزهار', area_en: 'Floaro Gardens', conditions_ar: 'حدث خاص', conditions_en: 'Special event', rarity: 'very_rare', is_alpha: false },
  
  // Manaphy & Phione
  { id: spawnId('manaphy', 'cobalt-coastlands'), pokemon_id: 'manaphy', location_id: 'cobalt-coastlands', area_ar: 'كهف البحر', area_en: 'Seaside Hollow', conditions_ar: 'مهمة خاصة', conditions_en: 'Special request', rarity: 'very_rare', is_alpha: false },
  { id: spawnId('phione', 'cobalt-coastlands'), pokemon_id: 'phione', location_id: 'cobalt-coastlands', area_ar: 'كهف البحر', area_en: 'Seaside Hollow', conditions_ar: 'مهمة خاصة', conditions_en: 'Special request', rarity: 'very_rare', is_alpha: false },
  
  // Landorus, Thundurus, Tornadus, Enamorus
  { id: spawnId('tornadus', 'alabaster-icelands'), pokemon_id: 'tornadus', location_id: 'alabaster-icelands', area_ar: 'أراضي البرد', area_en: 'Bonechill Wastes', conditions_ar: 'عاصفة ثلجية + بعد القصة', conditions_en: 'Blizzard + Post-game', rarity: 'very_rare', is_alpha: false },
  { id: spawnId('thundurus', 'cobalt-coastlands'), pokemon_id: 'thundurus', location_id: 'cobalt-coastlands', area_ar: 'شاطئ جينكو', area_en: 'Ginkgo Landing', conditions_ar: 'عاصفة رعدية + بعد القصة', conditions_en: 'Thunderstorm + Post-game', rarity: 'very_rare', is_alpha: false },
  { id: spawnId('landorus', 'obsidian-fieldlands'), pokemon_id: 'landorus', location_id: 'obsidian-fieldlands', area_ar: 'حقل الأزهار', area_en: 'Floaro Gardens', conditions_ar: 'بعد القصة', conditions_en: 'Post-game', rarity: 'very_rare', is_alpha: false },
  { id: spawnId('enamorus', 'crimson-mirelands'), pokemon_id: 'enamorus', location_id: 'crimson-mirelands', area_ar: 'أراضي القرمز', area_en: 'Scarlet Bog', conditions_ar: 'بعد إمساك الثلاثة الآخرين', conditions_en: 'After catching the other three', rarity: 'very_rare', is_alpha: false },
];

export default hisuiSpawns;
