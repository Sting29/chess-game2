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
        <SettingsButtonsGroup>
          <SettingsButton
            $current={language === "he"}
            onClick={() => handleLanguageChange("he")}
          >
            <SettingsButtonText $current={language === "he"}>
              עברית
            </SettingsButtonText>
          </SettingsButton>
          <SettingsButton
            $current={language === "en"}
            onClick={() => handleLanguageChange("en")}
          >
            <SettingsButtonText $current={language === "en"}>
              English
            </SettingsButtonText>
          </SettingsButton>
          <SettingsButton
            $current={language === "ar"}
            onClick={() => handleLanguageChange("ar")}
          >
            <SettingsButtonText $current={language === "ar"}>
              العربية
            </SettingsButtonText>
          </SettingsButton>
          <SettingsButton
            $current={language === "ru"}
            onClick={() => handleLanguageChange("ru")}
          >
            <SettingsButtonText $current={language === "ru"}>
              Русский
            </SettingsButtonText>
          </SettingsButton>
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
          {/* <SettingsButton
            $current={chessSet === "4"}
            onClick={() => handleChessSetChange("4")}
          >
              <SettingsButtonText $current={chessSet === "4"}>
              {t("chess_set_4")}
            </SettingsButtonText>
          </SettingsButton> */}
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
