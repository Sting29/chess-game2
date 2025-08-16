# Implementation Plan

- [x] 1. Create TypeScript interfaces and data structures

  - Define MazePuzzle, MazeGameState, and MazeProgressState interfaces in types file
  - Create sample maze puzzles data with FEN-like notation examples
  - Add maze-specific type definitions for walls, exits, and checkpoints
  - _Requirements: 7.1, 4.2, 4.3_

- [x] 2. Implement MazeEngine core logic

  - Create MazeEngine class with FEN-like position parsing
  - Implement wall collision detection and movement validation
  - Add checkpoint tracking and exit activation logic
  - Handle piece movement according to chess rules with maze constraints
  - _Requirements: 1.3, 1.4, 1.6, 3.1, 7.2_

- [x] 3. Add pawn promotion support to MazeEngine

  - Implement promotion detection for pawns reaching opposite end
  - Handle promotion piece selection and state updates
  - Ensure promoted pieces follow new movement rules
  - _Requirements: 3.2, 3.3_

- [x] 4. Create MazeBoard component with basic rendering

  - Build MazeBoard component using react-chessboard library
  - Implement temporary visual markers for walls (W), exits (E), checkpoints (C)
  - Add piece selection and move highlighting functionality
  - Handle click interactions and move execution
  - _Requirements: 5.4, 5.5, 5.6, 5.7, 7.3_

- [x] 5. Implement move limits and time constraints

  - Add move counter functionality to MazeEngine
  - Implement countdown timer for time-limited puzzles
  - Handle game failure when limits are exceeded
  - _Requirements: 2.2, 2.3, 2.4, 2.5_

- [x] 6. Create MazeCounters display component

  - Build component to show remaining checkpoints above board
  - Add move counter display for puzzles with move limits
  - Implement countdown timer display for time-limited puzzles
  - Use text format as temporary solution until final design
  - _Requirements: 2.1, 2.2, 2.3, 5.3_

- [x] 7. Add hint system and controls

  - Implement toggle button for showing/hiding valid moves
  - Add restart button to reset puzzle to initial state
  - Create MazeControls component with both buttons
  - _Requirements: 5.1, 5.2_

- [x] 8. Integrate PromotionDialog for pawn promotion

  - Reuse existing PromotionDialog component
  - Handle promotion piece selection in maze context
  - Update MazeBoard to show promotion dialog when needed
  - _Requirements: 3.2, 3.3_

- [x] 9. Create Redux slice for maze progress tracking

  - Implement mazeProgressSlice with completed puzzles tracking
  - Add actions for updating completion status
  - Store progress data for future API integration
  - Calculate and store completion percentage
  - _Requirements: 4.6, 4.7, 7.4_

- [x] 10. Build MazePuzzleSolver page component

  - Create main solver page following existing PuzzleSolver pattern
  - Integrate MazeBoard, MazeCounters, and MazeControls
  - Handle game completion and navigation
  - Add victory/failure message display
  - _Requirements: 1.7, 6.4_

- [x] 11. Create MazePuzzleList page component

  - Build puzzle list page showing available maze puzzles
  - Display completion status for each puzzle
  - Show sequential puzzle progression without difficulty levels
  - Add navigation to individual maze puzzles
  - _Requirements: 4.5, 4.6_

- [x] 12. Modify PuzzleList to add maze puzzles button

  - Add fourth button to existing puzzle categories
  - Route to maze puzzles section when clicked
  - Display maze puzzle count and description
  - _Requirements: 4.1_

- [x] 13. Add internationalization support

  - Create localization keys for maze puzzle titles and descriptions
  - Add UI element translations (counters, buttons, messages)
  - Support all existing languages (Russian, English, Hebrew, Arabic)
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [x] 14. Implement routing for maze puzzles

  - Add routes for maze puzzle list and individual puzzles
  - Handle navigation between maze puzzles
  - Support back navigation to puzzle categories
  - _Requirements: 4.1, 4.4_

- [x] 15. Add comprehensive error handling

  - Handle invalid moves with appropriate user feedback
  - Display game failure messages for time/move limits
  - Add error boundaries for maze components
  - Handle malformed puzzle configurations gracefully
  - _Requirements: 2.4, 2.5, 2.6_

- [x] 16. Write unit tests for MazeEngine

  - Test FEN-like notation parsing
  - Verify piece movement validation with wall constraints
  - Test checkpoint tracking and exit activation
  - Validate move limits and time constraints
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_

- [x] 17. Write component tests for MazeBoard

  - Test board rendering with maze elements
  - Verify move highlighting and piece selection
  - Test counter updates and game completion handling
  - Validate promotion dialog integration
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7_

- [x] 18. Create integration tests for complete maze puzzle flow
  - Test full puzzle completion workflow
  - Verify progress tracking and Redux state updates
  - Test navigation between puzzles
  - Validate error handling scenarios
  - _Requirements: 1.7, 4.7, 6.4_

## Enhancement Tasks

- [x] 19. Add language-specific coordinate display

  - Modify ChessboardWithCoordinates to show Hebrew coordinates for Hebrew language
  - Use English coordinates for all other languages (Russian, English, Arabic)
  - Integrate coordinate display with MazeBoard component
  - _Requirements: 6.1, 6.2_

- [x] 20. Implement click-based piece movement

  - Add click-to-select piece functionality similar to /how-to-move section
  - Implement click-to-move on valid destination squares
  - Support switching between pieces by clicking different player pieces
  - Deselect piece when clicking invalid squares or opponent pieces that can't be captured
  - _Requirements: 1.3, 1.4_

- [x] 21. Add move highlighting for selected pieces

  - Show possible moves when a piece is selected (similar to /how-to-move)
  - Highlight valid destination squares with visual indicators
  - Update highlighting when switching between pieces
  - Clear highlighting when piece is deselected
  - _Requirements: 1.3, 5.1_

- [x] 22. Implement proper chess piece graphics rendering

  - Replace FEN notation letters (R, r, P, k, etc.) with actual chess piece graphics
  - Use selected piece set from game settings for piece rendering
  - Ensure piece graphics change based on selected set while keeping maze elements (walls, exits, checkpoints) unchanged
  - Support both white and black pieces according to FEN notation (uppercase=white, lowercase=black)
  - _Requirements: 7.6_

- [x] 23. Update visual indicators to match /how-to-move style

  - **Selected piece**: yellow background `rgba(255, 255, 0, 0.4)` (no circle overlay)
  - **Empty squares**: small green circle `radial-gradient(circle, rgba(0, 255, 0, 0.4) 25%, transparent 25%)`
  - **Checkpoints/exits only**: large green circle `radial-gradient(circle, rgba(0, 255, 0, 0.4) 85%, transparent 85%)`
  - **Fix**: Exclude selected piece from showing hint dots (`square !== selectedSquare`)
  - Remove debug elements and finalize clean visual implementation
  - Match the exact visual style from /how-to-move/pawn-move section
  - _Requirements: 5.1, 1.3_

- [x] 24. Replace checkpoint text with star image
  - Import star image from `src/assets/images/star.png`
  - Replace "C" text display with star image for checkpoints
  - Set image size to 80% width/height with `objectFit: "contain"`
  - Maintain checkpoint functionality and visual highlighting
  - _Requirements: 5.7_
