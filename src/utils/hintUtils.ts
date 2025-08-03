import { ThreatInfo } from "../types/types";

/**
 * Generates hint messages based on threat information
 * @param threatInfo - Information about current threats and display settings
 * @param t - Translation function (from useTranslation hook)
 * @returns Object with title and hints array to display in the Description component
 */
export function generateHints(
  threatInfo: ThreatInfo,
  t: (key: string, options?: any) => string
): { title: string; hints: string[] } {
  try {
    // Validate input
    if (!threatInfo || typeof threatInfo !== "object") {
      console.warn("Invalid threatInfo provided to generateHints");
      return { title: "", hints: [] };
    }

    // Don't show hints if not in kids mode, hints are disabled, or no threats exist
    if (
      !threatInfo.kidsMode ||
      !threatInfo.showHints ||
      !Array.isArray(threatInfo.threatSquares) ||
      threatInfo.threatSquares.length === 0
    ) {
      return { title: "", hints: [] };
    }

    const hints: string[] = [];
    const threatCount = threatInfo.threatSquares.length;
    const title = t("warning_attention");

    if (threatCount === 1) {
      hints.push(t("single_threat_hint"));
    } else if (threatCount > 1) {
      hints.push(t("multiple_threats_hint", { count: threatCount }));
    }

    return { title, hints };
  } catch (error) {
    console.error("Error generating hints:", error);
    return { title: "", hints: [] };
  }
}
