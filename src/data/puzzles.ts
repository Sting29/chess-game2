import { PuzzleCategory } from "../types/types";

export const CHESS_PUZZLES: PuzzleCategory[] = [
  {
    id: "mate-in-one",
    title: "Мат в 1 ход",
    description: "Найдите ход, ведущий к мату",
    puzzles: [
      {
        id: "1",
        title: "Мат в 1 ход - Задача 1",
        description: "Белые начинают и ставят мат в 1 ход",
        initialPosition: "6k1/5ppp/8/8/8/8/4PPPP/R3RK2 w - - 0 1",
        correctMoves: [{ from: "a1", to: "a8", piece: "R" }],
        hint: "Ладья может поставить мат по открытой вертикали",
        playerColor: "w",
      },
      {
        id: "2",
        title: "Мат в 1 ход - Задача 2",
        description: "Белые начинают и ставят мат в 1 ход",
        initialPosition: "2Q3K1/8/8/8/8/8/6p1/6rk w - - 0 1",
        correctMoves: [{ from: "c1", to: "h1", piece: "Q" }],
        hint: "Ферзь может поставить мат по первой горизонтали",
        playerColor: "w",
      },
    ],
  },
  {
    id: "mate-in-two",
    title: "Мат в 2 хода",
    description: "Найдите комбинацию из двух ходов, ведущую к мату",
    puzzles: [
      {
        id: "1",
        title: "Мат в 2 хода - Задача 1",
        description: "Белые начинают и ставят мат в 2 хода",
        initialPosition: "4R1K1/5PP1/7b/6q1/8/8/2p1Bp1p/7k w - - 0 1",
        correctMoves: [
          { from: "e7", to: "f6", piece: "B" },
          { from: "h8", to: "g8", piece: "K", isComputerMove: true },
          { from: "e1", to: "e8", piece: "R" },
        ],
        hint: "Слон должен контролировать важное поле, вынуждая короля двигаться",
        playerColor: "w",
      },
    ],
  },
  {
    id: "basic-tactics",
    title: "Базовые тактики",
    description: "Изучите основные тактические приемы",
    puzzles: [
      {
        id: "1",
        title: "Вилка конем",
        description: "Используйте коня для атаки двух фигур одновременно",
        initialPosition: "4k3/8/8/3N4/8/4b3/5r2/7k w - - 0 1",
        correctMoves: [
          { from: "d4", to: "e6", piece: "N" },
          { from: "h8", to: "g8", piece: "K", isComputerMove: true },
          { from: "e6", to: "f7", piece: "N" },
        ],
        hint: "Найдите позицию коня, с которой он атакует две фигуры противника",
        playerColor: "w",
      },
    ],
  },
];
