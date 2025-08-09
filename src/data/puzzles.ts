import { PuzzleCategory } from "../types/types";
import Compass from "src/assets/images/compass.png";
import Darts from "src/assets/images/darts.png";
import Fire from "src/assets/images/fire.png";
import Labyrinth from "src/assets/images/labyrinth.png";

export const CHESS_PUZZLES: PuzzleCategory[] = [
  {
    id: "mate-in-one",
    titleKey: "puzzles_mate_in_one_title",
    image: Compass,
    descriptionKey: "puzzles_mate_in_one_desc",
    puzzles: [
      {
        id: "1",
        titleKey: "puzzles_mate_in_one_1_title",
        descriptionKey: "puzzles_mate_in_one_1_desc",
        initialPosition: "6k1/5ppp/8/8/8/8/4PPPP/R3RK2 w - - 0 1",
        correctMoves: [{ from: "a1", to: "a8", piece: "R" }],
        hintKey: "puzzles_mate_in_one_1_hint",
        playerColor: "w",
      },
      {
        id: "2",
        titleKey: "puzzles_mate_in_one_1_title",
        descriptionKey: "puzzles_mate_in_one_1_desc",
        initialPosition: "6rk/6p1/8/8/8/8/6K1/2Q5 w - - 0 1",
        correctMoves: [{ from: "c1", to: "h1", piece: "Q" }],
        hintKey: "puzzles_mate_in_one_1_hint",
        playerColor: "w",
      },
      {
        id: "3",
        titleKey: "puzzles_mate_in_one_1_title",
        descriptionKey: "puzzles_mate_in_one_1_desc",
        initialPosition: "5rk1/5p2/5Bp1/8/8/8/5pK1/7R w - - 0 1",
        correctMoves: [{ from: "h1", to: "h8", piece: "R" }],
        hintKey: "puzzles_mate_in_one_1_hint",
        playerColor: "w",
      },
      {
        id: "4",
        titleKey: "puzzles_mate_in_one_1_title",
        descriptionKey: "puzzles_mate_in_one_1_desc",
        initialPosition:
          "r3kbnr/2qb3p/p7/1pp1PpBp/4N3/P1PP4/1P5P/R2Q1RK1 w - - 0 1",
        correctMoves: [{ from: "d1", to: "h5", piece: "Q" }],
        hintKey: "puzzles_mate_in_one_1_hint",
        playerColor: "w",
      },
      {
        id: "5",
        titleKey: "puzzles_mate_in_one_1_title",
        descriptionKey: "puzzles_mate_in_one_1_desc",
        initialPosition:
          "r1b1k1nr/pp3ppp/2nb4/7q/3N4/2N5/PP2BPPP/R1BQ1RK1 b - - 0 1",
        correctMoves: [{ from: "h5", to: "h2", piece: "q" }],
        hintKey: "puzzles_mate_in_one_1_hint",
        playerColor: "b",
      },
      {
        id: "6",
        titleKey: "puzzles_mate_in_one_1_title",
        descriptionKey: "puzzles_mate_in_one_1_desc",
        initialPosition: "8/pp4p1/2pkp3/3p2Q1/3P1P2/P2qP3/KP6/8 w - - 0 1",
        correctMoves: [{ from: "g5", to: "d8", piece: "Q" }],
        hintKey: "puzzles_mate_in_one_1_hint",
        playerColor: "w",
      },
      {
        id: "7",
        titleKey: "puzzles_mate_in_one_1_title",
        descriptionKey: "puzzles_mate_in_one_1_desc",
        initialPosition:
          // "K1R5/PP4PP/5NN1/Q2P1q2/8/1pPpR1pp/p1pBn3/bk1r1b1r b - 0 1",
          "r1b1r1kb/3nBp1p1/pp1RpPp1/8/2q1P2Q/1NN5/PP4PP/5R1K b - 0 1",
        correctMoves: [{ from: "c4", to: "f1", piece: "q" }],
        hintKey: "puzzles_mate_in_one_1_hint",
        playerColor: "b",
      },
    ],
  },
  {
    id: "mate-in-two",
    titleKey: "puzzles_mate_in_two_title",
    image: Fire,
    descriptionKey: "puzzles_mate_in_two_desc",
    puzzles: [
      {
        id: "1",
        titleKey: "puzzles_mate_in_two_1_title",
        descriptionKey: "puzzles_mate_in_two_1_desc",
        initialPosition: "7k/2p1Bp1p/8/8/6q1/7b/5PP1/4R1K1 w - - 0 1",
        correctMoves: [
          { from: "e7", to: "f6", piece: "B" },
          { from: "h8", to: "g8", piece: "k", isComputerMove: true },
          { from: "e1", to: "e8", piece: "R" },
        ],
        hintKey: "puzzles_mate_in_two_1_hint",
        playerColor: "w",
      },
      {
        id: "2",
        titleKey: "puzzles_mate_in_two_1_title",
        descriptionKey: "puzzles_mate_in_two_1_desc",
        initialPosition: "2krr3/p1p5/2Q4p/2P5/8/P3p3/2Pq2PP/RR2N1K1 b - - 0 1",
        correctMoves: [
          { from: "d2", to: "f2", piece: "q" },
          { from: "g1", to: "h1", piece: "K", isComputerMove: true },
          { from: "f2", to: "f1", piece: "q" },
        ],
        hintKey: "puzzles_mate_in_two_1_hint",
        playerColor: "b",
      },
      {
        id: "3",
        titleKey: "puzzles_mate_in_two_1_title",
        descriptionKey: "puzzles_mate_in_two_1_desc",
        initialPosition: "8/8/5p1p/8/1R2N1P/5k2/r6P/5K2 b - - 0 1",
        correctMoves: [
          { from: "a2", to: "a1", piece: "r" },
          { from: "b4", to: "b1", piece: "R", isComputerMove: true },
          { from: "a1", to: "b1", piece: "r" },
        ],
        hintKey: "puzzles_mate_in_two_1_hint",
        playerColor: "b",
      },
      {
        id: "4",
        titleKey: "puzzles_mate_in_two_1_title",
        descriptionKey: "puzzles_mate_in_two_1_desc",
        initialPosition:
          "2r3k1/5p2/q5p1/p3p1P1/1p2Pp2/1P6/1PP4R/1K5R w - - 0 1",
        correctMoves: [
          { from: "h2", to: "h8", piece: "R" },
          { from: "g8", to: "g7", piece: "k", isComputerMove: true },
          { from: "h1", to: "h7", piece: "R" },
        ],
        hintKey: "puzzles_mate_in_two_1_hint",
        playerColor: "w",
      },
      {
        id: "5",
        titleKey: "puzzles_mate_in_two_1_title",
        descriptionKey: "puzzles_mate_in_two_1_desc",
        initialPosition: "8/R7/4Nbk1/3P2pp/4K3/7P/8/3r4 w - - 0 1",
        correctMoves: [
          { from: "e6", to: "f8", piece: "N" },
          { from: "g6", to: "h6", piece: "k", isComputerMove: true },
          { from: "a7", to: "h7", piece: "R" },
        ],
        hintKey: "puzzles_mate_in_two_1_hint",
        playerColor: "w",
      },
    ],
  },
  {
    id: "basic-tactics",
    titleKey: "puzzles_basic_tactics_title",
    image: Darts,
    descriptionKey: "puzzles_basic_tactics_desc",
    puzzles: [
      {
        id: "1",
        titleKey: "puzzles_basic_tactics_1_title",
        descriptionKey: "puzzles_basic_tactics_1_desc",
        initialPosition: "7k/5r2/4b3/8/3N4/8/8/4K3 w - - 0 1",
        correctMoves: [
          { from: "d4", to: "e6", piece: "N" },
          { from: "h8", to: "h7", piece: "k", isComputerMove: true },
          { from: "e6", to: "g5", piece: "N" },
        ],
        hintKey: "puzzles_basic_tactics_1_hint",
        playerColor: "w",
      },
      {
        id: "2",
        titleKey: "puzzles_basic_tactics_1_title",
        descriptionKey: "puzzles_basic_tactics_1_desc",
        initialPosition:
          "2r1b1k1/1p2qp1p/p3pnp1/4N1N1/3r1P1Q/7R/PP4PP/3R2K1 w - - 0 1",
        correctMoves: [{ from: "d1", to: "d4", piece: "R" }],
        hintKey: "puzzles_basic_tactics_2_hint",
        playerColor: "w",
      },
      {
        id: "3",
        titleKey: "puzzles_basic_tactics_1_title",
        descriptionKey: "puzzles_basic_tactics_1_desc",
        // initialPosition:
        //   "1K2R3/1Pnr4/P1R4P/6P1/p4P2/1pb1N3/1qp4Q/1k6 b - - 0 1",
        initialPosition:
          "6k1/Q4pq1/3N1bp1/2P4p/1P6/P4R1P/4rnP1/3R2K1 b - - 0 1",
        correctMoves: [
          { from: "f2", to: "d1", piece: "n" },
          { from: "a7", to: "a8", piece: "Q", isComputerMove: true },
          { from: "g8", to: "h7", piece: "k" },
        ],
        hintKey: "puzzles_basic_tactics_2_hint",
        playerColor: "b",
      },
    ],
  },
  {
    id: "maze",
    titleKey: "puzzles_maze_title",
    image: Labyrinth,
    descriptionKey: "puzzles_maze_desc",
    puzzles: [],
  },
];
