# Design Document

## Overview

This design outlines the upgrade of react-chessboard from version 4.7.3 to 5.2.0 across the chess application. The upgrade involves updating 5 main chess board components while maintaining all existing functionality. Based on the v5 upgrade guide, the main changes involve updated prop names, new TypeScript interfaces, and enhanced customization options.

## Architecture

### Component Structure

The application uses react-chessboard in the following components:

- `ChessPuzzleBoard` - For puzzle solving functionality
- `ComputerChessBoard` - For playing against AI
- `ChessTutorialBoard` - For tutorial and learning modes
- `PersonsChessBoard` - For local multiplayer
- `ChessBattleBoard` - For battle game modes

### Key Changes in v5

Based on the official upgrade guide, the main breaking changes are:

1. **Prop Renaming**: Several props have been renamed for consistency
2. **TypeScript Interfaces**: New and updated type definitions
3. **Event Handler Changes**: Updated callback signatures
4. **Styling Updates**: Enhanced customization options
5. **Performance Improvements**: Better rendering optimization

## Components and Interfaces

### Updated Chessboard Props (v5)

```typescript
// v4 to v5 prop mappings
interface ChessboardPropsV5 {
  // Renamed props
  boardOrientation?: "white" | "black"; // was orientation
  customBoardStyle?: React.CSSProperties; // unchanged
  customDarkSquareStyle?: React.CSSProperties; // unchanged
  customLightSquareStyle?: React.CSSProperties; // unchanged
  customSquareStyles?: Record<string, React.CSSProperties>; // unchanged
  customPieces?: Record<string, React.ComponentType>; // unchanged

  // Event handlers (potentially updated signatures)
  onPieceDrop?: (
    sourceSquare: Square,
    targetSquare: Square,
    piece: string
  ) => boolean;
  onSquareClick?: (square: Square) => void;
  onPromotionCheck?: (
    sourceSquare: Square,
    targetSquare: Square,
    piece: string
  ) => boolean;
  onPromotionPieceSelect?: (
    piece?: string,
    sourceSquare?: Square,
    targetSquare?: Square
  ) => boolean;

  // New or updated props
  isDraggablePiece?: (args: { piece: string; sourceSquare: Square }) => boolean;
  showPromotionDialog?: boolean;
  promotionToSquare?: Square | null;
}
```

### Component Update Strategy

Each component will be updated following this pattern:

```typescript
// Before (v4)
<Chessboard
  position={game.fen()}
  onPieceDrop={onDrop}
  onSquareClick={onSquareClick}
  {...boardStyles}
  customSquareStyles={customStyles}
  customPieces={customPieces}
/>

// After (v5) - with potential prop updates
<Chessboard
  position={game.fen()}
  onPieceDrop={onDrop}
  onSquareClick={onSquareClick}
  {...boardStyles}
  customSquareStyles={customStyles}
  customPieces={customPieces}
  // Any new v5-specific props
/>
```

## Data Models

### Type Updates

```typescript
// Updated Square type (if changed in v5)
type Square = string; // e.g., 'a1', 'h8'

// Updated Piece type (if changed in v5)
type Piece = string; // e.g., 'wP', 'bK'

// New or updated callback types
type OnPieceDropCallback = (
  sourceSquare: Square,
  targetSquare: Square,
  piece: string
) => boolean;

type OnSquareClickCallback = (square: Square) => void;

type OnPromotionCheckCallback = (
  sourceSquare: Square,
  targetSquare: Square,
  piece: string
) => boolean;
```

### Board Configuration Updates

```typescript
// Enhanced board styles for v5
export const boardStylesV5 = {
  customBoardStyle: {
    borderRadius: "4px",
    border: "10px solid #2a80bd",
    width: "568px",
    height: "568px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
  },
  customDarkSquareStyle: {
    backgroundColor: "#438dce",
  },
  customLightSquareStyle: {
    backgroundColor: "#dededc",
  },
  // Any new v5-specific style options
};
```

## Error Handling

### Migration Error Handling

