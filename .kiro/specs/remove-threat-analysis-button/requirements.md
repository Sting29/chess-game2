# Requirements Document

## Introduction

This feature involves removing the unnecessary threat analysis button from the ComputerChessBoard component. The button "🔍 Проверить угрозы" (Check Threats) is currently displayed in kids mode but is not needed as the threat analysis functionality should work automatically without requiring manual user interaction.

## Requirements

### Requirement 1

**User Story:** As a user playing chess in kids mode, I want the threat analysis to work automatically without needing to manually click a button, so that the interface is cleaner and the experience is more seamless.

#### Acceptance Criteria

1. WHEN the ComputerChessBoard component is rendered in kids mode THEN the threat analysis button SHALL NOT be displayed
2. WHEN threat highlighting is enabled in UI settings THEN the threat analysis SHALL continue to work automatically without the button
3. WHEN the component updates after moves THEN the threat analysis SHALL still update automatically as it currently does

### Requirement 2

**User Story:** As a developer maintaining the chess application, I want to remove unused UI elements, so that the codebase is cleaner and the interface is not cluttered.

#### Acceptance Criteria

1. WHEN the threat analysis button code is removed THEN the automatic threat analysis functionality SHALL remain intact
2. WHEN the button is removed THEN the existing `updateThreatAnalysis` function calls SHALL continue to work
3. WHEN kids mode is active THEN only the hints toggle button SHALL be displayed in the control panel
