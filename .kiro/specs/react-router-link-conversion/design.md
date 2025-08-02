# Design Document

## Overview

This design outlines the conversion of internal navigation from HTML anchor tags to React Router's Link component across the chess application. The conversion will focus on two main components: PuzzleItem in the PuzzleList page and ChessTutorialButton used throughout multiple pages. The design ensures backward compatibility while establishing consistent routing patterns that align with React Router best practices.

## Architecture

### Current Architecture Issues

1. **PuzzleList Component**: Uses `styled.a` with `href` attribute causing full page reloads
2. **ChessTutorialButton Component**: Uses `styled.a` with `href` attribute for internal navigation
3. **Inconsistent Patterns**: Some components properly use Link (AccountButton, BackButtonImage) while others use anchor tags

### Target Architecture

1. **Unified Routing Pattern**: All internal navigation will use React Router's Link component
2. **Styled Components Integration**: Use `styled(Link)` instead of `styled.a` for internal navigation
3. **Prop Interface Consistency**: Standardize on `to` prop for internal routes, maintain `href` for external links where needed
4. **State Preservation**: Ensure all navigation preserves Redux state and application context

## Components and Interfaces

### 1. PuzzleItem Component Conversion

**Current Implementation:**

```typescript
// styles.ts
export const PuzzleItem = styled.a`
  // styles...
`;

// PuzzleList.tsx
<PuzzleItem href={`/puzzles/${category.id}/${puzzle.id}`}>
```

**Target Implementation:**

```typescript
// styles.ts
import { Link } from "react-router-dom";
export const PuzzleItem = styled(Link)`
  // same styles...
`;

// PuzzleList.tsx
<PuzzleItem to={`/puzzles/${category.id}/${puzzle.id}`}>
```

### 2. ChessTutorialButton Component Conversion

**Current Implementation:**

```typescript
// styles.ts
export const ChessTutorialButtonWrap = styled.a<{
  $image: string;
  $widgetSize: WidgetSize;
}>`
  // styles...
`;

// ChessTutorialButton.tsx
interface ChessTutorialButtonProps {
  href?: string;
  // other props...
}
```

**Target Implementation:**

```typescript
// styles.ts
import { Link } from "react-router-dom";
export const ChessTutorialButtonWrap = styled(Link)<{
  $image: string;
  $widgetSize: WidgetSize;
}>`
  // same styles...
`;

// ChessTutorialButton.tsx
interface ChessTutorialButtonProps {
  to?: string;
  href?: string; // for external links
  // other props...
}
```

### 3. Prop Interface Design

The ChessTutorialButton component will support both internal and external navigation:

```typescript
interface ChessTutorialButtonProps {
  title: string;
  image: string;
  onClick?: () => void;
  widgetSize?: WidgetSize;
  to?: string; // For internal React Router navigation
  href?: string; // For external links (if needed in future)
}
```

**Logic for determining navigation type:**

- If `to` prop is provided: Use Link component for internal navigation
- If `href` prop is provided: Use anchor tag for external navigation
- If `onClick` is provided: Use button element for custom handlers

## Data Models

### Navigation Props Interface

```typescript
interface NavigationProps {
  to?: string; // Internal route path
  href?: string; // External URL
  onClick?: () => void; // Custom click handler
}
```

### Component State

No additional state management is required. The conversion maintains existing component interfaces while adding React Router integration.

## Error Handling

### 1. Invalid Route Handling

- **Issue**: User navigates to non-existent route
- **Solution**: React Router's existing error boundaries and 404 handling will manage invalid routes
- **Implementation**: No additional error handling needed as this is a UI conversion

### 2. Missing Props Validation

- **Issue**: Component receives neither `to` nor `href` props
- **Solution**: Provide sensible defaults and TypeScript warnings
- **Implementation**: Make navigation props optional with proper TypeScript types

### 3. Styling Compatibility

- **Issue**: styled(Link) might behave differently than styled.a
- **Solution**: Maintain exact same CSS properties and test thoroughly
- **Implementation**: Copy existing styles exactly to styled(Link)

## Testing Strategy

### 1. Unit Testing

**PuzzleItem Component:**

- Test that component renders with `to` prop
- Test that clicking navigates without page reload
- Test that styles are preserved after conversion

**ChessTutorialButton Component:**

- Test internal navigation with `to` prop
- Test external navigation with `href` prop (if implemented)
- Test onClick handler functionality
- Test that all existing prop combinations work

### 2. Integration Testing

**Navigation Flow Testing:**

- Test complete user journey from puzzle list to puzzle solver
- Test tutorial navigation flows (Play → Computer, HowToPlay → specific tutorials)
- Test browser back/forward button functionality
- Test that Redux state is preserved during navigation

### 3. Visual Regression Testing

**Style Preservation:**

- Compare before/after screenshots of all affected components
- Test hover states and transitions
- Test responsive behavior across different screen sizes
- Verify that component dimensions and positioning remain identical

### 4. Performance Testing

**Navigation Performance:**

- Measure navigation speed before and after conversion
- Verify that SPA navigation is faster than full page reloads
- Test memory usage during navigation
- Ensure no memory leaks from component re-renders

## Implementation Approach

### Phase 1: PuzzleList Component

1. Update PuzzleItem styled component to use Link
2. Update PuzzleList.tsx to use `to` prop instead of `href`
3. Test puzzle navigation functionality

### Phase 2: ChessTutorialButton Component

1. Update ChessTutorialButtonWrap styled component to use Link
2. Update component interface to support `to` prop
3. Update all consuming pages to use `to` instead of `href`
4. Test all tutorial navigation flows

### Phase 3: Validation and Testing

1. Comprehensive testing of all navigation flows
2. Visual regression testing
3. Performance validation
4. Browser compatibility testing

## Migration Strategy

### Backward Compatibility

The conversion will maintain backward compatibility by:

1. Keeping existing prop names where possible
2. Providing clear TypeScript types for new props
3. Maintaining identical visual appearance
4. Preserving all existing functionality

### Rollback Plan

If issues arise during implementation:

1. Each component conversion is isolated and can be reverted independently
2. Git commits will be atomic for each component
3. Existing functionality remains unchanged until conversion is complete
4. All changes are additive rather than destructive

## Dependencies

### Required Imports

- `react-router-dom`: Already installed and used in other components
- No additional dependencies required

### Existing Pattern Reference

The conversion will follow the established pattern used in:

- `src/components/AccountButton/styles.ts`
- `src/components/BackButtonImage/styles.ts`
- `src/components/ButtonEdit/styles.ts`
- `src/Layout/styles.ts`

These components already properly implement styled(Link) and can serve as reference implementations.
