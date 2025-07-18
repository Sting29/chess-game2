import { AppRouter } from "./routes";
import "./App.css";
import { GlobalStyles } from "./styles/GlobalStyles";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "./store";
import { setLanguage, loadUserProfile } from "./store/settingsSlice";
import { useTranslation } from "react-i18next";
import { authService } from "./services";

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
  const { isAuthenticated, loading } = useSelector(
    (state: RootState) => state.settings
  );

  useEffect(() => {
    const restoreSession = async () => {
      // Check if user has valid tokens and is not already authenticated
      if (!isAuthenticated && !loading && authService.isAuthenticated()) {
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
  }, [dispatch, isAuthenticated, loading]);

  return null;
}

function App() {
  return (
    <div className="app">
      <GlobalStyles />
      <LanguageSync />
      <AuthRestore />
      <AppRouter />
    </div>
  );
}

export default App;
