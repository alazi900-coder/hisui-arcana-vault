// PKHeX JSON Parser for Pokémon Legends: Arceus Save Data

import type { PKHeXSaveData, PKHeXPokemon, PKHeXItem, SaveImportResult } from '@/types/save-data';
import type { LivingDexEntry } from '@/types/pokemon';
import { db } from '@/lib/db';

// Species ID to Pokemon ID mapping for PLA
// This maps National Dex numbers to our internal IDs
const speciesIdMap: Record<number, string> = {
  722: 'rowlet', 723: 'dartrix', 724: 'decidueye-hisui',
  155: 'cyndaquil', 156: 'quilava', 157: 'typhlosion-hisui',
  501: 'oshawott', 502: 'dewott', 503: 'samurott-hisui',
  399: 'bidoof', 400: 'bibarel',
  396: 'starly', 397: 'staravia', 398: 'staraptor',
  403: 'shinx', 404: 'luxio', 405: 'luxray',
  265: 'wurmple', 266: 'silcoon', 267: 'beautifly', 268: 'cascoon', 269: 'dustox',
  401: 'kricketot', 402: 'kricketune',
  54: 'psyduck', 55: 'golduck',
  77: 'ponyta', 78: 'rapidash',
  133: 'eevee', 134: 'vaporeon', 135: 'jolteon', 136: 'flareon', 196: 'espeon', 197: 'umbreon', 470: 'leafeon', 471: 'glaceon', 700: 'sylveon',
  41: 'zubat', 42: 'golbat', 169: 'crobat',
  425: 'drifloon', 426: 'drifblim',
  427: 'buneary', 428: 'lopunny',
  92: 'gastly', 93: 'haunter', 94: 'gengar',
  198: 'murkrow', 430: 'honchkrow',
  200: 'misdreavus', 429: 'mismagius',
  415: 'combee', 416: 'vespiquen',
  420: 'cherubi', 421: 'cherrim',
  422: 'shellos', 423: 'gastrodon',
  190: 'aipom', 424: 'ambipom',
  63: 'abra', 64: 'kadabra', 65: 'alakazam',
  129: 'magikarp', 130: 'gyarados',
  408: 'cranidos', 409: 'rampardos',
  410: 'shieldon', 411: 'bastiodon',
  440: 'happiny', 113: 'chansey', 242: 'blissey',
  74: 'geodude', 75: 'graveler', 76: 'golem',
  234: 'stantler', 899: 'wyrdeer',
  446: 'munchlax', 143: 'snorlax',
  439: 'mime-jr', 122: 'mr-mime',
  434: 'stunky', 435: 'skuntank',
  406: 'budew', 315: 'roselia', 407: 'roserade',
  412: 'burmy', 413: 'wormadam', 414: 'mothim',
  455: 'carnivine',
  453: 'croagunk', 454: 'toxicroak',
  37: 'vulpix', 38: 'ninetales',
  58: 'growlithe-hisui', 59: 'arcanine-hisui',
  441: 'chatot',
  193: 'yanma', 469: 'yanmega',
  449: 'hippopotas', 450: 'hippowdon',
  442: 'spiritomb',
  191: 'sunkern', 192: 'sunflora',
  66: 'machop', 67: 'machoke', 68: 'machamp',
  438: 'bonsly', 185: 'sudowoodo',
  81: 'magnemite', 82: 'magneton', 462: 'magnezone',
  207: 'gligar', 472: 'gliscor',
  123: 'scyther', 212: 'scizor', 900: 'kleavor',
  443: 'gible', 444: 'gabite', 445: 'garchomp',
  447: 'riolu', 448: 'lucario',
  175: 'togepi', 176: 'togetic', 468: 'togekiss',
  172: 'pichu', 25: 'pikachu', 26: 'raichu',
  436: 'bronzor', 437: 'bronzong',
  215: 'sneasel-hisui', 461: 'weavile', 903: 'sneasler',
  361: 'snorunt', 362: 'glalie', 478: 'froslass',
  108: 'lickitung', 463: 'lickilicky',
  111: 'rhyhorn', 112: 'rhydon', 464: 'rhyperior',
  137: 'porygon', 233: 'porygon2', 474: 'porygon-z',
  459: 'snover', 460: 'abomasnow',
  220: 'swinub', 221: 'piloswine', 473: 'mamoswine',
  356: 'dusclops', 477: 'dusknoir',
  355: 'duskull',
  125: 'electabuzz', 239: 'elekid', 466: 'electivire',
  126: 'magmar', 240: 'magby', 467: 'magmortar',
  479: 'rotom',
  456: 'finneon', 457: 'lumineon',
  223: 'remoraid', 224: 'octillery',
  363: 'spheal', 364: 'sealeo', 365: 'walrein',
  458: 'mantyke', 226: 'mantine',
  451: 'skorupi', 452: 'drapion',
  100: 'voltorb-hisui', 101: 'electrode-hisui',
  704: 'goomy', 705: 'sliggoo-hisui', 706: 'goodra-hisui',
  546: 'cottonee', 547: 'whimsicott',
  548: 'petilil', 549: 'lilligant-hisui',
  550: 'basculin', 902: 'basculegion',
  211: 'qwilfish-hisui', 904: 'overqwil',
  627: 'rufflet', 628: 'braviary-hisui',
  339: 'barboach', 340: 'whiscash',
  60: 'poliwag', 61: 'poliwhirl', 62: 'poliwrath', 186: 'politoed',
  72: 'tentacool', 73: 'tentacruel',
  712: 'bergmite', 713: 'avalugg-hisui',
  714: 'noibat', 715: 'noivern',
  393: 'piplup', 394: 'prinplup', 395: 'empoleon',
  483: 'dialga', 484: 'palkia', 487: 'giratina',
  493: 'arceus',
  641: 'tornadus', 642: 'thundurus', 645: 'landorus', 905: 'enamorus',
  485: 'heatran', 486: 'regigigas',
  488: 'cresselia', 491: 'darkrai',
  489: 'phione', 490: 'manaphy',
  492: 'shaymin',
  480: 'uxie', 481: 'mesprit', 482: 'azelf',
  209: 'snubbull', 210: 'granbull',
  39: 'jigglypuff', 40: 'wigglytuff', 174: 'igglybuff',
  183: 'marill', 184: 'azumarill',
  201: 'unown',
  228: 'houndour', 229: 'houndoom',
  216: 'teddiursa', 217: 'ursaring', 901: 'ursaluna',
};

