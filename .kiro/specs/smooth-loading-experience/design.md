# Design Document

## Overview

This design addresses the flickering loading screen issue in the chess application by implementing a sophisticated loading state management system. The solution focuses on eliminating jarring white screens during authentication checks while providing appropriate feedback for longer operations. The design leverages the existing Loader component and introduces smart loading strategies based on operation duration and context.

## Architecture

### Loading State Categories

The system will manage three distinct types of loading states:

1. **Silent Loading** - Operations under 200ms that show no visual feedback
2. **Overlay Loading** - Operations over 200ms that show the Loader component as a centered overlay
3. **Contextual Loading** - Component-specific loading states for settings updates and form submissions

### Core Components

```
LoadingManager
├── LoadingContext (React Context)
├── LoadingProvider (Context Provider)
├── useLoading (Custom Hook)
├── LoadingOverlay (Component)
└── withLoadingDelay (HOC)
```

## Components and Interfaces

### LoadingContext Interface

```typescript
interface LoadingContextType {
  // Global loading states
  isGlobalLoading: boolean;
  loadingMessage?: string;

  // Loading management methods
  startLoading: (key: string, message?: string, delay?: number) => void;
  stopLoading: (key: string) => void;

  // Utility methods
  isLoading: (key?: string) => boolean;
  getActiveLoadingKeys: () => string[];
}
```

### LoadingOverlay Component

```typescript
interface LoadingOverlayProps {
  show: boolean;
  message?: string;
  backdrop?: boolean;
  className?: string;
}
```

### Enhanced ProtectedRoute Component

The ProtectedRoute will be redesigned to handle authentication loading more gracefully:

```typescript
interface AuthState {
  isAuthenticated: boolean;
  loading: boolean;
  initialCheckComplete: boolean;
}
```

## Data Models

### Loading State Model

```typescript
interface LoadingState {
  key: string;
  startTime: number;
  message?: string;
  delay: number;
  visible: boolean;
  timeoutId?: NodeJS.Timeout;
}

interface LoadingManagerState {
  activeLoading: Map<string, LoadingState>;
  globalLoading: boolean;
  currentMessage?: string;
}
```

### Authentication Loading Model

```typescript
interface AuthLoadingState {
  initialCheck: boolean;
  profileLoad: boolean;
  loginProcess: boolean;
  logoutProcess: boolean;
  settingsUpdate: boolean;
}
```

## Error Handling

### Loading Timeout Management

- All loading states will have automatic cleanup after 30 seconds
- Failed API operations will properly clear their loading states
- Network errors will show appropriate error messages instead of infinite loading

### Authentication Error Handling

```typescript
interface AuthErrorHandling {
  // Silent failures for quick auth checks
  handleSilentAuthFailure: () => void;

  // User-visible errors for explicit actions
  handleUserActionFailure: (error: string) => void;

  // Token refresh failures
  handleTokenRefreshFailure: () => void;
}
```

## Testing Strategy

### Unit Tests

1. **LoadingManager Tests**

   - Test loading state transitions
   - Verify delay mechanisms work correctly
   - Test cleanup and timeout handling

2. **LoadingOverlay Tests**

   - Test visibility based on loading states
   - Verify proper Loader component integration
   - Test backdrop and positioning

3. **ProtectedRoute Tests**
   - Test authentication flow without flickering
   - Verify proper loading state management
   - Test error scenarios

### Integration Tests

1. **Authentication Flow Tests**

   - Test initial app load without flickering
   - Test navigation between protected routes
   - Test settings updates with contextual loading

2. **Loading State Coordination Tests**
   - Test multiple simultaneous loading operations
   - Test loading state cleanup on component unmount
   - Test loading state persistence across navigation

### Performance Tests

1. **Loading Delay Tests**
   - Verify 200ms delay threshold works correctly
   - Test that quick operations don't show loading
   - Measure loading state overhead

## Implementation Details

### Smart Loading Delay Strategy

```typescript
const LOADING_DELAY_THRESHOLD = 200; // ms

class SmartLoadingManager {
  private startLoading(key: string, delay: number = LOADING_DELAY_THRESHOLD) {
    const loadingState: LoadingState = {
      key,
      startTime: Date.now(),
      delay,
      visible: false,
      timeoutId: setTimeout(() => {
        this.showLoading(key);
      }, delay),
    };

    this.activeLoading.set(key, loadingState);
  }

  private stopLoading(key: string) {
    const loadingState = this.activeLoading.get(key);
    if (loadingState) {
      if (loadingState.timeoutId) {
        clearTimeout(loadingState.timeoutId);
      }
      this.activeLoading.delete(key);
      this.updateGlobalState();
    }
  }
}
```

### Enhanced Redux Integration

The settingsSlice will be enhanced to work with the new loading system:

```typescript
// New loading keys for different operations
const LOADING_KEYS = {
  INITIAL_AUTH: "initial_auth",
  LOGIN: "login",
  LOGOUT: "logout",
  PROFILE_LOAD: "profile_load",
  SETTINGS_UPDATE: "settings_update",
  LANGUAGE_UPDATE: "language_update",
  CHESS_SET_UPDATE: "chess_set_update",
} as const;
```

### ProtectedRoute Redesign

```typescript
function ProtectedRoute({ children }: { children: React.ReactElement }) {
  const { isAuthenticated, loading, initialCheckComplete } = useSelector(
    (state: RootState) => state.settings
  );
  const { startLoading, stopLoading } = useLoading();

  useEffect(() => {
    if (loading && !initialCheckComplete) {
      startLoading(LOADING_KEYS.INITIAL_AUTH, undefined, 200);
    } else {
      stopLoading(LOADING_KEYS.INITIAL_AUTH);
    }
  }, [loading, initialCheckComplete, startLoading, stopLoading]);

  // Never show the old loading div
  if (!initialCheckComplete) {
    return null; // Let LoadingOverlay handle the display
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Layout>{children}</Layout>;
}
```

### LoadingOverlay Implementation

```typescript
function LoadingOverlay({
  show,
  message,
  backdrop = true,
}: LoadingOverlayProps) {
  if (!show) return null;

  return (
    <OverlayContainer backdrop={backdrop}>
      <Loader />
      {message && <LoadingMessage>{message}</LoadingMessage>}
    </OverlayContainer>
  );
}

const OverlayContainer = styled.div<{ backdrop: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${(props) =>
    props.backdrop ? "rgba(0, 0, 0, 0.3)" : "transparent"};
`;
```

## Migration Strategy

### Phase 1: Core Loading Infrastructure

- Implement LoadingManager and LoadingContext
- Create LoadingOverlay component
- Add useLoading hook

### Phase 2: Authentication Integration

- Update ProtectedRoute to use new loading system
- Enhance settingsSlice with loading keys
- Update AuthRestore component

### Phase 3: Settings Integration

- Update SettingsPage to use contextual loading
- Integrate language and chess set updates
- Add proper error handling

### Phase 4: Testing and Optimization

- Add comprehensive tests
- Performance optimization
- User acceptance testing
