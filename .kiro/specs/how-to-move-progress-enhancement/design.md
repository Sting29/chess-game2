# Design Document

## Overview

This design document outlines the enhancement of the how-to-move tutorial section with visual progress indicators, completion tracking, and improved user experience. The solution integrates with the existing progress tracking system while adding new UI components and state management for tutorial-specific features.

## Architecture

### Component Structure

```
HowToMove (Enhanced)
├── ProgressHeader
│   ├── ProgressBar
│   ├── ProgressStats
│   └── ResetProgressButton
├── TutorialGrid (Enhanced)
│   └── ChessTutorialButton (Enhanced)
│       ├── CompletionIndicator
│       ├── RecommendationBadge
│       └── LastAccessedHighlight
└── RecommendationPanel
    └── NextStepSuggestion
```

### State Management

The design leverages the existing Redux progress system with additional local state for UI-specific features:

- **Global State (Redux)**: Tutorial completion status, user progress data
- **Local State**: Last accessed tutorial, UI animations, recommendation visibility
- **Derived State**: Progress percentage, next recommendations, completion statistics

## Components and Interfaces

### 1. ProgressHeader Component

**Purpose**: Display overall progress statistics and controls

**Props Interface**:

```typescript
interface ProgressHeaderProps {
  completedCount: number;
  totalCount: number;
  onResetProgress: () => void;
  showResetButton: boolean;
}
```

**Features**:

- Progress bar with animated fill
- Completion statistics (X of Y completed)
- Reset progress button (conditional)
- Celebration animation when 100% complete

### 2. Enhanced ChessTutorialButton Component

**Purpose**: Tutorial button with completion indicators and recommendations

**Props Interface**:

```typescript
interface EnhancedChessTutorialButtonProps {
  tutorial: HowToMoveTutorial;
  isCompleted: boolean;
  isRecommended: boolean;
  isLastAccessed: boolean;
  onTutorialAccess: (tutorialId: number) => void;
}
```

**Visual States**:

- **Normal**: Default tutorial button appearance
- **Completed**: Dimmed with green checkmark overlay
- **Recommended**: Highlighted border or glow effect
- **Last Accessed**: Subtle highlight or border

### 3. ProgressBar Component

**Purpose**: Visual progress indicator with smooth animations

**Props Interface**:

```typescript
interface ProgressBarProps {
  percentage: number;
  animated?: boolean;
  showLabel?: boolean;
}
```

**Features**:

- Smooth progress transitions
- Color gradient (red → yellow → green)
- Optional percentage label
- Completion celebration effect

### 4. RecommendationPanel Component

**Purpose**: Suggest next learning steps

**Props Interface**:

```typescript
interface RecommendationPanelProps {
  nextTutorial?: HowToMoveTutorial;
  completionLevel: "beginner" | "intermediate" | "advanced" | "complete";
  onRecommendationClick: (action: string) => void;
}
```

**Recommendation Logic**:

- **0 completed**: Suggest starting with Pawn
- **1-3 completed**: Suggest next basic piece
- **4-5 completed**: Suggest Queen (most complex)
- **All completed**: Suggest how-to-play section

## Data Models

### Enhanced Tutorial Data Structure

```typescript
interface HowToMoveTutorial {
  id: number;
  link: string;
  pageTitleKey: string;
  descriptionTitleKey: string;
  descriptionKey: string;
  initialPosition: string;
  image: string;
  difficulty: "basic" | "intermediate" | "advanced";
  prerequisites?: number[]; // IDs of required tutorials
  estimatedTime: number; // minutes
}
```

### Progress Enhancement State

```typescript
interface HowToMoveProgressState {
  lastAccessedTutorial: number | null;
  recommendationVisible: boolean;
  progressAnimating: boolean;
  resetConfirmationOpen: boolean;
}
```

## Error Handling

### Progress Loading Errors

- **Fallback**: Show all tutorials as uncompleted
- **Retry Logic**: Automatic retry with exponential backoff
- **User Feedback**: Toast notification for persistent errors

### Reset Progress Errors

- **Confirmation Dialog**: Prevent accidental resets
- **API Error Handling**: Show error message, maintain current state
- **Rollback**: Restore previous state if reset fails

### Tutorial Access Errors

- **Navigation Fallback**: Allow access even if tracking fails
- **Offline Support**: Cache last known progress state
- **Error Boundaries**: Prevent component crashes

## Testing Strategy

### Unit Tests

- Progress calculation logic
- Recommendation algorithm
- Component rendering with different states
- Error handling scenarios

### Integration Tests

- Progress tracking integration
- Redux state updates
- API interaction for reset functionality
- Navigation between tutorials

### Visual Tests

- Progress bar animations
- Completion indicator positioning
- Responsive design across breakpoints
- Accessibility compliance

## Performance Considerations

### Optimization Strategies

- **Memoization**: Cache progress calculations and recommendations
- **Lazy Loading**: Load tutorial content on demand
- **Animation Performance**: Use CSS transforms for smooth animations
- **State Updates**: Batch Redux updates to prevent unnecessary re-renders

### Memory Management

- **Component Cleanup**: Remove event listeners and timers
- **State Persistence**: Use localStorage for UI preferences
- **Image Optimization**: Preload tutorial images efficiently

## Accessibility

### ARIA Support

- Progress bar with `role="progressbar"` and `aria-valuenow`
- Completion indicators with `aria-label` descriptions
- Keyboard navigation for all interactive elements
- Screen reader announcements for progress changes

### Visual Accessibility

- High contrast mode support
- Reduced motion preferences
- Focus indicators for keyboard users
- Alternative text for all images

## Implementation Phases

### Phase 1: Core Progress Display

- Progress bar component
- Basic completion indicators
- Progress statistics display

### Phase 2: Enhanced Interactions

- Tutorial button enhancements
- Last accessed highlighting
- Recommendation system

### Phase 3: Advanced Features

- Reset progress functionality
- Celebration animations
- Accessibility improvements

### Phase 4: Polish and Testing

- Performance optimization
- Comprehensive testing
- Documentation updates
