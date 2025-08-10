import { MazeEngine } from "../MazeEngine";
import { MazePuzzle } from "../../types/types";

describe("MazeEngine", () => {
  const simpleMazePuzzle: MazePuzzle = {
    id: "test-1",
    titleKey: "test_title",
    descriptionKey: "test_desc",
    initialPosition: "E7/8/8/8/8/8/8/R7 w - - 0 1",
    hintKey: "test_hint",
  };

  const checkpointMazePuzzle: MazePuzzle = {
    id: "test-2",
    titleKey: "test_title_2",
    descriptionKey: "test_desc_2",
    initialPosition: "E6C/8/8/8/8/8/8/R7 w - - 0 1",
    hintKey: "test_hint_2",
  };

  describe("initialization", () => {
    it("should initialize correctly with valid puzzle", () => {
      const engine = new MazeEngine(simpleMazePuzzle);
      expect(engine.isGameComplete()).toBe(false);
      expect(engine.isGameFailed()).toBe(false);
    });

    it("should throw error with invalid puzzle configuration", () => {
      const invalidPuzzle: MazePuzzle = {
        id: "invalid",
        titleKey: "invalid",
        descriptionKey: "invalid",
        initialPosition: "invalid position",
        hintKey: "invalid",
      };

      expect(() => new MazeEngine(invalidPuzzle)).toThrow();
    });
  });

  describe("maze elements detection", () => {
    it("should correctly identify walls", () => {
      const wallPuzzle: MazePuzzle = {
        id: "wall-test",
        titleKey: "wall_test",
        descriptionKey: "wall_test",
        initialPosition: "E7/W7/8/8/8/8/8/R7 w - - 0 1",
        hintKey: "wall_test",
      };

      const engine = new MazeEngine(wallPuzzle);
      expect(engine.isWall("a7")).toBe(true);
      expect(engine.isWall("a8")).toBe(false);
    });

    it("should correctly identify exits", () => {
      const engine = new MazeEngine(simpleMazePuzzle);
      expect(engine.isExit("a8")).toBe(true);
      expect(engine.isExit("a7")).toBe(false);
    });

    it("should correctly identify checkpoints", () => {
      const engine = new MazeEngine(checkpointMazePuzzle);
      expect(engine.isCheckpoint("h8")).toBe(true);
      expect(engine.isCheckpoint("a8")).toBe(false);
    });
  });

  describe("exit activation", () => {
    it("should have active exits when no checkpoints exist", () => {
      const engine = new MazeEngine(simpleMazePuzzle);
      expect(engine.areExitsActive()).toBe(true);
    });

    it("should have inactive exits when checkpoints exist", () => {
      const engine = new MazeEngine(checkpointMazePuzzle);
      expect(engine.areExitsActive()).toBe(false);
    });
  });

  describe("piece movement", () => {
    it("should allow valid rook moves", () => {
      const engine = new MazeEngine(simpleMazePuzzle);
      expect(engine.isValidMove("a1", "a2")).toBe(true);
      expect(engine.isValidMove("a1", "b1")).toBe(true);
    });

    it("should prevent moves to walls", () => {
      const wallPuzzle: MazePuzzle = {
        id: "wall-test",
        titleKey: "wall_test",
        descriptionKey: "wall_test",
        initialPosition: "E7/W7/8/8/8/8/8/R7 w - - 0 1",
        hintKey: "wall_test",
      };

      const engine = new MazeEngine(wallPuzzle);
      expect(engine.isValidMove("a1", "a7")).toBe(false);
    });

    it("should prevent invalid piece moves", () => {
      const engine = new MazeEngine(simpleMazePuzzle);
      // Rook cannot move diagonally
      expect(engine.isValidMove("a1", "b2")).toBe(false);
    });
  });

  describe("game completion", () => {
    it("should complete game when reaching active exit", () => {
      const engine = new MazeEngine(simpleMazePuzzle);
      const result = engine.makeMove("a1", "a8");

      expect(result.success).toBe(true);
      expect(result.gameComplete).toBe(true);
      expect(engine.isGameComplete()).toBe(true);
    });

    it("should not complete game when reaching inactive exit", () => {
      const engine = new MazeEngine(checkpointMazePuzzle);
      const result = engine.makeMove("a1", "a8");

      expect(result.success).toBe(true);
      expect(result.gameComplete).toBeFalsy();
    });
  });

  describe("checkpoint mechanics", () => {
    it("should visit checkpoints and activate exits", () => {
      const engine = new MazeEngine(checkpointMazePuzzle);

      // Move to checkpoint (rook can move from a1 to h1, then h1 to h8)
      engine.makeMove("a1", "h1");
      const checkpointResult = engine.makeMove("h1", "h8");
      expect(checkpointResult.success).toBe(true);
      expect(checkpointResult.checkpointVisited).toBe(true);
      expect(engine.getRemainingCheckpoints()).toBe(0);
      expect(engine.areExitsActive()).toBe(true);

      // Now can reach exit
      const exitResult = engine.makeMove("h8", "a8");
      expect(exitResult.success).toBe(true);
      expect(exitResult.gameComplete).toBe(true);
    });
  });

  describe("move limits", () => {
    it("should handle move limits correctly", () => {
      const limitedPuzzle: MazePuzzle = {
        ...simpleMazePuzzle,
        maxMoves: 2,
      };

      const engine = new MazeEngine(limitedPuzzle);

      // First move
      engine.makeMove("a1", "a2");
      expect(engine.getRemainingMoves()).toBe(1);

      // Second move
      const result = engine.makeMove("a2", "a3");
      expect(engine.getRemainingMoves()).toBe(0);

      // Should fail if trying to make another move without winning
      expect(result.gameFailed).toBe(true);
    });
  });
});
