import { useState, useEffect } from "react";
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
import userService from "src/services/userService";
import { User } from "src/services/types";
import {
  Gender,
  Avatar,
  getDefaultAvatarSelection,
} from "src/utils/avatarUtils";

function Account() {
  const { t } = useTranslation();

  // State for user data
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Avatar state
  const [selectedGender, setSelectedGender] = useState<Gender>("male");
  const [selectedAvatar, setSelectedAvatar] = useState<Avatar>("avatar1");

  // Form fields state
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [level] = useState(1);

  // Load user profile on component mount
  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const userData = await userService.getProfile();
      setUser(userData);

      // Set avatar data from profile or defaults
      const profile = userData.profile;
      if (profile?.gender && profile?.avatar) {
        setSelectedGender(profile.gender as Gender);
        setSelectedAvatar(profile.avatar);
      } else {
        // Set defaults
        const defaultSelection = getDefaultAvatarSelection();
        setSelectedGender(defaultSelection.gender);
        setSelectedAvatar(defaultSelection.avatar);
      }

      // Set form fields
      setName(userData.name || "");
      setAge(profile?.age?.toString() || "");
    } catch (error) {
      console.error("Failed to load user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = async (gender: Gender, avatar: Avatar) => {
    try {
      setSaving(true);
      setSelectedGender(gender);
      setSelectedAvatar(avatar);

      // Save to API
      await userService.updateAvatarAndGender(gender, avatar);
    } catch (error) {
      console.error("Failed to update avatar:", error);
      // Revert on error
      if (user?.profile?.gender && user?.profile?.avatar) {
        setSelectedGender(user.profile.gender as Gender);
        setSelectedAvatar(user.profile.avatar);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAge(e.target.value);
  };

  const handleNameBlur = async () => {
    if (name !== (user?.name || "")) {
      try {
        setSaving(true);
        await userService.updateBasicInfo({ name });
        // Reload profile to get updated data
        await loadUserProfile();
      } catch (error) {
        console.error("Failed to update name:", error);
        // Revert on error
        setName(user?.name || "");
      } finally {
        setSaving(false);
      }
    }
  };

  const handleAgeBlur = async () => {
    const ageNumber = parseInt(age);
    const currentAge = user?.profile?.age;

    if (!isNaN(ageNumber) && ageNumber !== currentAge) {
      try {
        setSaving(true);
        await userService.updatePersonalInfo({ age: ageNumber });
        // Reload profile to get updated data
        await loadUserProfile();
      } catch (error) {
        console.error("Failed to update age:", error);
        // Revert on error
        setAge(currentAge?.toString() || "");
      } finally {
        setSaving(false);
      }
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <PageTitle title={t("account_settings")} />
        <div>Loading...</div>
      </PageContainer>
    );
  }

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
            initialGender={selectedGender}
            initialAvatar={selectedAvatar}
            onAvatarChange={handleAvatarChange}
          />
        </AvatarSection>

        <SettingsForm>
          <InputField>
            <InputLabel>{t("name")}</InputLabel>
            <StyledInput
              type="text"
              value={name}
              onChange={handleNameChange}
              onBlur={handleNameBlur}
              placeholder={t("name")}
              disabled={saving}
            />
          </InputField>

          <InputField>
            <InputLabel>{t("age")}</InputLabel>
            <StyledInput
              type="number"
              value={age}
              onChange={handleAgeChange}
              onBlur={handleAgeBlur}
              placeholder={t("age")}
              min="1"
              max="100"
              disabled={saving}
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
