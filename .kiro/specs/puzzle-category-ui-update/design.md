# Design Document

## Overview

This design transforms the PuzzleCategory page from a simple list layout to an interactive visual experience using a treasure map theme. The new design features numbered stones positioned along a winding path, with different visual states for puzzle progress, pagination controls, and decorative elements that create an immersive gaming experience.

## Architecture

### Component Structure

The updated PuzzleCategory component will maintain the existing React functional component pattern while introducing new styled components for the visual elements:

```
PuzzleCategory/
├── PuzzleCategory.tsx (updated)
├── styles.ts (new)
└── components/
    ├── PuzzleStone.tsx (new)
    ├── NavigationButton.tsx (new)
    └── DecorativeElement.tsx (new)
```

### State Management

The component will use React hooks for local state management:

- `useState` for current page tracking (0-based index)
- `useMemo` for calculating visible puzzles based on current page
- Existing `useParams`, `useLocation`, and `useTranslation` hooks

## Components and Interfaces

### 1. PuzzleStone Component

**Purpose**: Renders individual puzzle stones with different states

**Props Interface**:

```typescript
interface PuzzleStoneProps {
  puzzle: Puzzle;
  puzzleNumber: number;
  state: "completed" | "available" | "locked";
  position: { x: number; y: number };
  onClick: () => void;
}
```

**Visual States**:

- **Completed**: Stone with white checkmark in green circle (20x20px) in upper left corner (puzzles 1-2)
- **Available**: Normal stone appearance with white number text using RubikOne font, 20px, bold (puzzles 3-4)
- **Locked**: Stone with lock overlay (puzzles 5+)

### 2. NavigationButton Component

**Purpose**: Handles pagination between puzzle sets

**Props Interface**:

```typescript
interface NavigationButtonProps {
  direction: "forward" | "backward";
  disabled: boolean;
  onClick: () => void;
}
```

**Implementation Details**:

- Uses `src/assets/elements/button_slide.png` as base image
- Flips image horizontally for backward direction using CSS transform: scaleX(-1)

### 3. DecorativeElement Component

**Purpose**: Renders themed decorative elements (anchor, compass, stones)

**Props Interface**:

```typescript
interface DecorativeElementProps {
  type: "anchor" | "compass" | "stone_left" | "stone_right";
  position: { x: number; y: number };
}
```

## Data Models

### Stone Position Configuration

```typescript
interface StonePosition {
  x: number; // percentage from left
  y: number; // percentage from top
}

// Predefined positions following the S-curve path
const STONE_POSITIONS: StonePosition[] = [
  { x: 25, y: 35 }, // Stone 1
  { x: 20, y: 50 }, // Stone 2
  { x: 25, y: 65 }, // Stone 3
  { x: 35, y: 75 }, // Stone 4
  { x: 50, y: 80 }, // Stone 5
  { x: 65, y: 75 }, // Stone 6
  { x: 75, y: 65 }, // Stone 7
  { x: 80, y: 50 }, // Stone 8
  { x: 75, y: 35 }, // Stone 9
  { x: 65, y: 25 }, // Stone 10
];
```

### Puzzle State Logic

```typescript
const getPuzzleState = (
  puzzleIndex: number
): "completed" | "available" | "locked" => {
  if (puzzleIndex < 2) return "completed"; // Puzzles 1-2
  if (puzzleIndex < 4) return "available"; // Puzzles 3-4
  return "locked"; // Puzzles 5+
};
```

## Styling Architecture

### Main Container Styles

```typescript
export const PuzzleMapContainer = styled.div`
  position: relative;
  width: 100%;
  height: calc(100vh - 96px);
  background-image: url(${backgroundPuzzles});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  overflow: hidden;
`;
```

### Stone Positioning System

```typescript
export const StoneWrapper = styled.div<{ position: StonePosition }>`
  position: absolute;
  left: ${(props) => props.position.x}%;
  top: ${(props) => props.position.y}%;
  transform: translate(-50%, -50%);
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: translate(-50%, -50%) scale(1.1);
  }
`;
```

### Responsive Design

```typescript
// Mobile adjustments
@media (max-width: 768px) {
  .stone-wrapper {
    transform: translate(-50%, -50%) scale(0.8);
  }

  .navigation-button {
    bottom: 20px;
    width: 60px;
    height: 60px;
  }
}
```

## Asset Integration

### Background Images

- **Main Background**: `src/assets/background/puzzles/puzzle_5/background_puzzles.png`
- **Stone Variants**: `src/assets/background/puzzles/common/stone_1.png`, `stone_2.png`, `stone_3.png`
- **Lock Overlay**: `src/assets/background/puzzles/common/stone-lock.png`
- **Navigation Button**: `src/assets/elements/button_slide.png`

### Decorative Elements

- **Anchor**: `src/assets/background/puzzles/puzzle_5/anchor.png` (top-right)
- **Compass**: `src/assets/background/puzzles/common/compass.png` (bottom-right)
- **Side Stones**: `stone_left.png`, `stone_right.png` (left and right edges)

### Typography

- **Stone Numbers**: RubikOne font, 20px, bold, white color
- **Checkmark Overlay**: White checkmark in green circle (20x20px) positioned in upper left corner

## Pagination Logic

### Page Calculation

```typescript
const PUZZLES_PER_PAGE = 10;
const totalPages = Math.ceil(category.puzzles.length / PUZZLES_PER_PAGE);
const currentPagePuzzles = category.puzzles.slice(
  currentPage * PUZZLES_PER_PAGE,
  (currentPage + 1) * PUZZLES_PER_PAGE
);
```

### Navigation Controls

- **Forward Button**: Visible when `currentPage < totalPages - 1`
- **Backward Button**: Visible when `currentPage > 0`
- **Position**: Bottom center of the screen

## Error Handling

### Missing Assets

- Fallback to default stone image if specific stone variant not found
- Graceful degradation if decorative elements fail to load
- Error boundaries around stone rendering

### Invalid Puzzle Data

- Display error message if category not found
- Handle empty puzzle arrays gracefully
- Validate puzzle IDs before navigation

## Testing Strategy

### Unit Tests

- Stone position calculations
- Puzzle state determination logic
- Pagination calculations
- Component prop validation

### Integration Tests

- Navigation between pages
- Stone click interactions
- Responsive behavior testing
- Asset loading verification

### Visual Regression Tests

- Stone positioning accuracy
- Layout consistency across screen sizes
- Hover and interaction states
- Cross-browser compatibility

## Performance Considerations

### Image Optimization

- Preload critical background images
- Lazy load decorative elements
- Use appropriate image formats and sizes
- Implement image caching strategies

### Rendering Optimization

- Memoize stone position calculations
- Use React.memo for stone components
- Optimize re-renders during pagination
- Implement virtual scrolling if needed for large puzzle sets

## Accessibility

### Keyboard Navigation

- Tab order through stones in numerical sequence
- Enter/Space key activation for stones
- Arrow key navigation between stones
- Focus indicators for all interactive elements

### Screen Reader Support

- ARIA labels for stone states
- Descriptive text for puzzle numbers
- Navigation button descriptions
- Progress indicators

### Visual Accessibility

- High contrast mode support
- Scalable text and UI elements
- Color-blind friendly state indicators
- Reduced motion preferences
