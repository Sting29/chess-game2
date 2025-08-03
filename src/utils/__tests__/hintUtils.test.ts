import { generateHints } from "../hintUtils";
import { ThreatInfo } from "../../types/types";

describe("generateHints", () => {
  describe("when conditions are not met for showing hints", () => {
    test("should return empty array when not in kids mode", () => {
      const threatInfo: ThreatInfo = {
        threatSquares: ["e4", "f5"],
        showHints: true,
        kidsMode: false,
      };

      const result = generateHints(threatInfo);

      expect(result).toEqual([]);
    });

    test("should return empty array when showHints is false", () => {
      const threatInfo: ThreatInfo = {
        threatSquares: ["e4", "f5"],
        showHints: false,
        kidsMode: true,
      };

      const result = generateHints(threatInfo);

      expect(result).toEqual([]);
    });

    test("should return empty array when no threats exist", () => {
      const threatInfo: ThreatInfo = {
        threatSquares: [],
        showHints: true,
        kidsMode: true,
      };

      const result = generateHints(threatInfo);

      expect(result).toEqual([]);
    });

    test("should return empty array when all conditions are false", () => {
      const threatInfo: ThreatInfo = {
        threatSquares: [],
        showHints: false,
        kidsMode: false,
      };

      const result = generateHints(threatInfo);

      expect(result).toEqual([]);
    });
  });

  describe("when conditions are met for showing hints", () => {
    test("should return single threat message when one piece is threatened", () => {
      const threatInfo: ThreatInfo = {
        threatSquares: ["e4"],
        showHints: true,
        kidsMode: true,
      };

      const result = generateHints(threatInfo);

      expect(result).toEqual([
        "⚠️ ОСТОРОЖНО!",
        "Твоя фигура под атакой! Защити её или убери в безопасное место.",
      ]);
    });

    test("should return multiple threat message when multiple pieces are threatened", () => {
      const threatInfo: ThreatInfo = {
        threatSquares: ["e4", "f5"],
        showHints: true,
        kidsMode: true,
      };

      const result = generateHints(threatInfo);

      expect(result).toEqual([
        "⚠️ ОСТОРОЖНО!",
        "2 твоих фигур под атакой! Будь осторожен!",
      ]);
    });

    test("should return correct message for three threatened pieces", () => {
      const threatInfo: ThreatInfo = {
        threatSquares: ["e4", "f5", "g6"],
        showHints: true,
        kidsMode: true,
      };

      const result = generateHints(threatInfo);

      expect(result).toEqual([
        "⚠️ ОСТОРОЖНО!",
        "3 твоих фигур под атакой! Будь осторожен!",
      ]);
    });

    test("should return correct message for many threatened pieces", () => {
      const threatInfo: ThreatInfo = {
        threatSquares: ["e4", "f5", "g6", "h7", "a1", "b2", "c3"],
        showHints: true,
        kidsMode: true,
      };

      const result = generateHints(threatInfo);

      expect(result).toEqual([
        "⚠️ ОСТОРОЖНО!",
        "7 твоих фигур под атакой! Будь осторожен!",
      ]);
    });
  });

  describe("edge cases", () => {
    test("should handle empty threatSquares array correctly", () => {
      const threatInfo: ThreatInfo = {
        threatSquares: [],
        showHints: true,
        kidsMode: true,
      };

      const result = generateHints(threatInfo);

      expect(result).toEqual([]);
    });

    test("should handle single threat with all conditions true", () => {
      const threatInfo: ThreatInfo = {
        threatSquares: ["a8"],
        showHints: true,
        kidsMode: true,
      };

      const result = generateHints(threatInfo);

      expect(result).toHaveLength(2);
      expect(result[0]).toBe("⚠️ ОСТОРОЖНО!");
      expect(result[1]).toBe(
        "Твоя фигура под атакой! Защити её или убери в безопасное место."
      );
    });

    test("should handle multiple threats with all conditions true", () => {
      const threatInfo: ThreatInfo = {
        threatSquares: ["a1", "h8"],
        showHints: true,
        kidsMode: true,
      };

      const result = generateHints(threatInfo);

      expect(result).toHaveLength(2);
      expect(result[0]).toBe("⚠️ ОСТОРОЖНО!");
      expect(result[1]).toBe("2 твоих фигур под атакой! Будь осторожен!");
    });
  });
});
