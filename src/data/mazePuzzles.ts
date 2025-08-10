import { MazePuzzle } from "../types/types";
import Labyrinth from "src/assets/images/labyrinth.png";

export const MAZE_PUZZLES: MazePuzzle[] = [
  {
    id: "1",
    titleKey: "maze_puzzle_1_title",
    descriptionKey: "maze_puzzle_1_desc",
    initialPosition: "E7/8/8/8/8/8/8/R7 w - - 0 1",
    hintKey: "maze_puzzle_1_hint",
  },
  {
    id: "2",
    titleKey: "maze_puzzle_2_title",
    descriptionKey: "maze_puzzle_2_desc",
    initialPosition: "E6C/WWWW1WWW/8/8/8/2W1W3/WWW1WWW1/R7 w - - 0 1",
    hintKey: "maze_puzzle_2_hint",
  },
  {
    id: "3",
    titleKey: "maze_puzzle_3_title",
    descriptionKey: "maze_puzzle_3_desc",
    initialPosition: "6E1/1WWWWWW1/1W5W/1W3C1W/1W5W/1WWWWWW1/8/3B3 w - - 0 1",
    maxMoves: 15,
    hintKey: "maze_puzzle_3_hint",
  },
  {
    id: "4",
    titleKey: "maze_puzzle_4_title",
    descriptionKey: "maze_puzzle_4_desc",
    initialPosition: "E7/WWWWWW1W/7W/C5WW/7W/WWWWWW1W/8/7R w - - 0 1",
    maxMoves: 20,
    timeLimit: 120,
    hintKey: "maze_puzzle_4_hint",
  },
  {
    id: "5",
    titleKey: "maze_puzzle_5_title",
    descriptionKey: "maze_puzzle_5_desc",
    initialPosition: "3E4/3W4/3W4/CCWWWWCC/3W4/3W4/3W4/3N4 w - - 0 1",
    maxMoves: 25,
    hintKey: "maze_puzzle_5_hint",
  },
];

export const MAZE_PUZZLE_CATEGORY = {
  id: "maze",
  titleKey: "puzzles_maze_title",
  descriptionKey: "puzzles_maze_desc",
  image: Labyrinth,
  puzzles: MAZE_PUZZLES,
};
