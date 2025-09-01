import { AppRouter, GlobalErrorBoundary } from "src/routes";
import "src/App.css";
import { GlobalStyles } from "src/styles/GlobalStyles";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "src/store";
import {
  setLanguage,
  loadUserProfile,
  setInitialCheckComplete,
} from "./store/settingsSlice";
import { useTranslation } from "react-i18next";
import { authService } from "src/api";
import { LoadingProvider } from "src/contexts/LoadingProvider";
import FullScreenLoader from "src/components/FullScreenLoader/FullScreenLoader";
import { useLoading } from "src/hooks/useLoading";
// import ReduxDebugButton from "src/components/ReduxDebugButton";
import "src/utils/reduxDebug"; // Импортируем для добавления функций в window
// Removed Loader import as per loader refactoring requirements

function LanguageSync() {
  const { i18n } = useTranslation();
  const dispatch = useDispatch();
  const language = useSelector((state: RootState) => state.settings.language);

  useEffect(() => {
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    } else if (language !== i18n.language) {
      dispatch(setLanguage(i18n.language));
    }
    // eslint-disable-next-line
  }, [language, i18n.language]);

  return null;
}

function AuthRestore() {
  const dispatch = useDispatch<AppDispatch>();
  const { initialCheckComplete } = useSelector(
    (state: RootState) => state.settings
  );

  useEffect(() => {
    const restoreSession = async () => {
      // Skip if initial check is already complete
      if (initialCheckComplete) {
        return;
      }

      // Check if user has valid tokens
      if (authService.isAuthenticated()) {
        try {
          // Try to load user profile to restore session (this will also load progress data)
          await dispatch(loadUserProfile()).unwrap();
        } catch (error) {
          // If profile loading fails, clear auth state and mark check complete
          console.error("Failed to restore session:", error);
          authService.clearAuthState();
          dispatch(setInitialCheckComplete(true));
        }
      } else {
        // If no valid tokens, mark initial check as complete immediately
        dispatch(setInitialCheckComplete(true));
      }
    };

    restoreSession();
  }, [dispatch, initialCheckComplete]);

  return null;
}

function AppContent() {
  const { isGlobalLoading, loadingMessage } = useLoading();

  return (
    <div className="app">
      <GlobalStyles />
      <LanguageSync />
      <AuthRestore />

      {/* Redux Debug Button - positioned in top right corner */}
      {/* <div
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          zIndex: 9,
        }}
      >
        <ReduxDebugButton
          buttonText="Redux"
          style={{
            padding: "8px 16px",
            fontSize: "12px",
            backgroundColor: "#28a745",
            borderRadius: "20px",
          }}
        />
      </div> */}

      <AppRouter />

      {/* Глобальный FullScreenLoader */}
      {isGlobalLoading && <FullScreenLoader message={loadingMessage} />}
    </div>
  );
}

function App() {
  return (
    <GlobalErrorBoundary>
      <LoadingProvider>
        <AppContent />
      </LoadingProvider>
    </GlobalErrorBoundary>
  );
}

export default App;
