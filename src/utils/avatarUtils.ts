// Import images
import boySet1 from "src/assets/avatars/boy_set_1.png";
import boySet2 from "src/assets/avatars/boy_set_2.png";
import boySet3 from "src/assets/avatars/boy_set_3.png";
import girlSet1 from "src/assets/avatars/girl_set_1.png";
import girlSet2 from "src/assets/avatars/girl_set_2.png";
import girlSet3 from "src/assets/avatars/girl_set_3.png";

export const avatars = [
  boySet1, // index 0: male, avatar1
  boySet2, // index 1: male, avatar2
  boySet3, // index 2: male, avatar3
  girlSet1, // index 3: female, avatar1
  girlSet2, // index 4: female, avatar2
  girlSet3, // index 5: female, avatar3
];

export type Gender = "male" | "female" | "prefer_not_to_say";
export type Avatar = "avatar1" | "avatar2" | "avatar3";

export interface AvatarSelection {
  gender: Gender;
  avatar: Avatar;
}

// Convert index to gender and avatar
export const indexToAvatarSelection = (index: number): AvatarSelection => {
  if (index >= 0 && index <= 2) {
    return {
      gender: "male",
      avatar: `avatar${index + 1}` as Avatar,
    };
  } else if (index >= 3 && index <= 5) {
    return {
      gender: "female",
      avatar: `avatar${index - 2}` as Avatar,
    };
  }

  // Default to male avatar1
  return {
    gender: "male",
    avatar: "avatar1",
  };
};

// Convert gender and avatar to index
export const avatarSelectionToIndex = (
  gender: Gender,
  avatar: Avatar
): number => {
  const avatarNumber = parseInt(avatar.replace("avatar", "")) - 1;

  if (gender === "male") {
    return Math.max(0, Math.min(2, avatarNumber));
  } else if (gender === "female") {
    return Math.max(3, Math.min(5, avatarNumber + 3));
  }

  // Default to index 0 (male, avatar1) for prefer_not_to_say
  return 0;
};

// Get avatar image by index
export const getAvatarByIndex = (index: number): string => {
  return avatars[Math.max(0, Math.min(avatars.length - 1, index))];
};

// Get avatar image by gender and avatar
export const getAvatarBySelection = (
  gender: Gender,
  avatar: Avatar
): string => {
  const index = avatarSelectionToIndex(gender, avatar);
  return getAvatarByIndex(index);
};

// Default avatar selection
export const getDefaultAvatarSelection = (): AvatarSelection => ({
  gender: "male",
  avatar: "avatar1",
});

// Get default avatar index
export const getDefaultAvatarIndex = (): number => 0;
