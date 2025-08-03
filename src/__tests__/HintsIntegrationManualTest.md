# Manual Test for Hints Integration with QuestionButton

## Test Scenarios

### Scenario 1: Kids Mode - QuestionButton Controls Both Side Panel and Hints

**Setup:**

1. Start the application
2. Navigate to Play with Computer -> Easy (Kids Mode)
3. Start a game

**Test Steps:**

1. Verify that side content is initially visible
2. Verify that hints are initially enabled (if threats are present)
3. Click the QuestionButton to hide side content
4. Verify that both side content and hints are hidden
5. Click the QuestionButton again to show side content
6. Verify that both side content and hints are visible again

**Expected Results:**

- In kids mode, QuestionButton should control both side panel visibility and hints
- When side content is hidden, all hints (visual and textual) should be disabled
- When side content is shown, hints should be enabled

### Scenario 2: Normal Mode - QuestionButton Only Controls Side Panel

**Setup:**

1. Navigate to Play with Computer -> Hard (Normal Mode)
2. Start a game

**Test Steps:**

1. Click the QuestionButton to toggle side content
2. Verify that only side panel visibility changes
3. Verify that hints behavior is not affected (should be disabled in normal mode anyway)

**Expected Results:**

- In normal mode, QuestionButton should only control side panel visibility
- Hints should not be affected by QuestionButton in normal mode

### Scenario 3: Threat Detection and Display

**Setup:**

1. Navigate to Play with Computer -> Easy (Kids Mode)
2. Start a game and make moves to create threats

**Test Steps:**

1. Create a situation where player pieces are under threat
2. Verify that threats appear in the Description component
3. Toggle side content off and verify threats disappear
4. Toggle side content on and verify threats reappear

**Expected Results:**

- Threat warnings should appear in Description component when threats are detected
- Threat warnings should disappear when side content is hidden
- Threat warnings should reappear when side content is shown

## Implementation Status

✅ Task 6: Move hints toggle functionality to PlayWithComputer component

- Removed hints toggle button from ComputerChessBoard
- Added showHints prop to ComputerChessBoardProps interface
- Modified ComputerChessBoard to accept showHints from parent
- Updated threat highlighting logic to use parent-controlled showHints value

✅ Task 7: Integrate hints control with QuestionButton

- Modified QuestionButton click handler in PlayWithComputer
- Added logic to control hints visibility when toggling side content in kids mode
- Ensured hints are disabled when side content is hidden
- Ensured hints state is preserved when side content is shown

## Code Changes Summary

### ComputerChessBoard.tsx

- Added `showHints?: boolean` prop to interface
- Removed internal `showHints` state management
- Removed `handleHintsToggle` function
- Removed hints toggle button from render
- Now uses parent-controlled `showHints` value

### PlayWithComputer.tsx

- Added `handleQuestionButtonClick` function
- Updated QuestionButton to use new handler
- Added logic to control hints visibility in kids mode
- Updated threatInfo initialization and useEffect
- Passed `showHints` prop to ComputerChessBoard

## Next Steps

- Manual testing of the integrated functionality
- Verification that all requirements are met
