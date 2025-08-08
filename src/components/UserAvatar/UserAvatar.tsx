import React from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { RootState } from "src/store";
import {
  getAvatarBySelection,
  getDefaultAvatarSelection,
} from "src/utils/avatarUtils";
import { AvatarContainer, AvatarImage } from "./styles";
import AvatarErrorBoundary from "../AvatarErrorBoundary/AvatarErrorBoundary";

interface UserAvatarProps {
  width?: number;
  height?: number;
  className?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({
  width = 240,
  height = 300,
  className,
}) => {
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.settings.user);

  // Get user's avatar selection or use default
  const avatarSelection = React.useMemo(() => {
    if (user?.profile?.gender && user?.profile?.avatar) {
      return {
        gender: user.profile.gender,
        avatar: user.profile.avatar,
      };
    }
    return getDefaultAvatarSelection();
  }, [user?.profile?.gender, user?.profile?.avatar]);

  // Get the avatar image source
  const avatarSrc = React.useMemo(() => {
    return getAvatarBySelection(avatarSelection.gender, avatarSelection.avatar);
  }, [avatarSelection]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    // Fallback to default avatar if image fails to load
    const currentSrc = e.currentTarget.src;
    const defaultSelection = getDefaultAvatarSelection();
    const defaultSrc = getAvatarBySelection(
      defaultSelection.gender,
      defaultSelection.avatar
    );

    // Only change src if it's not already the default to prevent infinite loop
    if (!currentSrc.includes(defaultSrc)) {
      e.currentTarget.src = defaultSrc;
    } else {
      // If even default fails, show placeholder
      e.currentTarget.style.display = "none";
      const container = e.currentTarget.parentElement;
      if (container) {
        container.innerHTML = "👤";
        container.style.fontSize = `${height * 0.5}px`;
        container.style.color = "#666";
      }
    }
  };

  return (
    <AvatarErrorBoundary>
      <AvatarContainer
        width={width}
        height={height}
        className={className}
        aria-label={t("user_avatar", { name: user?.name || t("player") })}
      >
        <AvatarImage
          src={avatarSrc}
          alt={t("user_avatar")}
          onError={handleImageError}
        />
      </AvatarContainer>
    </AvatarErrorBoundary>
  );
};

export default UserAvatar;
