import { Route } from "react-router-dom";
import { HowToMove } from "../pages/HowToMove";
import ChessTutorial from "../pages/ChessTutorial/ChessTutorial";
import { HowToPlay } from "../pages/HowToPlay";
import { PawnMove } from "../pages/PawnMove";
import { RookMove } from "../pages/RookMove";
import KnightMove from "../pages/KnightMove";
import { BishopMove } from "../pages/BishopMove";
import { QueenMove } from "../pages/QueenMove";
import { KingMove } from "../pages/KingMove";
import PawnBattle from "../pages/PawnBattle";
import KnightBattle from "../pages/KnightBattle";
import PuzzleList from "../pages/PuzzleList";
import { PuzzleSolver } from "../pages/PuzzleSolver";
import PlayWithComputer from "../pages/PlayWithComputer";

export const routes = [
  {
    path: "/",
    element: <ChessTutorial />,
    title: "Chess Tutorial",
  },
  {
    path: "/how-to-move",
    element: <HowToMove />,
    title: "How to Move",
  },
  {
    path: "/how-to-play",
    element: <HowToPlay />,
    title: "How to Play",
  },
  {
    path: "/puzzles",
    element: <PuzzleList />,
    title: "Шахматные задачи",
  },
  {
    path: "/puzzles/:categoryId",
    element: <PuzzleList />,
    title: "Категория задач",
  },
  {
    path: "/puzzles/:categoryId/:puzzleId",
    element: <PuzzleSolver />,
    title: "Решение задачи",
  },
  {
    path: "/how-to-move/pawn-move",
    element: <PawnMove />,
    title: "Как ходит пешка",
  },
  {
    path: "/how-to-move/rook-move",
    element: <RookMove />,
    title: "Как ходит ладья",
  },
  {
    path: "/how-to-move/knight-move",
    element: <KnightMove />,
    title: "Как ходит конь",
  },
  {
    path: "/how-to-move/bishop-move",
    element: <BishopMove />,
    title: "Как ходит слон",
  },
  {
    path: "/how-to-move/queen-move",
    element: <QueenMove />,
    title: "Как ходит ферзь",
  },
  {
    path: "/how-to-move/king-move",
    element: <KingMove />,
    title: "Как ходит король",
  },
  {
    path: "/how-to-play/pawn-battle",
    element: <PawnBattle />,
    title: "Битва пешек",
  },
  {
    path: "/how-to-play/knight-battle",
    element: <KnightBattle />,
    title: "Битва коней",
  },
  {
    path: "/play-with-computer",
    element: <PlayWithComputer />,
    title: "Игра с компьютером",
  },
];

export const routeElements = routes.map((route) => (
  <Route key={route.path} path={route.path} element={route.element} />
));
