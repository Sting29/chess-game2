# Implementation Plan

- [x] 1. Enhance PuzzleChessEngine with chess.js integration

  - Integrate chess.js library into PuzzleChessEngine for accurate legal move calculation
  - Add getAllLegalMoves() method that returns all legal chess moves for a piece
  - Add getPiece() method for piece identification
  - Maintain existing puzzle validation logic alongside new legal move calculation
  - Write unit tests for new legal move calculation functionality
  - _Requirements: 5.1, 5.2_

- [ ] 2. Add click interaction state management to ChessPuzzleBoard

  - Add state variables for highlightSquares, selectedSquare, hoveredSquare
  - Add state for promotionData to handle pawn promotion via clicks
  - Implement state management logic for piece selection and deselection
  - Add hover state management for visual feedback
  - _Requirements: 1.1, 1.4, 3.1_

- [ ] 3. Implement onSquareClick handler with move selection logic

  - Create onSquareClick function that handles piece selection and move execution
  - Implement logic for selecting pieces and showing their legal moves
  - Add logic for deselecting pieces when clicking the same square
  - Add logic for switching selection between different pieces
  - Handle empty square clicks for deselection
  - _Requirements: 1.1, 1.4, 2.2, 2.3_

- [ ] 4. Implement move execution via click interactions

  - Add logic to execute moves when clicking on highlighted target squares
  - Integrate with existing move validation and puzzle checking logic
  - Handle promotion moves by showing promotion dialog
  - Ensure move execution triggers same callbacks as drag-and-drop moves
  - Clear selection and highlights after successful moves
  - _Requirements: 2.1, 2.4, 6.2, 6.4_

- [ ] 5. Add visual feedback system for move highlights

  - Implement square highlighting for selected pieces (yellow background)
  - Add green circular highlights for legal move targets
  - Differentiate between capture moves (larger circle) and regular moves (smaller circle)
  - Add hover effects for squares when mouse is over them
  - Integrate highlights with existing customSquareStyles system
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [ ] 6. Integrate promotion dialog for click-based moves

  - Connect promotion dialog with click-based pawn promotion moves
  - Handle promotion piece selection and move completion
  - Ensure promotion dialog appears when pawn reaches promotion rank via click
  - Maintain consistency with existing drag-and-drop promotion handling
  - _Requirements: 2.1, 4.2_

- [ ] 7. Add mouse interaction handlers for enhanced UX

  - Implement onMouseOverSquare handler for hover effects
  - Implement onMouseOutSquare handler to clear hover state
  - Ensure hover effects work alongside selection highlights
  - Add smooth visual transitions for better user experience
  - _Requirements: 3.4_

- [ ] 8. Ensure compatibility with existing drag-and-drop functionality

  - Test that onPieceDrop continues to work alongside onSquareClick
  - Verify that both interaction methods use the same move validation logic
  - Ensure state consistency when switching between drag and click interactions
  - Test that error handling works the same for both interaction types
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [ ] 9. Add comprehensive error handling for click interactions

  - Handle invalid move attempts with appropriate error messages
  - Show "Invalid move" for illegal chess moves
  - Show puzzle-specific error messages for wrong puzzle moves
  - Implement 2-second timeout for error message display
  - Ensure error handling matches existing drag-and-drop behavior
  - _Requirements: 4.4, 6.3_

- [ ] 10. Write comprehensive tests for click-based move functionality
  - Write unit tests for enhanced PuzzleChessEngine methods
  - Write component tests for ChessPuzzleBoard click interactions
  - Test move highlight rendering and visual feedback
  - Test promotion dialog integration with click moves
  - Test compatibility between click and drag-and-drop interactions
  - Test error handling and user feedback scenarios
  - _Requirements: All requirements validation_
