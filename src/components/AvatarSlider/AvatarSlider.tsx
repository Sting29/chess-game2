import { useState, useEffect } from "react";
import {
  AvatarSliderContainer,
  AvatarDisplay,
  BarrelImage,
  AvatarImage,
  ArrowButtonLeft,
  ArrowButtonRight,
} from "./styles";

// Import images and utilities
import barrelImage from "src/assets/images/barrel.png";
import {
  avatars,
  Gender,
  Avatar,
  indexToAvatarSelection,
  avatarSelectionToIndex,
  getDefaultAvatarSelection,
} from "src/utils/avatarUtils";

interface AvatarSliderProps {
  initialGender?: Gender;
  initialAvatar?: Avatar;
  onAvatarChange?: (gender: Gender, avatar: Avatar) => void;
}

function AvatarSlider({
  initialGender,
  initialAvatar,
  onAvatarChange,
}: AvatarSliderProps) {
  // Initialize with provided gender/avatar or defaults
  const getInitialIndex = (): number => {
    if (initialGender && initialAvatar) {
      return avatarSelectionToIndex(initialGender, initialAvatar);
    }
    const defaultSelection = getDefaultAvatarSelection();
    return avatarSelectionToIndex(
      defaultSelection.gender,
      defaultSelection.avatar
    );
  };

  const [currentAvatarIndex, setCurrentAvatarIndex] = useState(
    getInitialIndex()
  );

  // Update index when props change
  useEffect(() => {
    if (initialGender && initialAvatar) {
      const newIndex = avatarSelectionToIndex(initialGender, initialAvatar);
      setCurrentAvatarIndex(newIndex);
    }
  }, [initialGender, initialAvatar]);

  const handleAvatarChange = (newIndex: number) => {
    setCurrentAvatarIndex(newIndex);
    const selection = indexToAvatarSelection(newIndex);
    onAvatarChange?.(selection.gender, selection.avatar);
  };

  const handlePreviousAvatar = () => {
    const newIndex =
      currentAvatarIndex === 0 ? avatars.length - 1 : currentAvatarIndex - 1;
    handleAvatarChange(newIndex);
  };

  const handleNextAvatar = () => {
    const newIndex =
      currentAvatarIndex === avatars.length - 1 ? 0 : currentAvatarIndex + 1;
    handleAvatarChange(newIndex);
  };

  return (
    <AvatarSliderContainer>
      <ArrowButtonLeft onClick={handlePreviousAvatar} />

      <AvatarDisplay>
        <BarrelImage src={barrelImage} alt="Barrel" />
        <AvatarImage src={avatars[currentAvatarIndex]} alt="Character Avatar" />
      </AvatarDisplay>

      <ArrowButtonRight onClick={handleNextAvatar} />
    </AvatarSliderContainer>
  );
}

export default AvatarSlider;
