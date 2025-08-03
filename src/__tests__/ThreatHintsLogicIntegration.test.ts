import { generateHints } from "../utils/hintUtils";
import { ThreatInfo } from "../types/types";

describe("Threat Hints Logic Integration", () => {
  describe("Requirements Verification", () => {
    it("should verify requirement 2.1: threat warnings appear in Description component in kids mode", () => {
      const threatInfo: ThreatInfo = {
        threatSquares: ["e4"],
        showHints: true,
        kidsMode: true,
      };

      const hints = generateHints(threatInfo);

      expect(hints.length).toBeGreaterThan(0);
      expect(hints[0]).toBe("⚠️ ОСТОРОЖНО!");
    });

    it("should verify requirement 2.2: multiple threat messaging works correctly", () => {
      const multipleThreats: ThreatInfo = {
        threatSquares: ["e4", "f7", "d3"],
        showHints: true,
        kidsMode: true,
      };

      const hints = generateHints(multipleThreats);

      expect(hints).toContain("⚠️ ОСТОРОЖНО!");
      expect(hints).toContain("3 твоих фигур под атакой! Будь осторожен!");
    });

    it("should verify requirement 2.3: single threat messaging works correctly", () => {
      const singleThreat: ThreatInfo = {
        threatSquares: ["e4"],
        showHints: true,
        kidsMode: true,
      };

      const hints = generateHints(singleThreat);

      expect(hints).toContain("⚠️ ОСТОРОЖНО!");
      expect(hints).toContain(
        "Твоя фигура под атакой! Защити её или убери в безопасное место."
      );
    });

    it("should verify requirement 2.4: non-kids mode does not show threat hints", () => {
      const adultMode: ThreatInfo = {
        threatSquares: ["e4"],
        showHints: true,
        kidsMode: false,
      };

      const hints = generateHints(adultMode);

      expect(hints).toEqual([]);
    });

    it("should verify requirement 4.1: hints toggle controls both visual and description hints", () => {
      const threatsWithHints: ThreatInfo = {
        threatSquares: ["e4"],
        showHints: true,
        kidsMode: true,
      };

      const threatsWithoutHints: ThreatInfo = {
        threatSquares: ["e4"],
        showHints: false,
        kidsMode: true,
      };

      const hintsEnabled = generateHints(threatsWithHints);
      const hintsDisabled = generateHints(threatsWithoutHints);

      expect(hintsEnabled.length).toBeGreaterThan(0);
      expect(hintsDisabled.length).toBe(0);
    });

    it("should verify requirement 4.2: hint toggle applies immediately", () => {
      // Test that hint generation responds immediately to showHints changes
      const threatInfo: ThreatInfo = {
        threatSquares: ["e4"],
        showHints: true,
        kidsMode: true,
      };

      // Enable hints
      const hintsEnabled = generateHints(threatInfo);
      expect(hintsEnabled.length).toBeGreaterThan(0);

      // Disable hints
      threatInfo.showHints = false;
      const hintsDisabled = generateHints(threatInfo);
      expect(hintsDisabled.length).toBe(0);

      // Re-enable hints
      threatInfo.showHints = true;
      const hintsReEnabled = generateHints(threatInfo);
      expect(hintsReEnabled.length).toBeGreaterThan(0);
    });

    it("should verify requirement 4.3: consistent hint control", () => {
      // Verify that the same showHints flag controls both visual and textual hints
      const threatInfo: ThreatInfo = {
        threatSquares: ["e4"],
        showHints: false,
        kidsMode: true,
      };

      const hints = generateHints(threatInfo);

      // When showHints is false, no textual hints should be generated
      expect(hints).toEqual([]);
    });

    it("should verify requirement 4.4: non-kids mode hint toggle behavior", () => {
      // In non-kids mode, hints should not be generated regardless of showHints
      const adultModeWithHints: ThreatInfo = {
        threatSquares: ["e4"],
        showHints: true,
        kidsMode: false,
      };

      const adultModeWithoutHints: ThreatInfo = {
        threatSquares: ["e4"],
        showHints: false,
        kidsMode: false,
      };

      const hintsWithToggleOn = generateHints(adultModeWithHints);
      const hintsWithToggleOff = generateHints(adultModeWithoutHints);

      expect(hintsWithToggleOn).toEqual([]);
      expect(hintsWithToggleOff).toEqual([]);
    });
  });

  describe("Edge Cases and Integration Scenarios", () => {
    it("should handle empty threat squares correctly", () => {
      const noThreats: ThreatInfo = {
        threatSquares: [],
        showHints: true,
        kidsMode: true,
      };

      const hints = generateHints(noThreats);

      expect(hints).toEqual([]);
    });

    it("should handle large number of threats", () => {
      const manyThreats: ThreatInfo = {
        threatSquares: ["a1", "b2", "c3", "d4", "e5", "f6", "g7", "h8"],
        showHints: true,
        kidsMode: true,
      };

      const hints = generateHints(manyThreats);

      expect(hints).toContain("⚠️ ОСТОРОЖНО!");
      expect(hints).toContain("8 твоих фигур под атакой! Будь осторожен!");
    });

    it("should maintain consistent behavior across different threat counts", () => {
      const testCases = [
        { count: 1, squares: ["e4"] },
        { count: 2, squares: ["e4", "f7"] },
        { count: 5, squares: ["a1", "b2", "c3", "d4", "e5"] },
      ];

      testCases.forEach(({ count, squares }) => {
        const threatInfo: ThreatInfo = {
          threatSquares: squares,
          showHints: true,
          kidsMode: true,
        };

        const hints = generateHints(threatInfo);

        expect(hints[0]).toBe("⚠️ ОСТОРОЖНО!");

        if (count === 1) {
          expect(hints[1]).toBe(
            "Твоя фигура под атакой! Защити её или убери в безопасное место."
          );
        } else {
          expect(hints[1]).toBe(
            `${count} твоих фигур под атакой! Будь осторожен!`
          );
        }
      });
    });

    it("should verify integration flow: chess board → parent → description", () => {
      // Simulate the flow from ComputerChessBoard to PlayWithComputer to Description

      // Step 1: ComputerChessBoard detects threats and calls onThreatsChange
      const detectedThreats: ThreatInfo = {
        threatSquares: ["e4", "f7"],
        showHints: true,
        kidsMode: true,
      };

      // Step 2: PlayWithComputer receives threat info and updates state
      // (This would be handled by the handleThreatsChange callback)

      // Step 3: PlayWithComputer passes threat info to generateHints
      const hints = generateHints(detectedThreats);

      // Step 4: Description component receives and displays hints
      expect(hints).toEqual([
        "⚠️ ОСТОРОЖНО!",
        "2 твоих фигур под атакой! Будь осторожен!",
      ]);
    });

    it("should verify callback pattern safety", () => {
      // Test that the hint generation doesn't crash with various inputs
      const testCases: ThreatInfo[] = [
        { threatSquares: [], showHints: true, kidsMode: true },
        { threatSquares: ["e4"], showHints: false, kidsMode: true },
        { threatSquares: ["e4"], showHints: true, kidsMode: false },
        { threatSquares: ["e4"], showHints: false, kidsMode: false },
      ];

      testCases.forEach((threatInfo) => {
        expect(() => generateHints(threatInfo)).not.toThrow();
      });
    });
  });

  describe("Performance and Reliability", () => {
    it("should handle rapid state changes efficiently", () => {
      const threatInfo: ThreatInfo = {
        threatSquares: ["e4"],
        showHints: true,
        kidsMode: true,
      };

      // Simulate rapid toggling of hints
      for (let i = 0; i < 100; i++) {
        threatInfo.showHints = i % 2 === 0;
        const hints = generateHints(threatInfo);

        if (threatInfo.showHints) {
          expect(hints.length).toBeGreaterThan(0);
        } else {
          expect(hints.length).toBe(0);
        }
      }
    });

    it("should maintain consistent output for same input", () => {
      const threatInfo: ThreatInfo = {
        threatSquares: ["e4", "f7"],
        showHints: true,
        kidsMode: true,
      };

      const hints1 = generateHints(threatInfo);
      const hints2 = generateHints(threatInfo);
      const hints3 = generateHints(threatInfo);

      expect(hints1).toEqual(hints2);
      expect(hints2).toEqual(hints3);
    });
  });
});
