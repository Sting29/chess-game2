import { PageTitle } from "src/components/PageTitle/PageTitle";
import {
  PageContainer,
  SettingsContainer,
  SettingsTitle,
  SettingsLanguage,
  SettingsLanguageButton,
} from "./styles";
import BackButtonImage from "src/components/BackButtonImage/BackButtonImage";
import { BackButtonWrap } from "src/components/BackButtonImage/styles";
import { useTranslation } from "react-i18next";

function SettingsPage() {
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
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
            current={i18n.language === "en"}
            onClick={() => handleLanguageChange("en")}
          >
            English
          </SettingsLanguageButton>
          <SettingsLanguageButton
            current={i18n.language === "he"}
            onClick={() => handleLanguageChange("he")}
          >
            Hebrew
          </SettingsLanguageButton>
          <SettingsLanguageButton
            current={i18n.language === "ru"}
            onClick={() => handleLanguageChange("ru")}
          >
            Russian
          </SettingsLanguageButton>
        </SettingsLanguage>
      </SettingsContainer>
    </PageContainer>
  );
}

export default SettingsPage;
