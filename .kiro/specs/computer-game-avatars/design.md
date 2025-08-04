# Design Document

## Overview

This feature adds user and teacher avatars to the computer chess game interface by implementing two new React components: `UserAvatar` and `TeacherAvatar`. These components will be positioned on either side of the chess board within the existing `ChessBoardWrapper` component. The user avatar will dynamically reflect the user's personalized avatar selection from their account settings, while the teacher avatar will display a consistent AI opponent representation.

## Architecture

### Component Structure

```
PlayWithComputer
├── ChessBoardWrapper
│   ├── UserAvatar (new)
│   ├── ComputerChessBoard (existing)
│   └── TeacherAvatar (new)
```

### Data Flow

1. **User Avatar**: Retrieves user's avatar selection from Redux store (`settingsSlice`)
2. **Avatar Resolution**: Uses existing `avatarUtils` to convert user's gender/avatar selection to appropriate image
3. **Teacher Avatar**: Uses static teacher avatar image from assets
4. **Responsive Layout**: Avatars positioned using CSS flexbox within `ChessBoardWrapper`

## Components and Interfaces

### UserAvatar Component

**Location**: `src/components/UserAvatar/UserAvatar.tsx`

**Props Interface**:

```typescript
interface UserAvatarProps {
  size?: number; // Optional size override, defaults to 80px
  className?: string; // Optional CSS class
}
```

**Functionality**:

- Connects to Redux store to access user profile data
- Uses `avatarUtils.getAvatarBySelection()` to resolve avatar image
- Falls back to default avatar if user data unavailable
- Handles loading states gracefully
- Supports responsive sizing

### TeacherAvatar Component

**Location**: `src/components/TeacherAvatar/TeacherAvatar.tsx`

**Props Interface**:

```typescript
interface TeacherAvatarProps {
  size?: number; // Optional size override, defaults to 80px
  className?: string; // Optional CSS class
}
```

**Functionality**:

- Displays static teacher avatar image
- Uses `teacher_v2.png` from assets (most recent teacher avatar)
- Supports responsive sizing
- Consistent styling with UserAvatar

### Styled Components

**UserAvatar Styles** (`src/components/UserAvatar/styles.ts`):

```typescript
export const AvatarContainer = styled.div<{ size: number }>`
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f0f0;
`;

export const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
```

**TeacherAvatar Styles** (`src/components/TeacherAvatar/styles.ts`):

- Similar structure to UserAvatar styles
- Consistent visual treatment

### ChessBoardWrapper Layout Updates

**Updated Styles** (`src/pages/PlayWithComputer/styles.ts`):

```typescript
export const ChessBoardWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  margin: 2rem 0;

  @media (max-width: 768px) {
    gap: 1rem;
    margin: 1rem 0;
  }
`;
```

## Data Models

### Redux Store Integration

**Existing State Structure** (no changes needed):

```typescript
// From settingsSlice.ts
interface SettingsState {
  user: User | null;
  // ... other properties
}

interface User {
  profile?: UserProfile;
  // ... other properties
}

interface UserProfile {
  gender?: Gender;
  avatar?: Avatar;
  // ... other properties
}
```

### Avatar Resolution Logic

**Existing Utilities** (leveraged, no changes needed):

```typescript
// From avatarUtils.ts
export const getAvatarBySelection = (
  gender: Gender,
  avatar: Avatar
): string => {
  // Returns appropriate avatar image path
};

export const getDefaultAvatarSelection = (): AvatarSelection => {
  // Returns default avatar when user data unavailable
};
```

## Error Handling

### User Avatar Error Scenarios

1. **No User Data**: Fall back to default avatar using `getDefaultAvatarSelection()`
2. **Invalid Avatar Selection**: Use avatar validation in `avatarUtils`
3. **Image Load Failure**: Display placeholder or fallback image
4. **Network Issues**: Handle gracefully with cached/default avatars

### Teacher Avatar Error Scenarios

1. **Missing Teacher Image**: Fall back to alternative teacher avatar (`teacher_1.png`)
2. **Image Load Failure**: Display text-based placeholder

### Implementation Strategy

```typescript
// Error boundary for avatar components
const AvatarErrorBoundary: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Handle avatar rendering errors gracefully
};

// Image loading error handling
const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
  e.currentTarget.src = fallbackAvatarSrc;
};
```

## Testing Strategy

### Unit Tests

**UserAvatar Component Tests**:

- Renders with user avatar from Redux store
- Falls back to default avatar when no user data
- Handles different gender/avatar combinations
- Responds to size prop changes
- Handles image loading errors

**TeacherAvatar Component Tests**:

- Renders teacher avatar image correctly
- Handles image loading errors
- Responds to size prop changes
- Maintains consistent styling

### Integration Tests

**PlayWithComputer Page Tests**:

- Avatars render in correct positions within ChessBoardWrapper
- Layout remains functional with avatars added
- Responsive behavior works correctly
- Avatars don't interfere with chess board functionality

### Visual Regression Tests

- Screenshot comparisons for different screen sizes
- Avatar positioning verification
- Consistent styling across different user avatar selections

## Responsive Design

### Breakpoint Behavior

**Desktop (>768px)**:

- Avatars: 80px diameter
- Gap between elements: 2rem
- Full avatar visibility

**Tablet (481px - 768px)**:

- Avatars: 60px diameter
- Gap between elements: 1.5rem
- Maintained proportions

**Mobile (≤480px)**:

- Avatars: 50px diameter
- Gap between elements: 1rem
- Compact layout without functionality loss

### Layout Considerations

- Avatars positioned using flexbox for consistent alignment
- Chess board remains centered between avatars
- Minimum touch target sizes maintained on mobile
- Proper spacing prevents accidental interactions

## Accessibility

### ARIA Support

```typescript
// UserAvatar accessibility
<AvatarContainer
  role="img"
  aria-label={t('user_avatar', { name: user?.name || t('player') })}
>

// TeacherAvatar accessibility
<AvatarContainer
  role="img"
  aria-label={t('teacher_avatar')}
>
```

### Keyboard Navigation

- Avatars are decorative, no keyboard interaction needed
- Focus remains on functional game elements
- Screen reader friendly descriptions

### Color Contrast

- Avatar borders provide sufficient contrast
- Fallback text meets WCAG guidelines
- Shadow effects enhance visibility without relying on color alone
