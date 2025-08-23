import { AppRouter, GlobalErrorBoundary } from "src/routes";
import "src/App.css";
import { GlobalStyles } from "src/styles/GlobalStyles";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "src/store";
import { setLanguage, loadUserProfile } from "./store/settingsSlice";
import { useTranslation } from "react-i18next";
import { authService } from "src/services";
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
  const { isAuthenticated, loading, user } = useSelector(
    (state: RootState) => state.settings
  );

  useEffect(() => {
    const restoreSession = async () => {
      // Check if user has valid tokens and is not already authenticated and not already loading
      if (
        !isAuthenticated &&
        !loading &&
        !user &&
        authService.isAuthenticated()
      ) {
        try {
          // Try to load user profile to restore session
          await dispatch(loadUserProfile()).unwrap();
        } catch (error) {
          // If profile loading fails, clear auth state
          console.error("Failed to restore session:", error);
          authService.clearAuthState();
        }
      }
    };

    restoreSession();
  }, [dispatch, isAuthenticated, loading, user]);

  return null;
}

function App() {
  // Removed loading selector as per loader refactoring requirements

  // Removed profile loading indicator as per loader refactoring requirements
  // Only login and logout operations should show loading indicators

  return (
    <GlobalErrorBoundary>
      <div className="app">
        <GlobalStyles />
        <LanguageSync />
        <AuthRestore />

        <AppRouter />
      </div>
    </GlobalErrorBoundary>
  );
}

export default App;
