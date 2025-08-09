import React from "react";
import { useTranslation } from "react-i18next";
import { AvatarContainer, AvatarImage } from "./styles";
import teacherAvatarAdult from "src/assets/avatars/teacher_adult.png";
import AvatarErrorBoundary from "../AvatarErrorBoundary/AvatarErrorBoundary";

export interface TeacherAvatarProps {
  width?: number;
  height?: number;
  className?: string;
  avatarSrc?: string;
}

const TeacherAvatar: React.FC<TeacherAvatarProps> = ({
  width = 320,
  height = 400,
  className,
  avatarSrc,
}) => {
  const { t } = useTranslation();
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    // Show emoji placeholder if image fails to load
    e.currentTarget.style.display = "none";
    const container = e.currentTarget.parentElement;
    if (container) {
      container.innerHTML = "👨‍🏫";
      container.style.fontSize = `${height * 0.5}px`;
      container.style.color = "#666";
    }
  };

  return (
    <AvatarErrorBoundary>
      <AvatarContainer
        width={width}
        height={height}
        className={className}
        aria-label={t("teacher_avatar")}
      >
        <AvatarImage
          src={avatarSrc || teacherAvatarAdult}
          alt={t("teacher_avatar")}
          onError={handleImageError}
        />
      </AvatarContainer>
    </AvatarErrorBoundary>
  );
};

export default TeacherAvatar;