```typescript
interface MigrationErrorHandler {
  // Handle prop deprecation warnings
  handleDeprecatedProps: (componentName: string, props: string[]) => void;

  // Handle type mismatches
  handleTypeMismatch: (expected: string, received: string) => void;

  // Handle callback signature changes
  handleCallbackError: (callbackName: string, error: Error) => void;
}
```

### Backward Compatibility

```typescript
// Wrapper for handling v4 to v5 transition
interface ChessboardWrapper {
  // Map v4 props to v5 props
  mapPropsV4ToV5: (v4Props: any) => ChessboardPropsV5;

  // Handle deprecated callback signatures
  wrapCallbacks: (callbacks: any) => any;
}
```

## Testing Strategy

### Component Testing

1. **Prop Mapping Tests**

   - Verify all v4 props are correctly mapped to v5
   - Test that deprecated props show appropriate warnings
   - Ensure new v5 props work as expected

2. **Functionality Tests**

   - Test piece movement in all board components
   - Verify promotion dialogs work correctly
   - Test custom piece rendering
   - Verify square highlighting and selection

3. **Integration Tests**
   - Test chess engine integration with updated boards
   - Verify game state management works correctly
   - Test custom styling and theming

### Performance Testing

1. **Rendering Performance**

   - Compare v4 vs v5 rendering performance
   - Test with complex board positions
   - Measure memory usage improvements

2. **Interaction Performance**
   - Test drag and drop responsiveness
   - Measure click handling performance
   - Test rapid piece movements

## Implementation Details

### Migration Steps

1. **Package Update**

   ```bash
   npm install react-chessboard@5.2.0
   ```

2. **Type Updates**

   - Update import statements if needed
   - Fix TypeScript compilation errors
   - Update type definitions

3. **Prop Updates**

   - Map deprecated props to new prop names
   - Update callback signatures if changed
   - Add new v5-specific props where beneficial

4. **Testing and Validation**
   - Run existing tests to catch regressions
   - Add new tests for v5-specific features
   - Manual testing of all chess board interactions

### Component-Specific Updates

#### ChessPuzzleBoard Updates

- Update promotion handling if callback signatures changed
- Verify puzzle completion logic works with v5
- Test move validation integration

#### ComputerChessBoard Updates

- Ensure Stockfish engine integration remains functional
- Test computer move display and animation
- Verify game state synchronization

#### ChessTutorialBoard Updates

- Test tutorial-specific features (piece dragging restrictions)
- Verify promotion dialog customization
- Test capture feedback integration

#### PersonsChessBoard Updates

- Test local multiplayer functionality
- Verify turn management
- Test game end detection

#### ChessBattleBoard Updates

- Test battle-specific rules integration
- Verify computer opponent functionality
- Test internationalization with updated components

### Custom Pieces Integration

```typescript
// Ensure custom pieces work with v5
const customPiecesV5 = useCustomPieces();

// Verify piece rendering with new v5 API
<Chessboard
  customPieces={customPiecesV5}
  // Other v5 props
/>;
```

### Board Styling Updates

```typescript
// Update board styles for v5 compatibility
const boardStylesV5 = {
  ...boardStyles,
  // Add any new v5-specific styling options
};
```

## Migration Timeline

### Phase 1: Core Update (Day 1)

- Update package.json to v5.2.0
- Fix immediate compilation errors
- Update basic prop mappings

### Phase 2: Component Updates (Days 2-3)

- Update each chess board component individually
- Fix callback signatures and type issues
- Test basic functionality

### Phase 3: Advanced Features (Day 4)

- Implement any beneficial v5-specific features
- Optimize performance where possible
- Update custom styling if needed

### Phase 4: Testing and Validation (Day 5)

- Comprehensive testing of all components
- Performance comparison with v4
- User acceptance testing

## Risk Mitigation

### Rollback Strategy

- Keep v4 implementation in version control
- Create feature branch for v5 upgrade
- Maintain ability to quickly revert if critical issues arise

### Testing Strategy

- Comprehensive automated testing before deployment
- Manual testing of all chess game modes
- Performance monitoring during rollout
