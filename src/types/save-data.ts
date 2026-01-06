// Save File Data Types for PKHeX JSON Export

export interface PKHeXPokemon {
  Species: number;
  Nickname: string;
  Level: number;
  IsAlpha: boolean;
  IsShiny: boolean;
  Nature: number;
  Ability: number;
  HeldItem: number;
  Move1: number;
  Move2: number;
  Move3: number;
  Move4: number;
  IV_HP: number;
  IV_ATK: number;
  IV_DEF: number;
  IV_SPA: number;
  IV_SPD: number;
  IV_SPE: number;
  EV_HP: number;
  EV_ATK: number;
  EV_DEF: number;
  EV_SPA: number;
  EV_SPD: number;
  EV_SPE: number;
  Gender: number;
  OT_Name: string;
  TID: number;
  SID: number;
}

export interface PKHeXItem {
  ItemId: number;
  Count: number;
}

export interface PKHeXSaveData {
  Version: string;
  PartyData: PKHeXPokemon[];
  BoxData: PKHeXPokemon[];
  Items: {
    Regular: PKHeXItem[];
    KeyItems: PKHeXItem[];
    Medicine: PKHeXItem[];
    Berries: PKHeXItem[];
    Balls: PKHeXItem[];
    Crafting: PKHeXItem[];
  };
}

export interface InventoryEntry {
  item_id: string;
  quantity: number;
  updated_at: number;
}

export interface SaveImportResult {
  pokemonImported: number;
  newPokemon: number;
  alphaFound: number;
  shinyFound: number;
  itemsImported: number;
  errors: string[];
}
