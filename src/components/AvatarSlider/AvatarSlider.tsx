import { useState } from "react";
import {
  AvatarSliderContainer,
  AvatarDisplay,
  BarrelImage,
  AvatarImage,
  ArrowButtonLeft,
  ArrowButtonRight,
} from "./styles";
import barrelImage from "../../assets/images/barrel.png";
// Import images
import boySet1 from "../../assets/avatars/boy_set_1.png";
import boySet2 from "../../assets/avatars/boy_set_2.png";
import boySet3 from "../../assets/avatars/boy_set_3.png";
import girlSet1 from "../../assets/avatars/girl_set_1.png";
import girlSet2 from "../../assets/avatars/girl_set_2.png";
import girlSet3 from "../../assets/avatars/girl_set_3.png";
import { useTranslation } from "react-i18next";

const avatars = [boySet1, boySet2, boySet3, girlSet1, girlSet2, girlSet3];

interface AvatarSliderProps {
  initialAvatarIndex?: number;
  onAvatarChange?: (avatarIndex: number) => void;
}

function AvatarSlider({
  initialAvatarIndex = 0,
  onAvatarChange,
}: AvatarSliderProps) {
  const [currentAvatarIndex, setCurrentAvatarIndex] =
    useState(initialAvatarIndex);
  const { t } = useTranslation();

  const handlePreviousAvatar = () => {
    const newIndex =
      currentAvatarIndex === 0 ? avatars.length - 1 : currentAvatarIndex - 1;
    setCurrentAvatarIndex(newIndex);
    onAvatarChange?.(newIndex);
  };

  const handleNextAvatar = () => {
    const newIndex =
      currentAvatarIndex === avatars.length - 1 ? 0 : currentAvatarIndex + 1;
    setCurrentAvatarIndex(newIndex);
    onAvatarChange?.(newIndex);
  };

  return (
    <AvatarSliderContainer>
      <ArrowButtonLeft
        onClick={handlePreviousAvatar}
        aria-label={t("previous")}
      />

      <AvatarDisplay>
        <AvatarImage src={avatars[currentAvatarIndex]} alt="Character Avatar" />
        <BarrelImage src={barrelImage} alt="Barrel" />
      </AvatarDisplay>

      <ArrowButtonRight onClick={handleNextAvatar} aria-label={t("next")} />
    </AvatarSliderContainer>
  );
}

export default AvatarSlider;
