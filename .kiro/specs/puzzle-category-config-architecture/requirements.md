# Requirements Document

## Introduction

This feature transforms the PuzzleCategory page from a hardcoded visual layout to a fully configuration-based architecture. All visual elements, backgrounds, decorative items, and their positioning will be defined in separate TypeScript configuration files rather than in component code. This approach enables adding new backgrounds, decorations, and layout adaptations without modifying component logic, providing maximum flexibility for future design changes.

## Requirements

### Requirement 1

**User Story:** As a developer, I want all visual elements to be defined in configuration files, so that I can add new backgrounds and decorations without changing component code.

#### Acceptance Criteria

1. WHEN creating background configurations THEN the system SHALL use TypeScript interfaces to define BackgroundConfig with id, background path, track path, track position, stone positions, and decorative elements
2. WHEN defining decorative elements THEN the system SHALL use DecorativeConfig interface with name, position coordinates (x, y as percentages), dimensions, visibility flag, background association, and animation type
3. WHEN storing configurations THEN the system SHALL create separate .ts files in `src/pages/PuzzleCategory/config/` directory
4. WHEN accessing configurations THEN the system SHALL export typed configuration objects that can be imported by components
5. WHEN validating configurations THEN the system SHALL ensure all required properties are present and properly typed

### Requirement 2

**User Story:** As a user, I want backgrounds to change based on my progress through puzzles, so that the visual experience evolves as I advance.

#### Acceptance Criteria

1. WHEN determining background THEN the system SHALL select background based on page number (progress) rather than category
2. WHEN reaching puzzle 11 THEN the system SHALL activate a new background configuration
3. WHEN calculating page number THEN the system SHALL use formula: Math.floor((currentPuzzleIndex) / 10) to determine which background to display
4. WHEN no specific background exists for a page THEN the system SHALL fall back to a default background configuration
5. WHEN switching backgrounds THEN the system SHALL smoothly transition between different visual themes

### Requirement 3

**User Story:** As a user, I want the compass element to change based on puzzle category, so that each category has its unique visual identity.

#### Acceptance Criteria

1. WHEN displaying compass THEN the system SHALL select compass image based on current puzzle category
2. WHEN category changes THEN the system SHALL update compass appearance accordingly
3. WHEN no category-specific compass exists THEN the system SHALL use default compass from `src/assets/background/puzzles/common/compass.png`
4. WHEN compass configuration is missing THEN the system SHALL gracefully handle the absence without breaking the layout
5. WHEN compass is displayed THEN the system SHALL maintain its position as defined in the background configuration

### Requirement 4

**User Story:** As a user, I want puzzle stones to be positioned relative to the track, so that they always appear correctly aligned regardless of track placement.

#### Acceptance Criteria

1. WHEN positioning stones THEN the system SHALL calculate stone positions relative to track coordinates, not absolute screen coordinates
2. WHEN track position changes THEN the system SHALL automatically adjust stone positions to maintain alignment
3. WHEN track is not centered THEN the system SHALL use trackPosition coordinates from configuration to position both track and stones
4. WHEN trackPosition is not specified THEN the system SHALL center the track and calculate stone positions accordingly
5. WHEN rendering stones THEN the system SHALL ensure they appear above the track in the visual layer hierarchy

### Requirement 5

**User Story:** As a user, I want decorative elements to be positioned using percentage-based coordinates, so that layouts remain consistent across different screen sizes.

#### Acceptance Criteria

1. WHEN positioning decorative elements THEN the system SHALL use percentage values (0-100) for x and y coordinates relative to background dimensions
2. WHEN screen size changes THEN the system SHALL maintain proportional positioning of all decorative elements
3. WHEN calculating positions THEN the system SHALL convert percentage coordinates to pixel values based on current container size
4. WHEN elements overlap THEN the system SHALL respect the defined layer hierarchy: background → decorative elements → track → stones
5. WHEN elements are hidden THEN the system SHALL respect the 'show' flag in configuration and not render hidden elements

### Requirement 6

**User Story:** As a user on mobile devices, I want the track and stones to rotate appropriately, so that the interface remains usable in portrait orientation.

#### Acceptance Criteria

1. WHEN device is in portrait orientation (tablets and phones) THEN the system SHALL rotate track and all stones by 90 degrees
2. WHEN rotating elements THEN the system SHALL maintain relative positioning between track and stones
3. WHEN screen is in landscape orientation THEN the system SHALL display track and stones in normal orientation
4. WHEN rotation occurs THEN the system SHALL ensure all elements remain within visible screen boundaries
5. WHEN touch interactions happen THEN the system SHALL account for rotation in hit detection and click handling

### Requirement 7

**User Story:** As a user on small screens, I want elements to scale proportionally, so that the interface remains usable and visually appealing.

#### Acceptance Criteria

1. WHEN screen width is below mobile breakpoint THEN the system SHALL scale track and stones proportionally
2. WHEN scaling occurs THEN the system SHALL maintain aspect ratios of all visual elements
3. WHEN elements are scaled THEN the system SHALL ensure text remains readable and interactive areas remain touchable
4. WHEN calculating scale factor THEN the system SHALL use responsive breakpoints to determine appropriate scaling
5. WHEN scaling is applied THEN the system SHALL update both visual size and interaction areas accordingly

### Requirement 8

**User Story:** As a developer, I want animation types to be configurable, so that I can add visual effects to decorative elements without code changes.

#### Acceptance Criteria

1. WHEN defining decorative elements THEN the system SHALL support animation types: 'none', 'fadeIn', 'pulse', 'float'
2. WHEN animationType is 'none' THEN the system SHALL display element without any animation
3. WHEN animationType is 'fadeIn' THEN the system SHALL animate element opacity from 0 to 1 on mount
4. WHEN animationType is 'pulse' THEN the system SHALL create a subtle scale animation that repeats
5. WHEN animationType is 'float' THEN the system SHALL create a gentle vertical movement animation
6. WHEN animation is not specified THEN the system SHALL default to 'none' animation type

### Requirement 9

**User Story:** As a developer, I want the configuration system to be extensible, so that new background themes can be easily added in the future.

#### Acceptance Criteria

1. WHEN adding new backgrounds THEN the system SHALL only require creating new configuration files without modifying component code
2. WHEN new decorative elements are needed THEN the system SHALL support adding them through configuration without code changes
3. WHEN configuration structure changes THEN the system SHALL maintain backward compatibility with existing configurations
4. WHEN validating new configurations THEN the system SHALL provide clear error messages for invalid or missing properties
5. WHEN loading configurations THEN the system SHALL handle missing files gracefully and provide fallback options

### Requirement 10

**User Story:** As a developer, I want clear separation between configuration and logic, so that the codebase remains maintainable and testable.

#### Acceptance Criteria

1. WHEN implementing components THEN the system SHALL separate configuration loading from rendering logic
2. WHEN testing components THEN the system SHALL allow mocking configurations independently from component behavior
3. WHEN configurations change THEN the system SHALL not require changes to component implementation
4. WHEN adding new features THEN the system SHALL extend configuration interfaces rather than modifying component props
5. WHEN debugging issues THEN the system SHALL provide clear separation between configuration errors and component errors
