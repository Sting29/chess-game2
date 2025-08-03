# Design Document

## Overview

This design outlines the removal of the manual threat analysis button from the ComputerChessBoard component while preserving all automatic threat analysis functionality. The change simplifies the user interface in kids mode by removing an unnecessary manual trigger for functionality that already works automatically.

## Architecture

The change affects only the UI layer of the ComputerChessBoard component:

- **Component Layer**: Remove the threat analysis button from the JSX render
- **Logic Layer**: Preserve all existing threat analysis logic and automatic triggers
- **State Management**: No changes to threat analysis state management

## Components and Interfaces

### ComputerChessBoard Component

**Current State:**

- Displays two buttons in kids mode: hints toggle and threat analysis
- Threat analysis button manually triggers `updateThreatAnalysis()`
- Automatic threat analysis already occurs after moves

**Target State:**

- Display only the hints toggle button in kids mode
- Remove the manual threat analysis button
- Preserve all automatic threat analysis functionality

### Affected Code Sections

1. **Button Rendering Section (lines ~399-412)**

   - Remove the second button element for threat analysis
   - Keep the hints toggle button unchanged

2. **Automatic Threat Analysis Triggers**
   - Preserve existing `updateThreatAnalysis()` calls in useEffect hooks
   - Preserve calls after player and computer moves
   - No changes to the threat analysis logic itself

## Data Models

No changes to data models are required. All existing state variables remain:

- `threatSquares`: Array of squares under threat
- `showHints`: Boolean for hints visibility
- All other component state remains unchanged

## Error Handling

No new error handling is required as we're only removing UI elements. Existing error handling for threat analysis logic remains intact.

## Testing Strategy

### Manual Testing

1. **Kids Mode Verification**

   - Load ComputerChessBoard in kids mode
   - Verify only hints toggle button is displayed
   - Verify threat analysis still works automatically

2. **Threat Analysis Functionality**

   - Make moves that create threats
   - Verify threatened pieces are still highlighted automatically
   - Verify threat warnings still appear when appropriate

3. **Non-Kids Mode Verification**
   - Verify no regression in normal chess mode
   - Confirm no buttons are displayed in regular mode

### Regression Testing

- Test all existing ComputerChessBoard functionality
- Verify hints toggle still works correctly
- Confirm automatic threat updates after moves
- Test promotion dialogs and other existing features

## Implementation Notes

- This is a pure UI cleanup with no functional changes
- The `updateThreatAnalysis` function remains available for automatic calls
- Button removal should not affect any existing event handlers or state management
- The change maintains backward compatibility with all existing settings
