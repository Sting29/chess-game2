/**
 * Тесты для системы мета-данных
 */

import { metadataUtils, ROUTE_METADATA } from "../metadata";
import { ROUTES } from "../constants";

describe("Metadata Utils", () => {
  describe("getMetadata", () => {
    it("should return metadata for exact route match", () => {
      const metadata = metadataUtils.getMetadata(ROUTES.ROOT);
      expect(metadata).toBeDefined();
      expect(metadata?.title).toBe("Chess Learning App");
    });

    it("should return metadata for dynamic routes", () => {
      const metadata = metadataUtils.getMetadata("/puzzles/tactics");
      expect(metadata).toBeDefined();
      expect(metadata?.title).toBe("Chess Puzzles - {categoryId}");
    });

    it("should return null for unknown routes", () => {
      const metadata = metadataUtils.getMetadata("/unknown-route");
      expect(metadata).toBeNull();
    });
  });

  describe("createDynamicTitle", () => {
    it("should replace parameters in title", () => {
      const title = "Chess Puzzle: {puzzleId} in {categoryId}";
      const params = { puzzleId: "puzzle1", categoryId: "tactics" };

      const result = metadataUtils.createDynamicTitle(title, params);
      expect(result).toBe("Chess Puzzle: puzzle1 in tactics");
    });

    it("should handle missing parameters", () => {
      const title = "Chess Puzzle: {puzzleId}";
      const params = {};

      const result = metadataUtils.createDynamicTitle(title, params);
      expect(result).toBe("Chess Puzzle: {puzzleId}");
    });

    it("should replace pieceId parameters (simplified version)", () => {
      const title = "How {pieceId} Moves";
      const params = { pieceId: "pawn-move" };

      const result = metadataUtils.createDynamicTitle(title, params);
      expect(result).toBe("How pawn-move Moves");
    });
  });

  describe("createFullTitle", () => {
    it("should append app name to title", () => {
      const result = metadataUtils.createFullTitle("Test Page");
      expect(result).toBe("Test Page | Chess Learning App");
    });

    it("should not duplicate app name", () => {
      const result = metadataUtils.createFullTitle("Chess Learning App - Test");
      expect(result).toBe("Chess Learning App - Test");
    });
  });

  describe("getMetaTags", () => {
    it("should return basic meta tags for a route", () => {
      const tags = metadataUtils.getMetaTags(ROUTES.ROOT);

      expect(tags.title).toContain("Chess Learning App");
      expect(tags.description).toBeDefined();
      // Only basic fields in simplified version
      expect(tags.keywords).toBeUndefined();
      expect(tags["og:title"]).toBeUndefined();
    });

    it("should return default tags for unknown routes", () => {
      const tags = metadataUtils.getMetaTags("/unknown");

      expect(tags.title).toBe("Chess Learning App");
      expect(tags.description).toBe(
        "Learn chess online with interactive tutorials and games"
      );
    });

    it("should handle dynamic parameters", () => {
      const tags = metadataUtils.getMetaTags("/puzzles/tactics", {
        categoryId: "tactics",
      });

      expect(tags.title).toContain("tactics");
    });

    it("should replace pieceId parameter in title and description (simplified version)", () => {
      const tags = metadataUtils.getMetaTags("/how-to-move/pawn-move", {
        pieceId: "pawn-move",
      });

      expect(tags.title).toBe("How pawn-move Moves | Chess Learning App");
      expect(tags.description).toContain("Learn how pawn-move moves");
    });
  });
});

describe("Route Metadata Coverage", () => {
  it("should have metadata for all main routes", () => {
    const requiredRoutes = [
      ROUTES.ROOT,
      ROUTES.HOW_TO_MOVE,
      ROUTES.HOW_TO_PLAY,
      ROUTES.PUZZLES,
      ROUTES.PLAY,
      ROUTES.ACCOUNT,
      ROUTES.SETTINGS,
    ];

    requiredRoutes.forEach((route) => {
      expect(ROUTE_METADATA[route]).toBeDefined();
      expect(ROUTE_METADATA[route].title).toBeTruthy();
    });
  });

  it("should have basic fields for all routes", () => {
    const testRoutes = [ROUTES.ROOT, ROUTES.ACCOUNT, ROUTES.SETTINGS];

    testRoutes.forEach((route) => {
      const metadata = ROUTE_METADATA[route];
      expect(metadata.title).toBeTruthy();
      expect(metadata.requiresAuth).toBeDefined();
      // description is optional
      if (metadata.description) {
        expect(metadata.description).toBeTruthy();
      }
    });
  });
});
