# Implementation Plan

- [x] 1. Remove threat analysis button from ComputerChessBoard component

  - Locate the button element with "🔍 Проверить угрозы" text in the kids mode section
  - Remove the entire button element and its onClick handler reference
  - Preserve the hints toggle button and its functionality
  - Ensure the button container div styling remains appropriate for single button
  - _Requirements: 1.1, 1.2, 2.1, 2.3_

- [x] 2. Verify automatic threat analysis functionality remains intact

  - Test that `updateThreatAnalysis()` function is still called automatically in useEffect hooks
  - Confirm threat analysis triggers after player moves in the `onSquareClick` function
  - Verify threat analysis updates after computer moves in `makeComputerMove` function
  - Ensure threat highlighting still works when `showThreatHighlight` is enabled
  - _Requirements: 1.2, 2.1_

- [x] 3. Test the updated component in kids mode
  - Load the ComputerChessBoard component with kids mode enabled
  - Verify only the hints toggle button is displayed
  - Make chess moves that create threats and confirm automatic highlighting works
  - Test that threat warning messages still appear correctly
  - _Requirements: 1.1, 1.3, 2.3_
