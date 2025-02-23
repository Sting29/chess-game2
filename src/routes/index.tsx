import { Route } from "react-router-dom";
import { HowToMove } from "../pages/HowToMove";
import { PawnMove } from "../pages/PawnMove";
import { RookMove } from "../pages/RookMove";
import { KnightMove } from "../pages/KnightMove";
import { BishopMove } from "../pages/BishopMove";
import { QueenMove } from "../pages/QueenMove";
import { KingMove } from "../pages/KingMove";

export const routes = [
  {
    path: "/",
    element: <HowToMove />,
    title: "How to Move",
  },
  {
    path: "/pawn-move",
    element: <PawnMove />,
    title: "Как ходит пешка",
  },
  {
    path: "/rook-move",
    element: <RookMove />,
    title: "Как ходит ладья",
  },
  {
    path: "/knight-move",
    element: <KnightMove />,
    title: "Как ходит конь",
  },
  {
    path: "/bishop-move",
    element: <BishopMove />,
    title: "Как ходит слон",
  },
  {
    path: "/queen-move",
    element: <QueenMove />,
    title: "Как ходит ферзь",
  },
  {
    path: "/king-move",
    element: <KingMove />,
    title: "Как ходит король",
  },
];

export const routeElements = routes.map((route) => (
  <Route key={route.path} path={route.path} element={route.element} />
));
