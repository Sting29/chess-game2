import { AppRouter } from "./routes";
import "./App.css";
import { GlobalStyles } from "./styles/GlobalStyles";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "./store";
import { setLanguage, loadUserProfile } from "./store/settingsSlice";
import { useTranslation } from "react-i18next";
import { authService } from "./services";
import { Loader } from "./components/Loader/Loader";

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
  const { loading, isAuthenticated, user } = useSelector(
    (state: RootState) => state.settings
  );

  // Show loader if user is authenticated but profile is still loading
  const shouldShowLoader = loading && isAuthenticated && !user;

  return (
    <div className="app">
      <GlobalStyles />
      <LanguageSync />
      <AuthRestore />

      {shouldShowLoader ? <Loader /> : <AppRouter />}
    </div>
  );
}

export default App;
