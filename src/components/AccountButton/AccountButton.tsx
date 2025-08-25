import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { StyledAccountButton } from "./styles";
import { RootState } from "src/store";

// Import avatar images
import boyAvatar1 from "src/assets/avatars/boy_avatar_1.png";
import boyAvatar2 from "src/assets/avatars/boy_avatar_2.png";
import boyAvatar3 from "src/assets/avatars/boy_avatar_3.png";
import boyAvatar4 from "src/assets/avatars/boy_avatar_4.png";
import girlAvatar1 from "src/assets/avatars/girl_avatar_1.png";
import girlAvatar2 from "src/assets/avatars/girl_avatar_2.png";
import girlAvatar3 from "src/assets/avatars/girl_avatar_3.png";
import girlAvatar4 from "src/assets/avatars/girl_avatar_4.png";
import userX from "src/assets/avatars/user_x.png";

interface AccountButtonProps {
  className?: string;
}

function AccountButton({ className }: AccountButtonProps) {
  const { t, i18n } = useTranslation();
  const user = useSelector((state: RootState) => state.settings.user);
  // Determine which avatar to show based on gender
  const getAvatarImage = (): string => {
    if (!user?.profile?.gender) {
      return userX; // Default for no gender set
    }

    if (user.profile.gender === "male") {
      if (user.profile.avatar === "avatar1") {
        return boyAvatar1;
      } else if (user.profile.avatar === "avatar2") {
        return boyAvatar2;
      } else if (user.profile.avatar === "avatar3") {
        return boyAvatar3;
      } else if (user.profile.avatar === "avatar4") {
        return boyAvatar4;
      }
    } else if (user.profile.gender === "female") {
      if (user.profile.avatar === "avatar1") {
        return girlAvatar1;
      } else if (user.profile.avatar === "avatar2") {
        return girlAvatar2;
      } else if (user.profile.avatar === "avatar3") {
        return girlAvatar3;
      } else if (user.profile.avatar === "avatar4") {
        return girlAvatar4;
      }
    }

    return userX; // Default fallback
  };

  return (
    <StyledAccountButton
      to="/account"
      $isHebrew={i18n.language === "he"}
      $avatarSrc={getAvatarImage()}
      className={className}
    >
      {t("layout_account_settings")}
    </StyledAccountButton>
  );
}

export default AccountButton;