// Item ID mapping
const itemIdMap: Record<number, string> = {
  1: 'poke-ball', 2: 'great-ball', 3: 'ultra-ball',
  17: 'potion', 25: 'super-potion', 26: 'hyper-potion', 27: 'max-potion',
  28: 'full-restore', 29: 'revive', 30: 'max-revive',
  35: 'oran-berry', 158: 'sitrus-berry', 153: 'razz-berry', 154: 'nanab-berry', 155: 'pinap-berry',
  80: 'fire-stone', 81: 'thunder-stone', 82: 'water-stone', 83: 'leaf-stone',
  84: 'ice-stone', 85: 'moon-stone', 86: 'sun-stone', 87: 'shiny-stone',
  88: 'dusk-stone', 89: 'dawn-stone',
  1608: 'linking-cord', 1609: 'black-augurite', 1610: 'peat-block',
  303: 'razor-claw', 304: 'razor-fang', 305: 'protector',
  306: 'electirizer', 307: 'magmarizer', 308: 'reaper-cloth',
};

export async function parsePKHeXJson(jsonData: string): Promise<PKHeXSaveData | null> {
  try {
    const data = JSON.parse(jsonData);
    
    // Validate basic structure
    if (!data.PartyData && !data.BoxData) {
      throw new Error('Invalid PKHeX export format');
    }
    
    return {
      Version: data.Version || 'Unknown',
      PartyData: data.PartyData || [],
      BoxData: data.BoxData || [],
      Items: {
        Regular: data.Items?.Regular || [],
        KeyItems: data.Items?.KeyItems || [],
        Medicine: data.Items?.Medicine || [],
        Berries: data.Items?.Berries || [],
        Balls: data.Items?.Balls || [],
        Crafting: data.Items?.Crafting || [],
      },
    };
  } catch (error) {
    console.error('Error parsing PKHeX JSON:', error);
    return null;
  }
}

export async function importPokemonToLivingDex(
  saveData: PKHeXSaveData
): Promise<SaveImportResult> {
  const result: SaveImportResult = {
    pokemonImported: 0,
    newPokemon: 0,
    alphaFound: 0,
    shinyFound: 0,
    itemsImported: 0,
    errors: [],
  };
  
  // Combine party and box data
  const allPokemon = [...saveData.PartyData, ...saveData.BoxData];
  
  for (const poke of allPokemon) {
    try {
      const pokemonId = speciesIdMap[poke.Species];
      
      if (!pokemonId) {
        // Skip unknown species
        continue;
      }
      
      // Check if Pokémon exists in our database
      const existsInDb = await db.pokemon.get(pokemonId);
      if (!existsInDb) {
        result.errors.push(`Unknown Pokémon: Species ${poke.Species}`);
        continue;
      }
      
      // Check existing entry
      const existingEntry = await db.livingDex.get(pokemonId);
      
      const newEntry: LivingDexEntry = {
        pokemon_id: pokemonId,
        caught: true,
        alpha: existingEntry?.alpha || poke.IsAlpha,
        shiny: existingEntry?.shiny || poke.IsShiny,
        notes: existingEntry?.notes || '',
        updated_at: Date.now(),
      };
      
      // Track stats
      if (!existingEntry?.caught) {
        result.newPokemon++;
      }
      if (poke.IsAlpha) result.alphaFound++;
      if (poke.IsShiny) result.shinyFound++;
      
      await db.livingDex.put(newEntry);
      result.pokemonImported++;
    } catch (error) {
      result.errors.push(`Error importing Pokémon: ${error}`);
    }
  }
  
  return result;
}

export async function importItemsToInventory(
  saveData: PKHeXSaveData
): Promise<number> {
  let imported = 0;
  
  // Flatten all item categories
  const allItems = [
    ...saveData.Items.Regular,
    ...saveData.Items.KeyItems,
    ...saveData.Items.Medicine,
    ...saveData.Items.Berries,
    ...saveData.Items.Balls,
    ...saveData.Items.Crafting,
  ];
  
  for (const item of allItems) {
    const itemId = itemIdMap[item.ItemId];
    
    if (!itemId) continue;
    
    // Check if item exists in our database
    const existsInDb = await db.items.get(itemId);
    if (!existsInDb) continue;
    
    await db.inventory.put({
      item_id: itemId,
      quantity: item.Count,
      updated_at: Date.now(),
    });
    
    imported++;
  }
  
  return imported;
}

export async function fullSaveImport(jsonData: string): Promise<SaveImportResult> {
  const saveData = await parsePKHeXJson(jsonData);
  
  if (!saveData) {
    return {
      pokemonImported: 0,
      newPokemon: 0,
      alphaFound: 0,
      shinyFound: 0,
      itemsImported: 0,
      errors: ['Failed to parse save file'],
    };
  }
  
  const pokemonResult = await importPokemonToLivingDex(saveData);
  const itemsImported = await importItemsToInventory(saveData);
  
  return {
    ...pokemonResult,
    itemsImported,
  };
}
