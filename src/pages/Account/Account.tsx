import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
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
import { RootState, AppDispatch } from "src/store";
import {
  loadUserProfile,
  updateAvatarAndGenderAsync,
  updateUserProfileAsync,
} from "src/store/settingsSlice";
import { Gender, Avatar } from "src/api";
import { getDefaultAvatarSelection } from "src/utils/avatarUtils";
// import ShowProgressButton from "src/components/ShowProgressButton/ShowProgressButton";

function Account() {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  // Get user data from Redux store
  const user = useSelector((state: RootState) => state.settings.user);
  // Removed loading selector as per loader refactoring requirements

  // Form fields state
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [level] = useState(1);

  // Load user profile on component mount
  useEffect(() => {
    if (!user) {
      dispatch(loadUserProfile());
    }
  }, [dispatch, user]);

  // Sync form fields with user data when user changes
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setAge(user.profile?.age?.toString() || "");
    }
  }, [user]);

  // Get current avatar selection from user profile or defaults
  const getCurrentAvatarSelection = (): { gender: Gender; avatar: Avatar } => {
    if (user?.profile?.gender && user?.profile?.avatar) {
      return {
        gender: user.profile.gender as Gender,
        avatar: user.profile.avatar,
      };
    }
    return getDefaultAvatarSelection();
  };

  const handleAvatarChange = async (gender: Gender, avatar: Avatar) => {
    try {
      await dispatch(updateAvatarAndGenderAsync({ gender, avatar })).unwrap();
    } catch (error) {
      console.error("Failed to update avatar:", error);
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
        await dispatch(updateUserProfileAsync({ name })).unwrap();
      } catch (error) {
        console.error("Failed to update name:", error);
        // Revert on error
        setName(user?.name || "");
      }
    }
  };

  const handleAgeBlur = async () => {
    const ageNumber = parseInt(age);
    const currentAge = user?.profile?.age;

    if (!isNaN(ageNumber) && ageNumber !== currentAge) {
      try {
        await dispatch(
          updateUserProfileAsync({
            profile: { age: ageNumber },
          })
        ).unwrap();
      } catch (error) {
        console.error("Failed to update age:", error);
        // Revert on error
        setAge(currentAge?.toString() || "");
      }
    }
  };

  // Removed loading state display as per loader refactoring requirements
  // Only login and logout operations should show loading indicators
  if (!user) {
    return (
      <PageContainer>
        <PageTitle title={t("account_settings")} />
        <div>Loading user profile...</div>
      </PageContainer>
    );
  }

  const { gender, avatar } = getCurrentAvatarSelection();

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
            initialGender={gender}
            initialAvatar={avatar}
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
              disabled={false}
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
              disabled={false}
            />
          </InputField>

          <InputField>
            <InputLabel>{t("level")}</InputLabel>
            <LevelSelector>
              <TrophyIcon />
              {t("level")} {level}
            </LevelSelector>
          </InputField>
          {/* <ShowProgressButton /> */}
        </SettingsForm>
      </AccountSettingsContainer>
    </PageContainer>
  );
}

export default Account;
