import { useState } from "react";
import { BackButtonWrap } from "src/components/BackButtonImage/styles";
import {
  AccountSettingsContainer,
  PageContainer,
  AvatarSection,
  SettingsForm,
  InputField,
  InputLabel,
  StyledInput,
  LevelSelector,
  TrophyIcon,
} from "./styles";
import { useTranslation } from "react-i18next";
import { PageTitle } from "src/components/PageTitle/PageTitle";
import BackButtonImage from "src/components/BackButtonImage/BackButtonImage";
import ButtonEdit from "src/components/ButtonEdit/ButtonEdit";
import { EditButtonWrap } from "src/components/ButtonEdit/styles";
import AvatarSlider from "src/components/AvatarSlider/AvatarSlider";

function Account() {
  const { t } = useTranslation();
  const [selectedAvatarIndex, setSelectedAvatarIndex] = useState(0);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [level] = useState(1);

  const handleAvatarChange = (avatarIndex: number) => {
    setSelectedAvatarIndex(avatarIndex);
  };

  return (
    <PageContainer>
      <PageTitle title={t("account_settings")} />
      <BackButtonWrap>
        <BackButtonImage linkToPage="-1" />
      </BackButtonWrap>
      <EditButtonWrap>
        <ButtonEdit />
      </EditButtonWrap>

      <AccountSettingsContainer>
        <AvatarSection>
          <AvatarSlider
            initialAvatarIndex={selectedAvatarIndex}
            onAvatarChange={handleAvatarChange}
          />
        </AvatarSection>

        <SettingsForm>
          <InputField>
            <InputLabel>{t("name")}</InputLabel>
            <StyledInput
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("name")}
            />
          </InputField>

          <InputField>
            <InputLabel>{t("age")}</InputLabel>
            <StyledInput
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder={t("age")}
              min="1"
              max="100"
            />
          </InputField>

          <InputField>
            <InputLabel>{t("level")}</InputLabel>
            <LevelSelector>
              <TrophyIcon />
              {t("level")} {level}
            </LevelSelector>
          </InputField>
        </SettingsForm>
      </AccountSettingsContainer>
    </PageContainer>
  );
}

export default Account;
