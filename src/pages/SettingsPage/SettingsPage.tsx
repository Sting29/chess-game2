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
import { useState } from "react";

function SettingsPage() {
  const [language, setLanguage] = useState("en");

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
  };

  return (
    <PageContainer>
      <PageTitle title="Settings" />
      <BackButtonWrap>
        <BackButtonImage linkToPage="-1" />
      </BackButtonWrap>
      <SettingsContainer>
        <SettingsTitle>Select Language</SettingsTitle>
        <SettingsLanguage>
          <SettingsLanguageButton
            current={language === "en"}
            onClick={() => handleLanguageChange("en")}
          >
            English
          </SettingsLanguageButton>
          <SettingsLanguageButton
            current={language === "he"}
            onClick={() => handleLanguageChange("he")}
          >
            Hebrew
          </SettingsLanguageButton>
          <SettingsLanguageButton
            current={language === "ru"}
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
