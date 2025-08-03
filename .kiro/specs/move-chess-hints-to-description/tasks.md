# Implementation Plan

- [x] 1. Create ThreatInfo interface and hint generation utility

  - Define ThreatInfo interface in types file
  - Create generateHints utility function with threat message logic
  - Write unit tests for hint generation function
  - _Requirements: 1.1, 2.1, 2.2, 2.3_

- [x] 2. Modify ComputerChessBoard component to use callback pattern

  - Add onThreatsChange prop to ComputerChessBoardProps interface
  - Remove threat warning panel JSX from render method
  - Add callback invocation in updateThreatAnalysis function
  - Update component to call onThreatsChange when threats change
  - _Requirements: 1.1, 1.2, 3.1, 3.2_

- [x] 3. Update PlayWithComputer component to handle threat information

  - Add threatInfo state to manage threat data
  - Create handleThreatsChange callback function
  - Pass onThreatsChange prop to ComputerChessBoard component
  - Update Description component usage to pass generated hints
  - _Requirements: 1.2, 1.3, 2.1, 4.1, 4.2_

- [x] 4. Test the complete integration

  - Verify threat warnings appear in Description component in kids mode
  - Test hint toggle controls both visual highlights and description hints
  - Verify single vs multiple threat messaging works correctly
  - Test that non-kids mode doesn't show threat hints in description
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 4.1, 4.2, 4.3, 4.4_

- [x] 5. Clean up and optimize implementation

  - Add useCallback optimization for threat handler
  - Ensure proper cleanup when component unmounts
  - Verify no memory leaks or performance issues
  - Add error handling for edge cases
  - _Requirements: 3.3, 3.4_

- [x] 6. Move hints toggle functionality to PlayWithComputer component

  - Remove hints toggle button from ComputerChessBoard component
  - Add showHints prop to ComputerChessBoardProps interface
  - Modify ComputerChessBoard to accept showHints from parent instead of managing internal state
  - Update threat highlighting logic to use parent-controlled showHints value
  - _Requirements: 5.1, 5.2, 5.3_

- [x] 7. Integrate hints control with QuestionButton

  - Modify QuestionButton click handler in PlayWithComputer
  - Add logic to control hints visibility when toggling side content in kids mode
  - Ensure hints are disabled when side content is hidden
  - Ensure hints state is preserved when side content is shown
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [x] 8. Test integrated hints control functionality
  - Verify QuestionButton controls both side panel and hints in kids mode
  - Test that hints are disabled when side content is hidden
  - Test that hints are enabled when side content is shown
  - Verify normal mode only controls side panel visibility
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_
