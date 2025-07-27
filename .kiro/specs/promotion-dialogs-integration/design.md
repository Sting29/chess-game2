# Design Document

## Overview

This design outlines the integration of promotion dialogs across all chess board components in the application. Currently, ChessTutorialBoard and ChessBattleBoard have working promotion dialog implementations, while ChessPuzzleBoard, PersonsChessBoard, and ComputerChessBoard lack this functionality. The design ensures consistent promotion handling across all components while preserving existing functionality.

## Architecture

### Current State Analysis

**Components with Promotion Dialogs:**

- `ChessTutorialBoard` - Full promotion dialog implementation with piece images
- `ChessBattleBoard` - Full promotion dialog implementation with piece images

**Components Missing Promotion Dialogs:**

- `ChessPuzzleBoard` - No promotion handling, needs integration
- `PersonsChessBoard` - No promotion handling, needs integration
- `ComputerChessBoard` - Has promotion logic but missing dialog component integration

**Shared Components:**

- `PromotionDialog` - Reusable component with piece image rendering
- `useCustomPieces` - Hook for consistent piece rendering

### Design Principles

1. **Consistency** - All components use the same PromotionDialog component
2. **Preservation** - Existing functionality remains unchanged
3. **Reusability** - Leverage existing patterns from working implementations
4. **Engine Compatibility** - Each component's chess engine integration is preserved

## Components and Interfaces

### PromotionDialog Component (Existing)

The existing PromotionDialog component provides:

- Visual piece selection with custom piece images
- Hover effects and styling
- Internationalization support
- Consistent interface across all board types

**Interface:**

```typescript
interface PromotionDialogProps {
  isOpen: boolean;
  onSelect: (piece: PromotionPiece) => void;
  onClose: () => void;
}
```

### Chess Board Components Integration Pattern

Each chess board component will follow this consistent pattern:

**State Management:**

```typescript
const [promotionData, setPromotionData] = useState<{
  sourceSquare: Square;
  targetSquare: Square;
} | null>(null);
```

**Promotion Detection:**

```typescript
function isPromotionMove(
  sourceSquare: Square,
  targetSquare: Square,
  piece?: string
): boolean {
  // Component-specific promotion logic
}
```

**Promotion Handling:**

```typescript
function handlePromotionSelection(promotionPiece: PromotionPiece) {
  // Component-specific move execution with promotion
}
```

### Component-Specific Implementations

#### ChessPuzzleBoard Integration

**Current State:** No promotion handling
**Required Changes:**

- Add promotion state management
- Integrate promotion detection in `onDrop` and `onSquareClick`
- Handle promotion moves in puzzle validation logic
- Ensure promotion moves are validated against puzzle solution

**Engine Integration:**

- `PuzzleChessEngine.makeMove()` needs to support promotion parameter
- Puzzle validation must account for promotion choices

#### PersonsChessBoard Integration

**Current State:** No promotion handling
**Required Changes:**

- Add promotion state management
- Integrate promotion detection in move handling
- Maintain turn-based gameplay during promotion
- Support promotion for both players

**Engine Integration:**

- `PersonsChessEngine.move()` needs to support promotion parameter
- Turn management must handle promotion dialog state

#### ComputerChessBoard Integration

**Current State:** Has promotion logic but missing dialog integration
**Required Changes:**

- Connect existing promotion detection to PromotionDialog
- Ensure human player gets dialog while computer auto-promotes
- Maintain Stockfish engine integration

**Engine Integration:**

- Existing promotion logic is preserved
- Human promotions use dialog, computer promotions remain automatic

## Data Models

### Promotion Data Structure

```typescript
interface PromotionData {
  sourceSquare: Square;
  targetSquare: Square;
}
```

### PromotionPiece Type (Existing)

```typescript
type PromotionPiece = "q" | "r" | "b" | "n";
```

### Chess Engine Integration

Each chess engine must support promotion parameter:

```typescript
// PuzzleChessEngine
makeMove(from: Square, to: Square, promotion?: PromotionPiece): MoveResult

// PersonsChessEngine
move(from: Square, to: Square, promotion?: PromotionPiece): MoveResult

// ComputerChessBoard (chess.js)
game.move({ from, to, promotion }): Move | null
```

## Error Handling

### Promotion Dialog Error States

1. **Invalid Promotion Move** - Dialog closes, move is rejected
2. **Engine Error** - Dialog closes, game state is preserved
3. **Dialog Cancellation** - Move is cancelled, game state reverts

### Fallback Behavior

- If promotion dialog fails to render, default to queen promotion
- If custom pieces fail to load, fallback to Unicode symbols
- If engine doesn't support promotion, log error and continue

## Testing Strategy

### Unit Testing

1. **Promotion Detection** - Test `isPromotionMove` function for each component
2. **Dialog Integration** - Test dialog open/close states
3. **Move Validation** - Test promotion moves are properly validated
4. **Engine Integration** - Test each engine handles promotion parameter

### Integration Testing

1. **Component Rendering** - Test each component renders promotion dialog
2. **User Interaction** - Test promotion piece selection
3. **Game Flow** - Test game continues correctly after promotion
4. **Cross-Component Consistency** - Test all components behave similarly

### Manual Testing

1. **Puzzle Solving** - Test promotion in puzzle scenarios
2. **Local Multiplayer** - Test promotion for both players
3. **Computer Chess** - Test human promotion vs computer auto-promotion
4. **Visual Consistency** - Test dialog appearance across all components

## Implementation Approach

### Phase 1: ChessPuzzleBoard Integration

1. Add promotion state management
2. Implement promotion detection logic
3. Integrate PromotionDialog component
4. Update PuzzleChessEngine to support promotion
5. Test puzzle scenarios with promotion

### Phase 2: PersonsChessBoard Integration

1. Add promotion state management
2. Implement promotion detection logic
3. Integrate PromotionDialog component
4. Update PersonsChessEngine to support promotion
5. Test local multiplayer promotion scenarios

### Phase 3: ComputerChessBoard Integration

1. Connect existing promotion logic to PromotionDialog
2. Ensure dialog only shows for human player
3. Test integration with Stockfish engine
4. Verify computer auto-promotion continues working

### Phase 4: Testing and Validation

1. Run comprehensive test suite
2. Manual testing of all game modes
3. Performance validation
4. Visual consistency verification

## Migration Strategy

### Backward Compatibility

- All existing props and callbacks remain unchanged
- Existing game logic is preserved
- No breaking changes to component interfaces

### Rollback Plan

- Each component integration is independent
- Failed integration can be reverted per component
- Existing working components (ChessTutorialBoard, ChessBattleBoard) remain untouched

## Performance Considerations

### Rendering Optimization

- PromotionDialog only renders when `isOpen` is true
- Custom pieces are cached by useCustomPieces hook
- No additional re-renders during normal gameplay

### Memory Usage

- Promotion state is minimal (two squares)
- Dialog component is lightweight
- No memory leaks from event listeners

## Accessibility

### Keyboard Navigation

- Promotion dialog supports keyboard navigation
- Tab order follows logical piece selection
- Enter key confirms selection

### Screen Reader Support

- Proper ARIA labels for promotion pieces
- Descriptive text for promotion dialog
- Game state announcements include promotion information
