import { PuzzleCategory } from "../types/types";
import Compass from "src/assets/images/compass.png";
import Darts from "src/assets/images/darts.png";
import Fire from "src/assets/images/fire.png";

export const CHESS_PUZZLES: PuzzleCategory[] = [
  {
    id: "mate-in-one",
    title: "Mate in 1 move",
    image: Compass,
    description: "Find the move that leads to checkmate",
    puzzles: [
      {
        id: "1",
        title: "Mate in 1 move - Puzzle 1",
        description: "White to move and checkmate in 1",
        initialPosition: "6k1/5ppp/8/8/8/8/4PPPP/R3RK2 w - - 0 1",
        correctMoves: [{ from: "a1", to: "a8", piece: "R" }],
        hint: "Rook can checkmate on an open file",
        playerColor: "w",
      },
      {
        id: "2",
        title: "Mate in 1 move - Puzzle 2",
        description: "White to move and checkmate in 1",
        initialPosition: "6rk/6p1/8/8/8/8/6K1/2Q5 w - - 0 1",
        correctMoves: [{ from: "c1", to: "h1", piece: "Q" }],
        hint: "Queen can checkmate on the first rank",
        playerColor: "w",
      },
    ],
  },
  {
    id: "mate-in-two",
    title: "Mate in 2 moves",
    image: Fire,
    description: "Find the combination of two moves leading to checkmate",
    puzzles: [
      {
        id: "1",
        title: "Mate in 2 moves - Puzzle 1",
        description: "White to move and checkmate in 2",
        initialPosition: "7k/2p1Bp1p/8/8/6q1/7b/5PP1/4R1K1 w - - 0 1",
        correctMoves: [
          { from: "e7", to: "f6", piece: "B" },
          { from: "h8", to: "g8", piece: "k", isComputerMove: true },
          { from: "e1", to: "e8", piece: "R" },
        ],
        hint: "Bishop must control a key square, forcing the king to move",
        playerColor: "w",
      },
    ],
  },
  {
    id: "basic-tactics",
    title: "Basic Tactics",
    image: Darts,
    description: "Learn basic tactical patterns",
    puzzles: [
      {
        id: "1",
        title: "Knight Fork",
        description: "Use the knight to attack two pieces at once",
        initialPosition: "7k/5r2/4b3/8/3N4/8/8/4K3 w - - 0 1",
        correctMoves: [
          { from: "d4", to: "e6", piece: "N" },
          { from: "h8", to: "h7", piece: "k", isComputerMove: true },
          { from: "e6", to: "g5", piece: "N" },
        ],
        hint: "Find a knight position that attacks two enemy pieces",
        playerColor: "w",
      },
    ],
  },
];
