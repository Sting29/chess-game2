import { PuzzleCategory } from "../types/types";
import Compass from "src/assets/images/compass.png";
import Darts from "src/assets/images/darts.png";
import Fire from "src/assets/images/fire.png";

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
        titleKey: "puzzles_mate_in_one_2_title",
        descriptionKey: "puzzles_mate_in_one_2_desc",
        initialPosition: "6rk/6p1/8/8/8/8/6K1/2Q5 w - - 0 1",
        correctMoves: [{ from: "c1", to: "h1", piece: "Q" }],
        hintKey: "puzzles_mate_in_one_2_hint",
        playerColor: "w",
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
    ],
  },
];
