import { generateHints } from "../hintUtils";
import { ThreatInfo } from "../../types/types";

// Mock translation function for tests
const mockT = (key: string, options?: any): string => {
  const translations: Record<string, string> = {
    warning_attention: "⚠️ ATTENTION!",
    single_threat_hint:
      "Your piece is under attack! Defend it or move it to safety.",
    multiple_threats_hint: `${
      options?.count || 0
    } of your pieces are under attack! Be careful!`,
  };
  return translations[key] || key;
};

describe("generateHints", () => {
  describe("when conditions are not met for showing hints", () => {
    test("should return empty array when not in kids mode", () => {
      const threatInfo: ThreatInfo = {
        threatSquares: ["e4", "f5"],
        showHints: true,
        kidsMode: false,
      };

      const result = generateHints(threatInfo, mockT);

      expect(result).toEqual({ title: "", hints: [] });
    });

    test("should return empty array when showHints is false", () => {
      const threatInfo: ThreatInfo = {
        threatSquares: ["e4", "f5"],
        showHints: false,
        kidsMode: true,
      };

      const result = generateHints(threatInfo, mockT);

      expect(result).toEqual({ title: "", hints: [] });
    });

    test("should return empty array when no threats exist", () => {
      const threatInfo: ThreatInfo = {
        threatSquares: [],
        showHints: true,
        kidsMode: true,
      };

      const result = generateHints(threatInfo, mockT);

      expect(result).toEqual({ title: "", hints: [] });
    });

    test("should return empty array when all conditions are false", () => {
      const threatInfo: ThreatInfo = {
        threatSquares: [],
        showHints: false,
        kidsMode: false,
      };

      const result = generateHints(threatInfo, mockT);

      expect(result).toEqual({ title: "", hints: [] });
    });
  });

  describe("when conditions are met for showing hints", () => {
    test("should return single threat message when one piece is threatened", () => {
      const threatInfo: ThreatInfo = {
        threatSquares: ["e4"],
        showHints: true,
        kidsMode: true,
      };

      const result = generateHints(threatInfo, mockT);

      expect(result).toEqual({
        title: "⚠️ ATTENTION!",
        hints: ["Your piece is under attack! Defend it or move it to safety."],
      });
    });

    test("should return multiple threat message when multiple pieces are threatened", () => {
      const threatInfo: ThreatInfo = {
        threatSquares: ["e4", "f5"],
        showHints: true,
        kidsMode: true,
      };

      const result = generateHints(threatInfo, mockT);

      expect(result).toEqual({
        title: "⚠️ ATTENTION!",
        hints: ["2 of your pieces are under attack! Be careful!"],
      });
    });

    test("should return correct message for three threatened pieces", () => {
      const threatInfo: ThreatInfo = {
        threatSquares: ["e4", "f5", "g6"],
        showHints: true,
        kidsMode: true,
      };

      const result = generateHints(threatInfo, mockT);

      expect(result).toEqual({
        title: "⚠️ ATTENTION!",
        hints: ["3 of your pieces are under attack! Be careful!"],
      });
    });

    test("should return correct message for many threatened pieces", () => {
      const threatInfo: ThreatInfo = {
        threatSquares: ["e4", "f5", "g6", "h7", "a1", "b2", "c3"],
        showHints: true,
        kidsMode: true,
      };

      const result = generateHints(threatInfo, mockT);

      expect(result).toEqual({
        title: "⚠️ ATTENTION!",
        hints: ["7 of your pieces are under attack! Be careful!"],
      });
    });
  });

  describe("edge cases", () => {
    test("should handle empty threatSquares array correctly", () => {
      const threatInfo: ThreatInfo = {
        threatSquares: [],
        showHints: true,
        kidsMode: true,
      };

      const result = generateHints(threatInfo, mockT);

      expect(result).toEqual({ title: "", hints: [] });
    });

    test("should handle single threat with all conditions true", () => {
      const threatInfo: ThreatInfo = {
        threatSquares: ["a8"],
        showHints: true,
        kidsMode: true,
      };

      const result = generateHints(threatInfo, mockT);

      expect(result.title).toBe("⚠️ ATTENTION!");
      expect(result.hints).toEqual([
        "Your piece is under attack! Defend it or move it to safety.",
      ]);
    });

    test("should handle multiple threats with all conditions true", () => {
      const threatInfo: ThreatInfo = {
        threatSquares: ["a1", "h8"],
        showHints: true,
        kidsMode: true,
      };

      const result = generateHints(threatInfo, mockT);

      expect(result.title).toBe("⚠️ ATTENTION!");
      expect(result.hints).toEqual([
        "2 of your pieces are under attack! Be careful!",
      ]);
    });
  });
});
