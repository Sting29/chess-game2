import { Route, Navigate } from "react-router-dom";
import { LoginPage } from "../pages/LoginPage/LoginPage";
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
import { Layout } from "../components/Layout/Layout";

// Проверка аутентификации
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
    title: "Вход",
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
    title: "Шахматные задачи",
  },
  {
    path: "/puzzles/:categoryId",
    element: protectedElement(<PuzzleList />),
    title: "Категория задач",
  },
  {
    path: "/puzzles/:categoryId/:puzzleId",
    element: protectedElement(<PuzzleSolver />),
    title: "Решение задачи",
  },
  {
    path: "/how-to-move/pawn-move",
    element: protectedElement(<PawnMove />),
    title: "Как ходит пешка",
  },
  {
    path: "/how-to-move/rook-move",
    element: protectedElement(<RookMove />),
    title: "Как ходит ладья",
  },
  {
    path: "/how-to-move/knight-move",
    element: protectedElement(<KnightMove />),
    title: "Как ходит конь",
  },
  {
    path: "/how-to-move/bishop-move",
    element: protectedElement(<BishopMove />),
    title: "Как ходит слон",
  },
  {
    path: "/how-to-move/queen-move",
    element: protectedElement(<QueenMove />),
    title: "Как ходит ферзь",
  },
  {
    path: "/how-to-move/king-move",
    element: protectedElement(<KingMove />),
    title: "Как ходит король",
  },
  {
    path: "/how-to-play/pawn-battle",
    element: protectedElement(<PawnBattle />),
    title: "Битва пешек",
  },
  {
    path: "/how-to-play/knight-battle",
    element: protectedElement(<KnightBattle />),
    title: "Битва коней",
  },
  {
    path: "/play-with-computer",
    element: protectedElement(<PlayWithComputer />),
    title: "Игра с компьютером",
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
