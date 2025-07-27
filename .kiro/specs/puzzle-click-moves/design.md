# Design Document

## Overview

This design enhances the chess puzzle solving experience by implementing click-based move functionality with comprehensive move hints. The solution integrates chess.js library for accurate legal move calculation while maintaining the existing puzzle validation logic. The design follows the established patterns from ChessBattleBoard and ChessTutorialBoard components.

## Architecture

### Component Architecture

The enhancement involves modifications to two main components:

1. **ChessPuzzleBoard** - The chess board component that handles user interactions
2. **PuzzleChessEngine** - The chess engine that manages puzzle state and move validation

### Integration with chess.js

To provide accurate legal move calculation, we'll integrate chess.js library into PuzzleChessEngine, similar to how PersonsChessEngine uses it. This ensures that all legal moves are calculated according to proper chess rules, including:

- Piece movement patterns
- Check/checkmate detection
- Pinned pieces
- En passant
- Castling (if applicable)

## Components and Interfaces

### Enhanced PuzzleChessEngine

The PuzzleChessEngine will be enhanced with the following new capabilities:

```typescript
interface EnhancedPuzzleChessEngine {
  // Existing methods
  makeMove(from: Square, to: Square, promotion?: PromotionPiece): MoveResult;
  makeComputerMove(): ComputerMoveResult;
  isPuzzleComplete(): boolean;
  isPuzzleFailed(): boolean;
  getCurrentMoveIndex(): number;
  hasPiece(square: Square): boolean;
  fen(): string;

  // New methods for comprehensive move calculation
  getAllLegalMoves(square: Square): Square[];
  getPiece(square: Square): string | undefined;
  isValidMove(from: Square, to: Square): boolean;
}
```

### Enhanced ChessPuzzleBoard State

The component will maintain additional state for click-based interactions:

```typescript
interface ChessPuzzleBoardState {
  // Existing state
  game: PuzzleChessEngine;
  errorMessage: string | null;

  // New state for click interactions
  highlightSquares: Square[];
  selectedSquare: Square | null;
  hoveredSquare: Square | null;
  promotionData: {
    sourceSquare: Square;
    targetSquare: Square;
  } | null;
}
```

### Move Validation Flow

The move validation will follow this two-stage process:

1. **Legal Move Check**: When displaying moves, use chess.js to calculate all legally possible moves
2. **Puzzle Validation**: When executing a move, validate against the puzzle's expected sequence

## Data Models

### Move Highlight Styles

The visual feedback system will use different highlight styles:

```typescript
interface MoveHighlightStyles {
  selectedSquare: {
    background: "rgba(255, 255, 0, 0.4)"; // Yellow for selected piece
  };
  legalMoveEmpty: {
    background: "radial-gradient(circle, rgba(0, 255, 0, 0.4) 25%, transparent 25%)";
    borderRadius: "50%";
  };
  legalMoveCapture: {
    background: "radial-gradient(circle, rgba(0, 255, 0, 0.4) 85%, transparent 85%)";
    borderRadius: "50%";
  };
  hoveredSquare: {
    background: "rgba(200, 200, 200, 0.3)";
  };
}
```

### Promotion Dialog Integration

The component will integrate with the existing PromotionDialog component:

```typescript
interface PromotionDialogProps {
  isOpen: boolean;
  onSelect: (piece: PromotionPiece) => void;
  onClose: () => void;
}
```

## Error Handling

### Move Validation Errors

The system will handle different types of move validation errors:

1. **Illegal Chess Move**: When a move violates chess rules
2. **Wrong Puzzle Move**: When a legal chess move is not the correct puzzle solution
3. **Promotion Required**: When a pawn move requires promotion piece selection

### Error Feedback

Error messages will be displayed consistently:

- Invalid chess moves: "Invalid move"
- Wrong puzzle moves: "Wrong solution. Try again!"
- General errors: Temporary error message with 2-second timeout

## Testing Strategy

### Unit Testing

1. **PuzzleChessEngine Tests**:

   - Test `getAllLegalMoves()` returns correct moves for different pieces
   - Test move validation against puzzle sequence
   - Test promotion move handling
   - Test puzzle completion detection

2. **ChessPuzzleBoard Tests**:
   - Test click interaction state management
   - Test move highlight rendering
   - Test promotion dialog integration
   - Test error message display

### Integration Testing

1. **Click-to-Move Flow**:

   - Test complete click-to-move interaction
   - Test switching between pieces
   - Test deselection behavior
   - Test move execution and validation

2. **Drag-and-Drop Compatibility**:
   - Test that existing drag-and-drop functionality continues to work
   - Test state consistency between interaction methods
   - Test error handling for both interaction types

### User Experience Testing

1. **Visual Feedback**:

   - Test highlight styles render correctly
   - Test hover effects work properly
   - Test selection state is visually clear

2. **Interaction Patterns**:
   - Test click patterns match other chess board components
   - Test promotion dialog appears when needed
   - Test error messages are clear and helpful

## Implementation Approach

### Phase 1: Engine Enhancement

1. Integrate chess.js into PuzzleChessEngine
2. Implement `getAllLegalMoves()` method
3. Add `getPiece()` method for piece identification
4. Maintain existing puzzle validation logic

### Phase 2: Component Enhancement

1. Add click interaction state to ChessPuzzleBoard
2. Implement `onSquareClick` handler
3. Add move highlight rendering
4. Integrate promotion dialog

### Phase 3: Visual Polish

1. Add hover effects
2. Implement consistent styling with other board components
3. Add smooth transitions for highlights
4. Test visual feedback across different piece sets

### Phase 4: Integration Testing

1. Test compatibility with existing drag-and-drop
2. Verify puzzle validation works correctly
3. Test error handling and user feedback
4. Performance testing with complex positions

## Compatibility Considerations

### Existing Functionality

The enhancement must maintain full compatibility with:

- Existing drag-and-drop move functionality
- Puzzle validation and completion logic
- Computer move automation
- Error handling and user feedback
- Board styling and piece sets

### React Chessboard Integration

The solution will work with the existing react-chessboard configuration:

- Custom piece sets via `useCustomPieces()`
- Board styling via `boardStyles`
- Square styling via `customSquareStyles`
- Event handlers via `onPieceDrop`, `onSquareClick`, etc.

### Performance Impact

The chess.js integration will have minimal performance impact:

- Legal move calculation is performed only on piece selection
- Chess.js instances are lightweight and fast
- Move validation remains efficient with two-stage approach
- No impact on existing puzzle loading or state management
