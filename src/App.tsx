import { AppRouter } from "./routes";
import "./App.css";
import { GlobalStyles } from "./styles/GlobalStyles";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "./store";
import { setLanguage } from "./store/settingsSlice";
import { useTranslation } from "react-i18next";

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

function App() {
  return (
    <div className="app">
      <GlobalStyles />
      <LanguageSync />
      <AppRouter />
    </div>
  );
}

export default App;
