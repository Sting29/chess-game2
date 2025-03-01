import { Route } from "react-router-dom";
import { HowToMove } from "../pages/HowToMove";
import { ChessTutorial } from "../pages/ChessTutorial";
import { HowToPlay } from "../pages/HowToPlay";
import { PawnMove } from "../pages/PawnMove";
import { RookMove } from "../pages/RookMove";
import { KnightMove } from "../pages/KnightMove";
import { BishopMove } from "../pages/BishopMove";
import { QueenMove } from "../pages/QueenMove";
import { KingMove } from "../pages/KingMove";

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
];

export const routeElements = routes.map((route) => (
  <Route key={route.path} path={route.path} element={route.element} />
));
