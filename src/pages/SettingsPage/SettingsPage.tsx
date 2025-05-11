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
import { useState } from "react";

function SettingsPage() {
  const { t, i18n } = useTranslation();
  const [chessSet, setChessSet] = useState(1);

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const handleChessSetChange = (set: number) => {
    setChessSet(set);
  };

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
            $current={i18n.language === "he"}
            onClick={() => handleLanguageChange("he")}
          >
            <SettingsLanguageButtonText $current={i18n.language === "he"}>
              עברית
            </SettingsLanguageButtonText>
          </SettingsLanguageButton>
          <SettingsLanguageButton
            $current={i18n.language === "en"}
            onClick={() => handleLanguageChange("en")}
          >
            <SettingsLanguageButtonText $current={i18n.language === "en"}>
              English
            </SettingsLanguageButtonText>
          </SettingsLanguageButton>
          <SettingsLanguageButton
            $current={i18n.language === "ru"}
            onClick={() => handleLanguageChange("ru")}
          >
            <SettingsLanguageButtonText $current={i18n.language === "ru"}>
              Русский
            </SettingsLanguageButtonText>
          </SettingsLanguageButton>
        </SettingsLanguage>
      </SettingsContainer>

      <SettingsContainer>
        <SettingsTitle>{t("select_chess_set")}</SettingsTitle>
        <SettingsLanguage>
          <SettingsLanguageButton
            $current={chessSet === 1}
            onClick={() => handleChessSetChange(1)}
          >
            <SettingsLanguageButtonText $current={chessSet === 1}>
              {t("chess_set_1")}
            </SettingsLanguageButtonText>
          </SettingsLanguageButton>
          <SettingsLanguageButton
            $current={chessSet === 2}
            onClick={() => handleChessSetChange(2)}
          >
            <SettingsLanguageButtonText $current={chessSet === 2}>
              {t("chess_set_2")}
            </SettingsLanguageButtonText>
          </SettingsLanguageButton>
          <SettingsLanguageButton
            $current={chessSet === 3}
            onClick={() => handleChessSetChange(3)}
          >
            <SettingsLanguageButtonText $current={chessSet === 3}>
              {t("chess_set_3")}
            </SettingsLanguageButtonText>
          </SettingsLanguageButton>
          <SettingsLanguageButton
            $current={chessSet === 4}
            onClick={() => handleChessSetChange(4)}
          >
            <SettingsLanguageButtonText $current={chessSet === 4}>
              {t("chess_set_4")}
            </SettingsLanguageButtonText>
          </SettingsLanguageButton>
        </SettingsLanguage>
      </SettingsContainer>

      <p></p>
    </PageContainer>
  );
}

export default SettingsPage;
