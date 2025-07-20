import { PageTitle } from "src/components/PageTitle/PageTitle";
import {
  PageContainer,
  SettingsContainer,
  SettingsTitle,
  SettingsButtonsGroup,
  SettingsButton,
  SettingsButtonText,
} from "./styles";
import BackButtonImage from "src/components/BackButtonImage/BackButtonImage";
import { BackButtonWrap } from "src/components/BackButtonImage/styles";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "src/store";
import {
  setLanguage,
  setChessSet,
  updateLanguageAsync,
  updateChessSetAsync,
} from "src/store/settingsSlice";
import { FIGURES_SETS } from "src/data/figures-sets";
import { languageConfig } from "src/data/languageConfig";

function SettingsPage() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { language, chessSet, isAuthenticated } = useSelector(
    (state: RootState) => state.settings
  );

  // Синхронизируем язык redux <-> i18next
  useEffect(() => {
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, [language, i18n]);

  const handleLanguageChange = async (lang: string) => {
    // Immediately update UI for instant feedback
    i18n.changeLanguage(lang);
    dispatch(setLanguage(lang));

    // If authenticated, also save to API
    if (isAuthenticated) {
      try {
        await dispatch(
          updateLanguageAsync(lang as "he" | "en" | "ar" | "ru")
        ).unwrap();
        console.log("Language saved to API successfully");
      } catch (error) {
        console.error("Failed to save language to API:", error);
        // UI is already updated, so no need to revert
      }
    }
  };

  const handleChessSetChange = async (set: string) => {
    // Immediately update UI for instant feedback
    dispatch(setChessSet(set));

    // If authenticated, also save to API
    if (isAuthenticated) {
      try {
        // Convert local chess set ID to API format
        const apiChessSet = set === "1" ? "chessSet1" : "chessSet2";
        await dispatch(updateChessSetAsync(apiChessSet)).unwrap();
        console.log("Chess set saved to API successfully");
      } catch (error) {
        console.error("Failed to save chess set to API:", error);
        // UI is already updated, so no need to revert
      }
    }
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
        <SettingsButtonsGroup>
          {languageConfig.map((lang) => (
            <SettingsButton
              $current={language === lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              key={lang.code}
            >
              <SettingsButtonText $current={language === lang.code}>
                {lang.title}
              </SettingsButtonText>
            </SettingsButton>
          ))}
        </SettingsButtonsGroup>
      </SettingsContainer>

      <SettingsContainer>
        <SettingsTitle>{t("select_chess_set")}</SettingsTitle>
        <SettingsButtonsGroup>
          <SettingsButton
            $current={chessSet === "1"}
            onClick={() => handleChessSetChange("1")}
          >
            <SettingsButtonText $current={chessSet === "1"}>
              {t("chess_set_1")}
            </SettingsButtonText>
          </SettingsButton>
          <SettingsButton
            $current={chessSet === "2"}
            onClick={() => handleChessSetChange("2")}
          >
            <SettingsButtonText $current={chessSet === "2"}>
              {t("chess_set_2")}
            </SettingsButtonText>
          </SettingsButton>
          <SettingsButton
            $current={chessSet === "3"}
            onClick={() => handleChessSetChange("3")}
          >
            <SettingsButtonText $current={chessSet === "3"}>
              {t("chess_set_3")}
            </SettingsButtonText>
          </SettingsButton>
          <SettingsButton
            $current={chessSet === "4"}
            onClick={() => handleChessSetChange("4")}
          >
            <SettingsButtonText $current={chessSet === "4"}>
              {t("chess_set_4")}
            </SettingsButtonText>
          </SettingsButton>
        </SettingsButtonsGroup>
      </SettingsContainer>
      <SettingsContainer style={{ marginTop: 16 }}>
        <SettingsTitle>{t(`chess_set_${chessSet}`)}</SettingsTitle>
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
                    {typeof item?.image === "string" ? (
                      <img src={item.image} alt={fig + " white"} height={48} />
                    ) : typeof item?.image === "function" ? (
                      <div style={{ width: 48, height: 48 }}>
                        {item.image({ fill: "#ffffff" })}
                      </div>
                    ) : null}
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
                    {typeof item?.image === "string" ? (
                      <img src={item.image} alt={fig + " black"} height={48} />
                    ) : typeof item?.image === "function" ? (
                      <div style={{ width: 48, height: 48 }}>
                        {item.image({ fill: "#000000" })}
                      </div>
                    ) : null}
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
