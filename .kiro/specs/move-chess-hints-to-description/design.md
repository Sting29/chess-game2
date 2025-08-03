# Design Document

## Overview

This design outlines the refactoring of threat warning hints from the `ComputerChessBoard` component to the `Description` component in the `PlayWithComputer` page. The refactoring will improve separation of concerns while maintaining all existing functionality.

## Architecture

### Current Architecture

- `ComputerChessBoard` handles both game logic and hint display
- Threat warnings are rendered directly within the chess board component
- The `Description` component in `PlayWithComputer` is currently empty

### Target Architecture

- `ComputerChessBoard` focuses on game logic and visual board highlighting
- `PlayWithComputer` acts as a coordinator between chess board and description
- `Description` component handles all textual hints and warnings
- Communication flows from chess board → parent → description component

## Components and Interfaces

### ComputerChessBoard Component Changes

**New Props Interface:**

```typescript
interface ComputerChessBoardProps {
  settings: GameEngineSettings;
  uiSettings: GameUISettings;
  onGameEnd?: (result: string) => void;
  onThreatsChange?: (threats: ThreatInfo) => void; // New prop
  showHints?: boolean; // New prop to control hints from parent
}

interface ThreatInfo {
  threatSquares: Square[];
  showHints: boolean;
  kidsMode: boolean;
}
```

**Removed Elements:**

- Threat warning panel JSX (lines 468-475)
- Direct rendering of threat messages

**Modified Elements:**

- Add `onThreatsChange` callback invocation when threats are detected
- Keep visual highlighting logic unchanged
- Remove hint toggle button (moved to parent component)
- Accept `showHints` prop from parent instead of managing internal state

### PlayWithComputer Component Changes

**New State:**

```typescript
const [threatInfo, setThreatInfo] = useState<ThreatInfo>({
  threatSquares: [],
  showHints: false,
  kidsMode: false,
});
```

**New Handler:**

```typescript
const handleThreatsChange = (threats: ThreatInfo) => {
  setThreatInfo(threats);
};
```

**Modified QuestionButton Logic:**

```typescript
const handleQuestionButtonClick = () => {
  const newShowSideContent = !showSideContent;
  setShowSideContent(newShowSideContent);

  // In kids mode, also control hints visibility
  if (difficultyConfig.engineSettings.kidsMode) {
    setThreatInfo((prev) => ({
      ...prev,
      showHints: newShowSideContent,
    }));
  }
};
```

**Modified Description Usage:**

```typescript
<Description title="" hints={generateHints(threatInfo)} />
```

### Description Component Changes

**Enhanced Props Interface:**

```typescript
interface DescriptionProps {
  title: string;
  hints: string[];
}
```

**No structural changes needed** - the component already supports dynamic hints array.

## Data Models

### ThreatInfo Interface

```typescript
interface ThreatInfo {
  threatSquares: Square[]; // Array of squares under threat
  showHints: boolean; // Whether hints should be displayed
  kidsMode: boolean; // Whether kids mode is active
}
```

### Hint Generation Logic

```typescript
function generateHints(threatInfo: ThreatInfo): string[] {
  if (
    !threatInfo.kidsMode ||
    !threatInfo.showHints ||
    threatInfo.threatSquares.length === 0
  ) {
    return [];
  }

  const hints = [];

  if (threatInfo.threatSquares.length === 1) {
    hints.push("⚠️ ОСТОРОЖНО!");
    hints.push(
      "Твоя фигура под атакой! Защити её или убери в безопасное место."
    );
  } else {
    hints.push("⚠️ ОСТОРОЖНО!");
    hints.push(
      `${threatInfo.threatSquares.length} твоих фигур под атакой! Будь осторожен!`
    );
  }

  return hints;
}
```

## Error Handling

### Callback Safety

- Check if `onThreatsChange` callback exists before calling
- Provide default empty function if callback is undefined
- Handle cases where parent component doesn't need threat information

### State Synchronization

- Ensure threat information is updated when game state changes
- Clear threat information when component unmounts
- Handle rapid state changes without causing performance issues

### Fallback Behavior

- If threat detection fails, continue game without hints
- If Description component fails to render, don't break the game
- Maintain existing visual highlighting even if callback fails

## Testing Strategy

### Unit Tests

- Test `generateHints` function with various threat scenarios
- Test `ComputerChessBoard` callback invocation
- Test `PlayWithComputer` state management
- Test `Description` component with dynamic hints

### Integration Tests

- Test complete flow from threat detection to hint display
- Test kids mode toggle affecting both visual and textual hints
- Test game state changes updating hints correctly
- Test component unmounting and remounting

### Manual Testing Scenarios

1. Start game in kids mode with hints enabled - verify threats appear in description
2. Toggle hints off - verify both visual and textual hints disappear
3. Toggle hints on - verify both types of hints reappear
4. Play moves that create/remove threats - verify description updates
5. Switch between kids and normal mode - verify appropriate behavior
6. Test with single threat vs multiple threats - verify correct messaging

## Implementation Notes

### Internationalization

- Keep existing Russian text for now to maintain consistency
- Consider adding i18n keys in future enhancement
- Ensure hint messages match existing translation patterns

### Performance Considerations

- Minimize re-renders by using useCallback for threat handler
- Only update description when threat information actually changes
- Avoid creating new objects on every render

### Accessibility

- Maintain existing ARIA labels and accessibility features
- Ensure screen readers can access threat information in description
- Consider adding role="alert" for urgent threat warnings

### Styling Consistency

- Use existing Description component styling
- Maintain visual consistency with current threat warning appearance
- Consider adding special styling for threat-related hints
