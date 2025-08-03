import { ThreatInfo } from "../types/types";

/**
 * Generates hint messages based on threat information
 * @param threatInfo - Information about current threats and display settings
 * @returns Array of hint strings to display in the Description component
 */
export function generateHints(threatInfo: ThreatInfo): string[] {
  try {
    // Validate input
    if (!threatInfo || typeof threatInfo !== "object") {
      console.warn("Invalid threatInfo provided to generateHints");
      return [];
    }

    // Don't show hints if not in kids mode, hints are disabled, or no threats exist
    if (
      !threatInfo.kidsMode ||
      !threatInfo.showHints ||
      !Array.isArray(threatInfo.threatSquares) ||
      threatInfo.threatSquares.length === 0
    ) {
      return [];
    }

    const hints: string[] = [];
    const threatCount = threatInfo.threatSquares.length;

    if (threatCount === 1) {
      hints.push("⚠️ ОСТОРОЖНО!");
      hints.push(
        "Твоя фигура под атакой! Защити её или убери в безопасное место."
      );
    } else if (threatCount > 1) {
      hints.push("⚠️ ОСТОРОЖНО!");
      hints.push(`${threatCount} твоих фигур под атакой! Будь осторожен!`);
    }

    return hints;
  } catch (error) {
    console.error("Error generating hints:", error);
    return [];
  }
}
