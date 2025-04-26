import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { LoginPage } from "src/pages/LoginPage/LoginPage";
import HowToMove from "src/pages/HowToMove/HowToMove";
import ChessTutorial from "src/pages/ChessTutorial/ChessTutorial";
import HowToPlay from "src/pages/HowToPlay/HowToPlay";
import ChessMoves from "src/pages/ChessMoves/ChessMoves";
import PawnBattle from "src/pages/PawnBattle";
import KnightBattle from "src/pages/KnightBattle";
import PuzzleList from "src/pages/PuzzleList";
import { PuzzleSolver } from "src/pages/PuzzleSolver";
import PlayWithComputer from "src/pages/PlayWithComputer";
import PlayWithPerson from "src/pages/PlayWithPerson/PlayWithPerson";
import { Layout } from "src/Layout/Layout";
import Account from "src/pages/Account/Account";

// Получаем базовый путь из окружения или используем корневой путь
const basename = process.env.PUBLIC_URL || "/";

function protectedElement(element: React.ReactElement) {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Layout>{element}</Layout>;
}

const router = createBrowserRouter(
  [
    {
      path: "/login",
      element:
        localStorage.getItem("isAuthenticated") === "true" ? (
          <Navigate to="/" replace />
        ) : (
          <LoginPage />
        ),
    },
    {
      path: "/",
      element: protectedElement(<ChessTutorial />),
      // title: "Chess Tutorial",
    },
    {
      path: "/how-to-move",
      element: protectedElement(<HowToMove />),
      // title: "How to Move",
    },
    {
      path: "/how-to-play",
      element: protectedElement(<HowToPlay />),
      // title: "How to Play",
    },
    {
      path: "/puzzles",
      element: protectedElement(<PuzzleList />),
      // title: "Chess Puzzles",
    },
    {
      path: "/puzzles/:categoryId",
      element: protectedElement(<PuzzleList />),
      // title: "Puzzle Category",
    },
    {
      path: "/puzzles/:categoryId/:puzzleId",
      element: protectedElement(<PuzzleSolver />),
      // title: "Solve Puzzle",
    },
    {
      path: "/how-to-move/:pieceId",
      element: protectedElement(<ChessMoves />),
    },
    {
      path: "/how-to-play/pawn-battle",
      element: protectedElement(<PawnBattle />),
      // title: "Pawn Battle",
    },
    {
      path: "/how-to-play/knight-battle",
      element: protectedElement(<KnightBattle />),
      // title: "Knight Battle",
    },
    {
      path: "/play-with-computer",
      element: protectedElement(<PlayWithComputer />),
      // title: "Play with Computer",
    },
    {
      path: "/play-with-person",
      element: protectedElement(<PlayWithPerson />),
    },
    {
      path: "/account",
      element: protectedElement(<Account />),
    },
    {
      path: "*",
      element: <Navigate to="/" replace />,
      // title: "404",
    },
  ],
  {
    basename: basename,
  }
);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
