/**
 * Тесты для системы переводов фигур
 */

import { metadataUtils } from "../metadata";
import i18n from "src/i18n";

describe("Piece Translation System", () => {
  beforeEach(async () => {
    // Инициализируем i18n с английским языком
    await i18n.changeLanguage("en");
  });

  describe("English translations", () => {
    it("should translate pawn-move to Pawn", async () => {
      await i18n.changeLanguage("en");

      const result = metadataUtils.createDynamicTitle("How {pieceId} Moves", {
        pieceId: "pawn-move",
      });

      expect(result).toBe("How Pawn Moves");
    });

    it("should translate king-move to King", async () => {
      await i18n.changeLanguage("en");

      const result = metadataUtils.createDynamicTitle("How {pieceId} Moves", {
        pieceId: "king-move",
      });

      expect(result).toBe("How King Moves");
    });

    it("should translate queen-move to Queen", async () => {
      await i18n.changeLanguage("en");

      const result = metadataUtils.createDynamicTitle("How {pieceId} Moves", {
        pieceId: "queen-move",
      });

      expect(result).toBe("How Queen Moves");
    });
  });

  describe("Russian translations", () => {
    it("should translate pawn-move to Пешка in Russian", async () => {
      await i18n.changeLanguage("ru");

      const result = metadataUtils.createDynamicTitle("How {pieceId} Moves", {
        pieceId: "pawn-move",
      });

      expect(result).toBe("How Пешка Moves");
    });
  });

  describe("Fallback behavior", () => {
    it("should return original pieceId if not found in data", () => {
      const result = metadataUtils.createDynamicTitle("How {pieceId} Moves", {
        pieceId: "unknown-piece",
      });

      expect(result).toBe("How unknown-piece Moves");
    });
  });

  describe("Full metadata integration", () => {
    it("should work in full metadata pipeline", async () => {
      await i18n.changeLanguage("en");

      const tags = metadataUtils.getMetaTags("/how-to-move/rook-move", {
        pieceId: "rook-move",
      });

      expect(tags.title).toContain("Rook");
      expect(tags.description).toContain("Rook");
    });
  });
});
