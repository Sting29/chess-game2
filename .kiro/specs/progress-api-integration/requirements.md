# Requirements Document

## Introduction

This specification describes the integration of a progress API system for tracking user completion across different sections of the chess application. The system will manage user progress for tutorials and puzzles using REST API endpoints, with proper state management and visual indicators for completed tasks.

## Requirements

### Requirement 1

**User Story:** As a user, I want my progress to be saved when I complete tasks in different sections, so that my achievements are preserved across sessions

#### Acceptance Criteria

1. WHEN a user completes their first task in a new category THEN the system SHALL create a new progress record using POST /progress
2. WHEN a user completes additional tasks in an existing category THEN the system SHALL update the existing record using PATCH /progress/{id}
3. WHEN the system saves progress THEN it SHALL include userId, type, category, and completed array in the request
4. WHEN the system updates progress THEN it SHALL send the complete array of all completed tasks, not just the new ones

### Requirement 2

**User Story:** As a user, I want to see my current progress when I return to the application, so that I can continue from where I left off

#### Acceptance Criteria

1. WHEN a user loads the application THEN the system SHALL fetch current progress using GET /progress
2. WHEN the system receives progress data THEN it SHALL contain unique records for each category without duplicates
3. WHEN the system processes progress data THEN it SHALL update the Redux store with the current state
4. WHEN a user navigates to a section THEN the system SHALL display their progress based on the stored data

### Requirement 3

**User Story:** As a user, I want to see visual indicators on completed tasks in how-to-move and how-to-play sections, so that I can easily identify what I've already finished

#### Acceptance Criteria

1. WHEN a task is completed in how-to-move section THEN the system SHALL display a white checkmark in a green circle (20x20px) in the top-left corner
2. WHEN a task is completed in how-to-play section THEN the system SHALL display a white checkmark in a green circle (20x20px) in the top-left corner
3. WHEN the system renders task indicators THEN it SHALL check the completed array for the task ID
4. WHEN a task is not completed THEN the system SHALL NOT display any completion indicator

### Requirement 4

**User Story:** As a developer, I want the system to properly categorize different sections of the application, so that progress tracking is organized and maintainable

#### Acceptance Criteria

1. WHEN saving progress for /how-to-move section THEN the system SHALL use category "how_to_move"
2. WHEN saving progress for /how-to-play section THEN the system SHALL use category "how_to_play"
3. WHEN saving progress for /puzzles/mate-in-one section THEN the system SHALL use category "mate-in-one"
4. WHEN saving progress for /puzzles/mate-in-two section THEN the system SHALL use category "mate-in-two"
5. WHEN saving progress for /puzzles/basic-tactics section THEN the system SHALL use category "basic-tactics"
6. WHEN saving progress for /puzzles/labyrinth section THEN the system SHALL use category "labyrinth"

### Requirement 5

**User Story:** As a developer, I want the system to handle API operations correctly, so that data integrity is maintained and no duplicate records are created

#### Acceptance Criteria

1. WHEN creating a new progress record THEN the system SHALL use POST /progress with userId, type, category, and completed array
2. WHEN updating existing progress THEN the system SHALL use PATCH /progress/{id} with the progress record ID
3. WHEN updating progress THEN the system SHALL send the complete concatenated array of all completed tasks
4. WHEN the system needs a progress record ID THEN it SHALL extract it from the GET /progress response
5. WHEN the system encounters an API error THEN it SHALL handle the error gracefully and provide user feedback

### Requirement 6

**User Story:** As a user, I want the system to use my authenticated user ID for progress tracking, so that my progress is associated with my account

#### Acceptance Criteria

1. WHEN the system needs userId THEN it SHALL retrieve it from Redux store user.id
2. WHEN userId is not available in Redux THEN the system SHALL fetch it from /user/profile API
3. WHEN making progress API calls THEN the system SHALL include userId in the request body when required
4. WHEN the user is not authenticated THEN the system SHALL handle the case appropriately without breaking functionality

### Requirement 7

**User Story:** As a developer, I want the system to properly handle different activity types, so that tutorials and games are tracked separately if needed

#### Acceptance Criteria

1. WHEN saving progress for tutorial sections THEN the system SHALL use type "tutorial"
2. WHEN saving progress for game sections THEN the system SHALL use type "game"
3. WHEN the system processes progress data THEN it SHALL handle both tutorial and game types correctly
4. WHEN displaying progress THEN the system SHALL consider the appropriate type for each section

### Requirement 8

**User Story:** As a developer, I want the system to handle potential duplicate records from the API, so that the application displays consistent progress data even if the backend contains duplicates

#### Acceptance Criteria

1. WHEN the GET /progress API returns multiple records for the same category THEN the system SHALL deduplicate them on the frontend
2. WHEN deduplicating records THEN the system SHALL merge completed arrays and use the most recent record ID
3. WHEN processing duplicated progress data THEN the system SHALL ensure only one record per category is stored in Redux
4. WHEN displaying progress THEN the system SHALL show the combined progress from all duplicate records for that category

### Requirement 9

**User Story:** As a developer, I want the progress system to integrate seamlessly with existing Redux state management, so that the application state remains consistent

#### Acceptance Criteria

1. WHEN progress data is fetched THEN the system SHALL update the Redux store with the current progress state
2. WHEN a user completes a task THEN the system SHALL update both the API and Redux store
3. WHEN the Redux store is updated THEN all components SHALL reflect the new progress state
4. WHEN the application initializes THEN the system SHALL load progress data into Redux store
