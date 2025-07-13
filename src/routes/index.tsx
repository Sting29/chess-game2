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
import PuzzleList from "src/pages/PuzzleList/PuzzleList";
import { PuzzleSolver } from "src/pages/PuzzleSolver/PuzzleSolver";
import PlayWithComputer from "src/pages/PlayWithComputer/PlayWithComputer";
import PlayWithPerson from "src/pages/PlayWithPerson/PlayWithPerson";
import { Layout } from "src/Layout/Layout";
import Account from "src/pages/Account/Account";
import ChessBattle from "src/pages/ChessBattle/ChessBattle";
import SettingsPage from "src/pages/SettingsPage/SettingsPage";
import Play from "src/pages/Play/Play";
import PlayWithComputerSelectLevel from "src/pages/PlayWithComputerSelectLevel/PlayWithComputerSelectLevel";
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
    },
    {
      path: "/how-to-move",
      element: protectedElement(<HowToMove />),
    },
    {
      path: "/how-to-play",
      element: protectedElement(<HowToPlay />),
    },
    {
      path: "/puzzles",
      element: protectedElement(<PuzzleList />),
    },
    {
      path: "/puzzles/:categoryId",
      element: protectedElement(<PuzzleList />),
    },
    {
      path: "/puzzles/:categoryId/:puzzleId",
      element: protectedElement(<PuzzleSolver />),
    },
    {
      path: "/how-to-move/:pieceId",
      element: protectedElement(<ChessMoves />),
    },
    {
      path: "/how-to-play/:battleId",
      element: protectedElement(<ChessBattle />),
    },
    {
      path: "/play",
      element: protectedElement(<Play />),
    },
    {
      path: "/play/person",
      element: protectedElement(<PlayWithPerson />),
    },
    {
      path: "/play/computer",
      element: protectedElement(<PlayWithComputerSelectLevel />),
    },
    {
      path: "/play/computer/:level",
      element: protectedElement(<PlayWithComputer />),
    },
    {
      path: "/account",
      element: protectedElement(<Account />),
    },
    {
      path: "/settings",
      element: protectedElement(<SettingsPage />),
    },
    {
      path: "*",
      element: <Navigate to="/" replace />,
    },
  ],
  {
    basename: basename,
  }
);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
