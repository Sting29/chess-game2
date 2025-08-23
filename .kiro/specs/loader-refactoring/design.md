# Design Document

## Overview

This design focuses on replacing separate loader pages with contextual loading indicators using existing components. The application already has all necessary loading components - we just need to use them consistently instead of navigating to separate loader pages.

## Architecture

### Current State

The application has well-developed loading components:

- `Loader` - Basic chess-themed spinner with size support
- `LoadingOverlay` - Full-screen overlay with backdrop and blur effects
- `ContextualLoader` - Flexible loader for inline and overlay scenarios
- `useLoading` and `useAsyncOperation` hooks for state management
- `LoadingContext` for global loading state

### Target State

Replace any remaining separate loader pages with contextual loading using existing components.

## Components and Interfaces

All necessary components already exist and are well-implemented:

### LoadingOverlay

Perfect for full-page operations like avatar changes:

```typescript
<LoadingOverlay isVisible={isLoading} message="Updating avatar...">
  {/* page content */}
</LoadingOverlay>
```

### ContextualLoader

Good for inline loading states:

```typescript
<ContextualLoader isVisible={isLoading} overlay={true}>
  {/* content */}
</ContextualLoader>
```

### useAsyncOperation Hook

Simplifies async operations with automatic loading states:

```typescript
const { execute, isLoading } = useAsyncOperation();
const handleSubmit = () =>
  execute(async () => {
    // async operation
  });
```

## Implementation Strategy

### Simple Migration Pattern

1. **Identify pages with separate loader navigation**
2. **Wrap page content with LoadingOverlay**
3. **Use useAsyncOperation for async operations**
4. **Remove loader page routes**

### Example Migration

Before (separate loader page):

```typescript
// Navigate to loader page
navigate("/loader");
await apiCall();
navigate("/result");
```

After (contextual loading):

```typescript
const { execute, isLoading } = useAsyncOperation();

return (
  <LoadingOverlay isVisible={isLoading}>
    <button onClick={() => execute(apiCall)}>Submit</button>
  </LoadingOverlay>
);
```

## Error Handling

Use existing error handling patterns from `useAsyncOperation` hook.

## Testing Strategy

Focus on integration tests to verify:

- Loading states appear on current page
- No navigation to separate loader pages
- Error states display correctly

## Migration Priority

1. Account page avatar changes
2. Any other pages with separate loader navigation
3. Clean up unused loader page components
