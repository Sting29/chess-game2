import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { StyledAccountButton } from "./styles";
import { RootState } from "src/store";

// Import avatar images
import userBoy from "src/assets/avatars/user_boy.png";
import userGirl from "src/assets/avatars/user_girl.png";
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

    switch (user.profile.gender) {
      case "male":
        return userBoy;
      case "female":
        return userGirl;
      default:
        return userX; // For "prefer_not_to_say" and any other cases
    }
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
