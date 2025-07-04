import { PageTitle } from "src/components/PageTitle/PageTitle";
import {
  PageContainer,
  SettingsContainer,
  SettingsTitle,
  SettingsLanguage,
  SettingsLanguageButton,
  SettingsLanguageButtonText,
} from "./styles";
import BackButtonImage from "src/components/BackButtonImage/BackButtonImage";
import { BackButtonWrap } from "src/components/BackButtonImage/styles";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "src/store";
import { setLanguage, setChessSet } from "src/store/settingsSlice";
import { FIGURES_SETS } from "src/data/figures-sets";

function SettingsPage() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const language = useSelector((state: RootState) => state.settings.language);
  const chessSet = useSelector((state: RootState) => state.settings.chessSet);

  // Синхронизируем язык redux <-> i18next
  useEffect(() => {
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, [language, i18n]);

  const handleLanguageChange = (lang: string) => {
    dispatch(setLanguage(lang));
    i18n.changeLanguage(lang);
  };

  const handleChessSetChange = (set: string) => {
    dispatch(setChessSet(set));
  };

  const figureOrder = ["pawn", "rook", "knight", "bishop", "queen", "king"];

  return (
    <PageContainer>
      <PageTitle title={t("settings")} />
      <BackButtonWrap>
        <BackButtonImage linkToPage="-1" />
      </BackButtonWrap>
      <SettingsContainer>
        <SettingsTitle>{t("select_language")}</SettingsTitle>
        <SettingsLanguage>
          <SettingsLanguageButton
            $current={language === "he"}
            onClick={() => handleLanguageChange("he")}
          >
            <SettingsLanguageButtonText $current={language === "he"}>
              עברית
            </SettingsLanguageButtonText>
          </SettingsLanguageButton>
          <SettingsLanguageButton
            $current={language === "en"}
            onClick={() => handleLanguageChange("en")}
          >
            <SettingsLanguageButtonText $current={language === "en"}>
              English
            </SettingsLanguageButtonText>
          </SettingsLanguageButton>
          <SettingsLanguageButton
            $current={language === "ar"}
            onClick={() => handleLanguageChange("ar")}
          >
            <SettingsLanguageButtonText $current={language === "ar"}>
              العربية
            </SettingsLanguageButtonText>
          </SettingsLanguageButton>
          <SettingsLanguageButton
            $current={language === "ru"}
            onClick={() => handleLanguageChange("ru")}
          >
            <SettingsLanguageButtonText $current={language === "ru"}>
              Русский
            </SettingsLanguageButtonText>
          </SettingsLanguageButton>
        </SettingsLanguage>
      </SettingsContainer>

      <SettingsContainer>
        <SettingsTitle>{t("select_chess_set")}</SettingsTitle>
        <SettingsLanguage>
          <SettingsLanguageButton
            $current={chessSet === "1"}
            onClick={() => handleChessSetChange("1")}
          >
            <SettingsLanguageButtonText $current={chessSet === "1"}>
              {t("chess_set_1")}
            </SettingsLanguageButtonText>
          </SettingsLanguageButton>
          <SettingsLanguageButton
            $current={chessSet === "2"}
            onClick={() => handleChessSetChange("2")}
          >
            <SettingsLanguageButtonText $current={chessSet === "2"}>
              {t("chess_set_2")}
            </SettingsLanguageButtonText>
          </SettingsLanguageButton>
          {/* <SettingsLanguageButton
            $current={chessSet === "3"}
            onClick={() => handleChessSetChange("3")}
          >
            <SettingsLanguageButtonText $current={chessSet === "3"}>
              {t("chess_set_3")}
            </SettingsLanguageButtonText>
          </SettingsLanguageButton>
          <SettingsLanguageButton
            $current={chessSet === "4"}
            onClick={() => handleChessSetChange("4")}
          >
            <SettingsLanguageButtonText $current={chessSet === "4"}>
              {t("chess_set_4")}
            </SettingsLanguageButtonText>
          </SettingsLanguageButton> */}
        </SettingsLanguage>
      </SettingsContainer>
      <SettingsContainer style={{ marginTop: 16 }}>
        <SettingsTitle>
          {chessSet === "1" ? t("chess_set_1") : t("chess_set_2")}
        </SettingsTitle>
        <table>
          <tbody>
            <tr>
              {figureOrder.map((fig) => {
                const item = FIGURES_SETS[Number(chessSet) - 1].white.find(
                  (f) => f.figure === fig
                );
                return (
                  <td
                    key={fig + "_w"}
                    style={{ textAlign: "center", padding: 4 }}
                  >
                    <img src={item?.image} alt={fig + " white"} height={48} />
                  </td>
                );
              })}
            </tr>
            <tr>
              {figureOrder.map((fig) => {
                const item = FIGURES_SETS[Number(chessSet) - 1].black.find(
                  (f) => f.figure === fig
                );
                return (
                  <td
                    key={fig + "_b"}
                    style={{ textAlign: "center", padding: 4 }}
                  >
                    <img src={item?.image} alt={fig + " black"} height={48} />
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </SettingsContainer>
    </PageContainer>
  );
}

export default SettingsPage;
