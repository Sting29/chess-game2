import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "src/store";
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

function ProtectedRoute({ children }: { children: React.ReactElement }) {
  const { isAuthenticated, loading } = useSelector(
    (state: RootState) => state.settings
  );

  // Показываем загрузку пока проверяем аутентификацию
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Layout>{children}</Layout>;
}

function LoginRoute() {
  const { isAuthenticated } = useSelector((state: RootState) => state.settings);

  // Убираем проверку loading - пусть LoginPage сама управляет состоянием загрузки
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <LoginPage />;
}

const router = createBrowserRouter(
  [
    {
      path: "/login",
      element: <LoginRoute />,
    },
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <ChessTutorial />
        </ProtectedRoute>
      ),
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
      path: "/puzzles/:categoryId/:puzzleId",
      element: (
        <ProtectedRoute>
          <PuzzleSolver />
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
