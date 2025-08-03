# Requirements Document

## Introduction

This feature involves refactoring the chess application to move threat warning hints from the `ComputerChessBoard` component to the `Description` component in the `PlayWithComputer` page. This will improve separation of concerns by keeping game logic in the chess board component and UI hints/descriptions in the dedicated description component.

## Requirements

### Requirement 1

**User Story:** As a developer, I want to separate UI hints from the chess board component, so that the chess board focuses only on game logic and rendering while hints are managed by the description component.

#### Acceptance Criteria

1. WHEN the chess board detects threats THEN it SHALL communicate threat information to the parent component
2. WHEN the parent component receives threat information THEN it SHALL pass appropriate hints to the Description component
3. WHEN kids mode is enabled and threats are detected THEN the Description component SHALL display threat warnings
4. WHEN no threats are detected THEN the Description component SHALL display default or empty hints

### Requirement 2

**User Story:** As a player in kids mode, I want to see threat warnings in the side panel, so that I can learn about dangerous situations without cluttering the chess board area.

#### Acceptance Criteria

1. WHEN playing in kids mode with threat highlighting enabled THEN threat warnings SHALL appear in the Description component
2. WHEN multiple pieces are under threat THEN the warning SHALL indicate the number of threatened pieces
3. WHEN a single piece is under threat THEN the warning SHALL provide specific guidance about protecting the piece
4. WHEN the show hints toggle is disabled THEN threat warnings SHALL not be displayed in the Description component

### Requirement 3

**User Story:** As a developer, I want to maintain the existing threat detection logic, so that the refactoring doesn't change the game functionality.

#### Acceptance Criteria

1. WHEN threat analysis runs THEN it SHALL use the same logic as the current implementation
2. WHEN threats are detected THEN the chess board SHALL still highlight threatened squares visually
3. WHEN the component unmounts or game state changes THEN threat analysis SHALL continue to work correctly
4. WHEN kids mode is disabled THEN threat warnings SHALL not be generated or displayed

### Requirement 4

**User Story:** As a player, I want the hint toggle button to control both visual highlights and description hints, so that I have consistent control over all hint displays.

#### Acceptance Criteria

1. WHEN the hints toggle is enabled THEN both visual highlights and description hints SHALL be shown
2. WHEN the hints toggle is disabled THEN both visual highlights and description hints SHALL be hidden
3. WHEN toggling hints THEN the change SHALL apply immediately to both display methods
4. WHEN not in kids mode THEN the hints toggle SHALL not affect the Description component

### Requirement 5

**User Story:** As a player, I want to control hints visibility through the existing QuestionButton interface, so that the hint toggle is integrated with the side panel controls.

#### Acceptance Criteria

1. WHEN in kids mode THEN the QuestionButton SHALL control both side panel visibility and hints toggle functionality
2. WHEN clicking the QuestionButton THEN it SHALL toggle both the side content display and the hints visibility
3. WHEN the side content is hidden THEN all hints (visual and textual) SHALL be disabled
4. WHEN the side content is shown THEN hints SHALL be enabled according to the current hints state
5. WHEN not in kids mode THEN the QuestionButton SHALL only control side panel visibility without affecting hints
