import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "src/store";
import { RootRoute } from "src/components/RootRoute/RootRoute";
import HowToMove from "src/pages/HowToMove/HowToMove";
import HowToPlay from "src/pages/HowToPlay/HowToPlay";
import ChessMoves from "src/pages/ChessMoves/ChessMoves";
import PuzzleList from "src/pages/PuzzleList/PuzzleList";
import { PuzzleSolver } from "src/pages/PuzzleSolver/PuzzleSolver";
import MazePuzzleList from "src/pages/MazePuzzleList/MazePuzzleList";
import { MazePuzzleSolver } from "src/pages/MazePuzzleSolver/MazePuzzleSolver";
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

function ProtectedRoute({ children }: { children: React.ReactElement }) {
  const { isAuthenticated } = useSelector((state: RootState) => state.settings);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Layout>{children}</Layout>;
}

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <RootRoute />,
    },
    {
      path: "/how-to-move",
      element: (
        <ProtectedRoute>
          <HowToMove />
        </ProtectedRoute>
      ),
    },
    {
      path: "/how-to-move/:pieceId",
      element: (
        <ProtectedRoute>
          <ChessMoves />
        </ProtectedRoute>
      ),
    },
    {
      path: "/how-to-play",
      element: (
        <ProtectedRoute>
          <HowToPlay />
        </ProtectedRoute>
      ),
    },
    {
      path: "/puzzles",
      element: (
        <ProtectedRoute>
          <PuzzleList />
        </ProtectedRoute>
      ),
    },
    {
      path: "/puzzles/:categoryId",
      element: (
        <ProtectedRoute>
          <PuzzleList />
        </ProtectedRoute>
      ),
    },
    {
      path: "/puzzles/maze",
      element: (
        <ProtectedRoute>
          <MazePuzzleList />
        </ProtectedRoute>
      ),
    },
    {
      path: "/puzzles/maze/:puzzleId",
      element: (
        <ProtectedRoute>
          <MazePuzzleSolver />
        </ProtectedRoute>
      ),
    },
    {
      path: "/puzzles/:categoryId/:puzzleId",
      element: (
        <ProtectedRoute>
          <PuzzleSolver />
        </ProtectedRoute>
      ),
    },

    {
      path: "/how-to-play/:battleId",
      element: (
        <ProtectedRoute>
          <ChessBattle />
        </ProtectedRoute>
      ),
    },
    {
      path: "/play",
      element: (
        <ProtectedRoute>
          <Play />
        </ProtectedRoute>
      ),
    },
    {
      path: "/play/person",
      element: (
        <ProtectedRoute>
          <PlayWithPerson />
        </ProtectedRoute>
      ),
    },
    {
      path: "/play/computer",
      element: (
        <ProtectedRoute>
          <PlayWithComputerSelectLevel />
        </ProtectedRoute>
      ),
    },
    {
      path: "/play/computer/:level",
      element: (
        <ProtectedRoute>
          <PlayWithComputer />
        </ProtectedRoute>
      ),
    },
    {
      path: "/account",
      element: (
        <ProtectedRoute>
          <Account />
        </ProtectedRoute>
      ),
    },
    {
      path: "/settings",
      element: (
        <ProtectedRoute>
          <SettingsPage />
        </ProtectedRoute>
      ),
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
