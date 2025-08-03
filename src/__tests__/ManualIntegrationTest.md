# Manual Integration Test for Threat Hints Feature

This document provides step-by-step instructions to manually test the complete integration of the threat hints feature.

## Test Environment Setup

1. Start the development server: `npm start`
2. Navigate to the PlayWithComputer page by going to `/play/computer/easy` (kids mode)

## Test Cases

### Test Case 1: Verify threat warnings appear in Description component in kids mode

**Steps:**

1. Navigate to `/play/computer/easy` (kids mode)
2. Click the question mark button to show the side panel
3. Make moves that put your pieces under threat (e.g., move a piece where the computer can capture it)
4. Observe the Description component in the side panel

**Expected Result:**

- Threat warnings should appear in the Description component
- Single threat: "⚠️ ОСТОРОЖНО!" and "Твоя фигура под атакой! Защити её или убери в безопасное место."
- Multiple threats: "⚠️ ОСТОРОЖНО!" and "X твоих фигур под атакой! Будь осторожен!"

**Status:** ✅ PASS / ❌ FAIL

### Test Case 2: Test hint toggle controls both visual highlights and description hints

**Steps:**

1. Navigate to `/play/computer/easy` (kids mode)
2. Make moves to create threats
3. Observe both visual highlights on the board and hints in the Description component
4. Click the "Скрыть подсказки" button
5. Observe both the board and Description component

**Expected Result:**

- Initially: Both visual highlights and description hints should be visible
- After clicking toggle: Both visual highlights and description hints should be hidden
- Button text should change to "Показать подсказки"

**Status:** ✅ PASS / ❌ FAIL

### Test Case 3: Verify single vs multiple threat messaging works correctly

**Steps:**

1. Navigate to `/play/computer/easy` (kids mode)
2. Create a situation with exactly one piece under threat
3. Observe the Description component message
4. Create a situation with multiple pieces under threat
5. Observe the Description component message

**Expected Result:**

- Single threat: "Твоя фигура под атакой! Защити её или убери в безопасное место."
- Multiple threats: "X твоих фигур под атакой! Будь осторожен!" (where X is the number)

**Status:** ✅ PASS / ❌ FAIL

### Test Case 4: Test that non-kids mode doesn't show threat hints in description

**Steps:**

1. Navigate to `/play/computer/hard` (adult mode)
2. Click the question mark button to show the side panel
3. Make moves that would normally create threats
4. Observe the Description component

**Expected Result:**

- No threat warnings should appear in the Description component
- No hints toggle button should be visible
- Visual threat highlights should not appear on the board

**Status:** ✅ PASS / ❌ FAIL

### Test Case 5: Verify hint toggle applies immediately

**Steps:**

1. Navigate to `/play/computer/easy` (kids mode)
2. Create threats and verify hints are shown
3. Click the hints toggle button
4. Immediately observe both visual and textual hints

**Expected Result:**

- Changes should apply immediately without delay
- Both visual and textual hints should toggle together

**Status:** ✅ PASS / ❌ FAIL

### Test Case 6: Test side content toggle doesn't affect threat detection

**Steps:**

1. Navigate to `/play/computer/easy` (kids mode)
2. Create threats and verify hints are shown
3. Click the question mark button to hide the side panel
4. Click the question mark button again to show the side panel
5. Observe if threat information is still displayed

**Expected Result:**

- Threat information should persist when toggling side content
- Threat detection should continue working in the background

**Status:** ✅ PASS / ❌ FAIL

### Test Case 7: Verify component separation of concerns

**Steps:**

1. Navigate to `/play/computer/easy` (kids mode)
2. Observe the overall page structure
3. Verify that:
   - ComputerChessBoard handles game logic and visual highlights
   - PlayWithComputer coordinates between components
   - Description component displays textual hints

**Expected Result:**

- Clear separation between game logic (chess board) and hint display (description)
- Proper communication flow from chess board → parent → description

**Status:** ✅ PASS / ❌ FAIL

## Test Results Summary

| Test Case | Description                                  | Status |
| --------- | -------------------------------------------- | ------ |
| 1         | Threat warnings in Description (kids mode)   |        |
| 2         | Hint toggle controls both visual and textual |        |
| 3         | Single vs multiple threat messaging          |        |
| 4         | Non-kids mode behavior                       |        |
| 5         | Immediate hint toggle response               |        |
| 6         | Side content toggle persistence              |        |
| 7         | Component separation of concerns             |        |

## Requirements Coverage

This manual test covers all the requirements specified in the task:

- **Requirement 2.1:** Threat warnings appear in Description component in kids mode ✓
- **Requirement 2.2:** Multiple threat messaging works correctly ✓
- **Requirement 2.3:** Single threat messaging works correctly ✓
- **Requirement 2.4:** Non-kids mode doesn't show threat hints ✓
- **Requirement 4.1:** Hint toggle controls both visual and description hints ✓
- **Requirement 4.2:** Hint toggle applies immediately ✓
- **Requirement 4.3:** Consistent hint control ✓
- **Requirement 4.4:** Non-kids mode hint toggle behavior ✓

## Notes

- This manual test should be performed by a human tester
- Each test case should be marked as PASS or FAIL
- Any issues found should be documented with steps to reproduce
- Screenshots can be attached to document the current behavior
