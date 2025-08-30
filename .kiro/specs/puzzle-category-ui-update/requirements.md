# Requirements Document

## Introduction

This feature updates the UI for the PuzzleCategory page (`/puzzles/${category.id}`) to replace the current simple list layout with an interactive visual design using background images and stone elements positioned along paths. The new design will show only the first 10 puzzles with stones, and display locks for inaccessible puzzles, creating a more engaging and game-like experience.

## Requirements

### Requirement 1

**User Story:** As a chess puzzle player, I want to see puzzles displayed as numbered stones on a visual path background, so that the interface feels more engaging and game-like.

#### Acceptance Criteria

1. WHEN the puzzle category page loads THEN the system SHALL display the clean background image from `src/assets/background/puzzles/puzzle_5/background_puzzles_clear.png` with a separate track overlay from `src/assets/background/puzzles/puzzle_5/track.png`
2. WHEN displaying puzzles THEN the system SHALL show 10 puzzles per page with pagination
3. WHEN rendering puzzle stones THEN the system SHALL use stone images from `src/assets/background/puzzles/common/` (stone_1.png, stone_2.png, stone_3.png)
4. WHEN positioning stones THEN the system SHALL place them along the path as shown in the design reference `src/assets/background/puzzles/puzzle_5/Снимок экрана 2025-08-08 в 17.18.30 1.png`
5. WHEN displaying a stone THEN the system SHALL show the puzzle number on the stone using 20px bold white text with RubikOne font

### Requirement 2

**User Story:** As a chess puzzle player, I want to see different states for puzzles (completed, available, locked), so that I understand my progress and what I can access.

#### Acceptance Criteria

1. WHEN displaying puzzle 1 and 2 THEN the system SHALL show them as completed with checkmarks
2. WHEN displaying puzzle 3 and 4 THEN the system SHALL show them as available/accessible
3. WHEN displaying puzzles 5 and beyond THEN the system SHALL show them as locked with lock icons
4. WHEN a puzzle is completed THEN the system SHALL display a white checkmark in a green circle (20x20px) in the upper left corner of the stone
5. WHEN a puzzle is locked THEN the system SHALL use the lock image from `src/assets/background/puzzles/common/stone-lock.png`

### Requirement 3

**User Story:** As a chess puzzle player, I want the stone layout to adapt to different screen sizes, so that stones remain positioned on the path at various resolutions.

#### Acceptance Criteria

1. WHEN the screen size changes THEN the system SHALL maintain stones positioned on the path/road in the background
2. WHEN on mobile devices THEN the system SHALL ensure stones remain clickable and properly sized
3. WHEN the background scales THEN the system SHALL scale stone positions proportionally to stay on the path
4. WHEN displaying stones THEN the system SHALL ensure they follow the path layout as shown in the design reference

### Requirement 4

**User Story:** As a chess puzzle player, I want to click on numbered stones to navigate to specific puzzles, so that I can easily access the challenges I want to solve.

#### Acceptance Criteria

1. WHEN a user clicks on a stone THEN the system SHALL navigate to the corresponding puzzle page using the existing route `/puzzles/${category.id}/${puzzle.id}`
2. WHEN hovering over a stone THEN the system SHALL provide visual feedback (hover effect)
3. WHEN displaying a stone THEN the system SHALL show the puzzle number clearly on the stone
4. WHEN a stone is clickable THEN the system SHALL show appropriate cursor styling

### Requirement 5

**User Story:** As a chess puzzle player, I want to navigate between pages of puzzles, so that I can access all puzzles in the category through pagination.

#### Acceptance Criteria

1. WHEN there are more than 10 puzzles in a category THEN the system SHALL display forward and backward navigation buttons using `src/assets/elements/button_slide.png`
2. WHEN displaying navigation buttons THEN the system SHALL flip the button image horizontally for the backward direction
3. WHEN clicking forward THEN the system SHALL show the next 10 puzzles (11-20, 21-30, etc.)
4. WHEN clicking backward THEN the system SHALL show the previous 10 puzzles
5. WHEN displaying puzzles on any page THEN the system SHALL show the correct puzzle numbers (not starting from 1 on each page)

### Requirement 6

**User Story:** As a chess puzzle player, I want to see decorative elements that match the game theme, so that the interface feels immersive and engaging.

#### Acceptance Criteria

1. WHEN the page loads THEN the system SHALL display decorative elements including anchor, compass, bone, coins, map, and side stones
2. WHEN displaying decorative elements THEN the system SHALL use images from `src/assets/background/puzzles/puzzle_5/` (anchor.png, bone.png, coins.png, map.png, stone_left.png, stone_right.png) and compass from `src/assets/background/puzzles/common/compass.png`
3. WHEN positioning decorative elements THEN the system SHALL use a layered approach: background -> decorative elements -> track -> stones, with the track rotated 90 degrees on mobile/tablet portrait orientation
4. WHEN the screen resizes THEN the system SHALL maintain appropriate positioning of decorative elements

### Requirement 7

**User Story:** As a chess puzzle player, I want to maintain the existing navigation functionality, so that I can still go back to the puzzle list and see the category title.

#### Acceptance Criteria

1. WHEN the page loads THEN the system SHALL display the category title using the existing PageTitle component
2. WHEN the page loads THEN the system SHALL display the back button using the existing BackButtonImage component
3. WHEN the category is not found THEN the system SHALL display the "category_not_found" message
4. WHEN using the back button THEN the system SHALL navigate to the previous page as currently implemented
