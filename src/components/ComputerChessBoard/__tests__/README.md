# ComputerChessBoard Kids Mode Testing

## Overview

This directory contains tests for the ComputerChessBoard component, specifically focusing on the kids mode functionality after the removal of the threat analysis button.

## Test Requirements

The following requirements need to be verified:

### Requirement 1.1: Button Display in Kids Mode

- **WHEN** the ComputerChessBoard component is rendered in kids mode
- **THEN** only the hints toggle button SHALL be displayed
- **AND** the threat analysis button SHALL NOT be displayed

### Requirement 1.2: Automatic Threat Analysis

- **WHEN** threat highlighting is enabled in UI settings
- **THEN** the threat analysis SHALL continue to work automatically without the button
- **AND** threat warnings SHALL appear when pieces are under attack

### Requirement 1.3: Kids Mode UI Behavior

- **WHEN** kids mode is active
- **THEN** only the hints toggle button SHALL be displayed in the control panel
- **AND** the button text SHALL toggle between "👁️ Показать подсказки" and "🙈 Скрыть подсказки"

### Requirement 2.1: Automatic Functionality Preservation

- **WHEN** the threat analysis button code is removed
- **THEN** the automatic threat analysis functionality SHALL remain intact
- **AND** the existing `updateThreatAnalysis` function calls SHALL continue to work

### Requirement 2.3: Clean Interface

- **WHEN** kids mode is active
- **THEN** only the hints toggle button SHALL be displayed in the control panel
- **AND** no unused UI elements SHALL be present

## Manual Testing Instructions

### Setup

1. Start the development server: `npm start`
2. Navigate to the test component (if integrated into the app)
3. Or use the manual test component: `KidsModeManualTest.tsx`

### Test Cases

#### Test Case 1: Kids Mode with Threat Highlighting

**Configuration:**

```typescript
const kidsEngineSettings: GameEngineSettings = {
  kidsMode: true,
  // ... other settings
};

const kidsUISettings: GameUISettings = {
  showThreatHighlight: true,
  showMoveHints: true,
  // ... other settings
};
```

**Expected Results:**

- ✅ Only one button visible: hints toggle button
- ✅ Button text toggles between "👁️ Показать подсказки" and "🙈 Скрыть подсказки"
- ✅ No "🔍 Проверить угрозы" button present
- ✅ Automatic threat highlighting works when pieces are under attack
- ✅ Threat warning messages appear: "⚠️ ОСТОРОЖНО!"

#### Test Case 2: Normal Mode (Non-Kids)

**Configuration:**

```typescript
const normalEngineSettings: GameEngineSettings = {
  kidsMode: false,
  // ... other settings
};

const normalUISettings: GameUISettings = {
  showThreatHighlight: false,
  showMoveHints: false,
  // ... other settings
};
```

**Expected Results:**

- ✅ No buttons displayed above the chessboard
- ✅ No threat highlighting occurs
- ✅ No threat warning messages appear

#### Test Case 3: Kids Mode with Threat Highlighting Disabled

**Configuration:**

```typescript
const kidsEngineSettings: GameEngineSettings = {
  kidsMode: true,
  // ... other settings
};

const kidsUISettings: GameUISettings = {
  showThreatHighlight: false,
  showMoveHints: true,
  // ... other settings
};
```

**Expected Results:**

- ✅ Only hints toggle button visible
- ✅ No threat highlighting occurs (even in kids mode)
- ✅ No threat warning messages appear

### Testing Automatic Threat Analysis

To verify that automatic threat analysis still works:

1. **Start a game in kids mode** with threat highlighting enabled
2. **Make moves that create threats:**
   - Move a piece to attack an opponent's piece
   - Put your own pieces in danger
3. **Verify automatic highlighting:**
   - Threatened pieces should be highlighted with red border
   - Animation should pulse (2s infinite)
4. **Check threat warnings:**
   - Warning panel should appear: "⚠️ ОСТОРОЖНО!"
   - Message should indicate number of pieces under attack

### Testing Hints Toggle

1. **Click the hints button** in kids mode
2. **Verify button text changes:**
   - From "👁️ Показать подсказки" to "🙈 Скрыть подсказки" (or vice versa)
3. **Verify hints behavior:**
   - When hints are shown: possible moves should be highlighted
   - When hints are hidden: no move highlighting occurs

## Success Criteria

All tests pass when:

- ✅ **No threat analysis button** appears in any configuration
- ✅ **Only hints toggle button** appears in kids mode
- ✅ **No buttons** appear in normal mode
- ✅ **Automatic threat analysis** continues to work without manual intervention
- ✅ **Threat warnings** appear correctly when threats are detected
- ✅ **Hints toggle** works correctly in kids mode

## Files

- `ComputerChessBoard.test.tsx` - Automated tests (may need mock fixes)
- `KidsModeManualTest.tsx` - Manual test component for visual verification
- `README.md` - This documentation file

## Notes

The automated tests may require additional mock setup for the StockfishEngine and other dependencies. The manual test component provides a reliable way to verify the functionality visually.
