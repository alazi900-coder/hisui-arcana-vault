import { describe, it, expect } from "vitest";
import {
  getAnimatedSpriteUrl,
  getShowdownStaticSprite,
  getPokeApiArtwork,
  getPokemonComAsset,
  getThumbUrl,
  getReliableImageSources,
} from "./pokemon-images";

describe("pokemon-images", () => {
  describe("getAnimatedSpriteUrl", () => {
    it("returns an animated Showdown URL for a plain id", () => {
      expect(getAnimatedSpriteUrl("pikachu")).toBe(
        "https://play.pokemonshowdown.com/sprites/ani/pikachu.gif",
      );
    });

    it("maps a Hisuian form id to the *-hisui sprite name", () => {
      expect(getAnimatedSpriteUrl("hisuian-zoroark")).toBe(
        "https://play.pokemonshowdown.com/sprites/ani/zoroark-hisui.gif",
      );
    });
  });

  describe("getShowdownStaticSprite", () => {
    it("uses the gen5 directory", () => {
      expect(getShowdownStaticSprite("rowlet")).toContain("/gen5/rowlet.png");
    });
  });

  describe("getPokeApiArtwork", () => {
    it("returns the official artwork URL for a dex number", () => {
      expect(getPokeApiArtwork(25)).toBe(
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png",
      );
    });
  });

  describe("getPokemonComAsset", () => {
    it("zero-pads the dex number to 3 digits", () => {
      expect(getPokemonComAsset(7)).toContain("/007.png");
      expect(getPokemonComAsset(150)).toContain("/150.png");
    });
  });

  describe("getThumbUrl", () => {
    it("returns the pokeapi sprite path for a dex number", () => {
      expect(getThumbUrl(150)).toBe(
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/150.png",
      );
    });
  });

  describe("getReliableImageSources", () => {
    it("returns sources in priority order (artwork first)", () => {
      const sources = getReliableImageSources("pikachu", 25);
      expect(sources[0]).toContain("official-artwork/25.png");
      expect(sources.length).toBeGreaterThan(1);
    });

    it("uses the mapped Hisuian dex number for Hisuian forms", () => {
      const sources = getReliableImageSources("hisuian-zoroark", 999);
      expect(sources[0]).toContain("official-artwork/571.png");
    });
  });
});
