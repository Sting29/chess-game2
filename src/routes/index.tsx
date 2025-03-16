import { Route, Navigate } from "react-router-dom";
import { LoginPage } from "../pages/LoginPage/LoginPage";
import HowToMove from "../pages/HowToMove/HowToMove";
import ChessTutorial from "../pages/ChessTutorial/ChessTutorial";
import HowToPlay from "../pages/HowToPlay/HowToPlay";
import PawnMove from "../pages/PawnMove/PawnMove";
import RookMove from "../pages/RookMove/RookMove";
import KnightMove from "../pages/KnightMove/KnightMove";
import BishopMove from "../pages/BishopMove/BishopMove";
import QueenMove from "../pages/QueenMove/QueenMove";
import KingMove from "../pages/KingMove/KingMove";
import PawnBattle from "../pages/PawnBattle";
import KnightBattle from "../pages/KnightBattle";
import PuzzleList from "../pages/PuzzleList";
import { PuzzleSolver } from "../pages/PuzzleSolver";
import PlayWithComputer from "../pages/PlayWithComputer";
import { Layout } from "../components/Layout/Layout";

// Authentication check
const isAuthenticated = () => {
  return localStorage.getItem("isAuthenticated") === "true";
};

// Компонент для защищенных маршрутов
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <Layout>{children}</Layout>;
};

// Защищенный элемент
const protectedElement = (element: React.ReactNode) => (
  <ProtectedRoute>{element}</ProtectedRoute>
);

export const routes = [
  {
    path: "/login",
    element: isAuthenticated() ? <Navigate to="/" replace /> : <LoginPage />,
    title: "Login",
  },
  {
    path: "/",
    element: protectedElement(<ChessTutorial />),
    title: "Chess Tutorial",
  },
  {
    path: "/how-to-move",
    element: protectedElement(<HowToMove />),
    title: "How to Move",
  },
  {
    path: "/how-to-play",
    element: protectedElement(<HowToPlay />),
    title: "How to Play",
  },
  {
    path: "/puzzles",
    element: protectedElement(<PuzzleList />),
    title: "Chess Puzzles",
  },
  {
    path: "/puzzles/:categoryId",
    element: protectedElement(<PuzzleList />),
    title: "Puzzle Category",
  },
  {
    path: "/puzzles/:categoryId/:puzzleId",
    element: protectedElement(<PuzzleSolver />),
    title: "Solve Puzzle",
  },
  {
    path: "/how-to-move/pawn-move",
    element: protectedElement(<PawnMove />),
    title: "How to Move: Pawn",
  },
  {
    path: "/how-to-move/rook-move",
    element: protectedElement(<RookMove />),
    title: "How to Move: Rook",
  },
  {
    path: "/how-to-move/knight-move",
    element: protectedElement(<KnightMove />),
    title: "How to Move: Knight",
  },
  {
    path: "/how-to-move/bishop-move",
    element: protectedElement(<BishopMove />),
    title: "How to Move: Bishop",
  },
  {
    path: "/how-to-move/queen-move",
    element: protectedElement(<QueenMove />),
    title: "How to Move: Queen",
  },
  {
    path: "/how-to-move/king-move",
    element: protectedElement(<KingMove />),
    title: "How to Move: King",
  },
  {
    path: "/how-to-play/pawn-battle",
    element: protectedElement(<PawnBattle />),
    title: "Pawn Battle",
  },
  {
    path: "/how-to-play/knight-battle",
    element: protectedElement(<KnightBattle />),
    title: "Knight Battle",
  },
  {
    path: "/play-with-computer",
    element: protectedElement(<PlayWithComputer />),
    title: "Play with Computer",
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
    title: "404",
  },
];

export const routeElements = routes.map((route) => (
  <Route key={route.path} path={route.path} element={route.element} />
));
