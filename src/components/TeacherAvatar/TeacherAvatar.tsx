import React from "react";
import { useTranslation } from "react-i18next";
import { AvatarContainer, AvatarImage } from "./styles";
import teacherAvatarV2 from "src/assets/avatars/teacher_v2.png";
import teacherAvatarV1 from "src/assets/avatars/teacher_1.png";
import AvatarErrorBoundary from "../AvatarErrorBoundary/AvatarErrorBoundary";

interface TeacherAvatarProps {
  width?: number;
  height?: number;
  className?: string;
}

const TeacherAvatar: React.FC<TeacherAvatarProps> = ({
  width = 320,
  height = 400,
  className,
}) => {
  const { t } = useTranslation();
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    // Fallback to teacher_1.png if teacher_v2.png fails to load
    if (e.currentTarget.src.includes("teacher_v2.png")) {
      e.currentTarget.src = teacherAvatarV1;
    } else {
      // If both fail, show a placeholder
      e.currentTarget.style.display = "none";
      const container = e.currentTarget.parentElement;
      if (container) {
        container.innerHTML = "👨‍🏫";
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
        role="img"
        aria-label={t("teacher_avatar")}
      >
        <AvatarImage
          src={teacherAvatarV2}
          alt={t("teacher_avatar")}
          onError={handleImageError}
        />
      </AvatarContainer>
    </AvatarErrorBoundary>
  );
};

export default TeacherAvatar;
