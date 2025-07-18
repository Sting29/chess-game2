# Chess Application Project Standards

## Project Overview

This is a React-based chess application with multi-language support, featuring tutorials, puzzles, and gameplay modes. The application is built with TypeScript and follows modern React patterns.

## Technology Stack

- **Frontend Framework**: React 19.1.0 with TypeScript 5.8.3
- **State Management**: Redux Toolkit 2.8.1
- **Styling**: Styled Components 6.1.18
- **Chess Logic**: chess.js 1.2.0 and react-chessboard 4.7.3
- **Internationalization**: i18next 25.1.2 with react-i18next 15.5.1
- **Routing**: React Router DOM 7.5.3
- **Build Tool**: Create React App 5.0.1

## Code Organization Standards

### Directory Structure

- `src/components/` - Reusable UI components with individual folders
- `src/pages/` - Page-level components
- `src/store/` - Redux store and slices
- `src/i18n/` - Internationalization files
- `src/utils/` - Chess engines and utility functions
- `src/assets/` - Images, fonts, and static assets
- `src/types/` - TypeScript type definitions

### Component Structure

Each component should follow this pattern:

```
ComponentName/
├── ComponentName.tsx
└── styles.ts (if using styled-components)
```

## Coding Standards

### TypeScript

- Use strict TypeScript configuration
- Define proper interfaces and types
- Avoid `any` type usage
- Use proper type exports from store

### React Components

- Use functional components with hooks
- Follow naming convention: PascalCase for components
- Use proper prop typing with interfaces
- Include accessibility attributes (aria-label, etc.)

### Styled Components

- Create separate `styles.ts` files for styled components
- Use object syntax for simple styles
- Export styled components with descriptive names ending in "Wrap" or similar

### State Management

- Use Redux Toolkit for global state
- Create slices with proper typing
- Use middleware for side effects (like localStorage sync)
- Follow the existing pattern for RootState and AppDispatch types

### Internationalization

- All user-facing text must use i18next translation keys
- Use the `useTranslation` hook: `const { t } = useTranslation()`
- Support languages: English (en), Russian (ru), Hebrew (he), Arabic (ar)
- Default language is Hebrew (he)

### Navigation

- Use React Router DOM for navigation
- Use `useNavigate` hook for programmatic navigation
- Support back navigation with `navigate(-1)`

## Chess-Specific Standards

### Chess Engines

- Use chess.js for game logic validation
- Create separate engine classes for different game modes:
  - `BattleChessEngine.ts` - Player vs player
  - `PersonsChessEngine.ts` - Local multiplayer
  - `PuzzleChessEngine.ts` - Puzzle solving
  - `SimplifiedChessEngine.ts` - Tutorial mode
  - `StockfishEngine.ts` - AI opponent

### Chess Board Components

- Use react-chessboard library for board rendering
- Support multiple chess piece sets (configurable via settings)
- Handle piece movement validation through chess engines

## Asset Management

### Images

- Store chess piece images in `src/assets/figures/`
- Support multiple piece sets (classic, modern variants)
- Use PNG format for piece images
- Include both light and dark piece variants

### Backgrounds and UI Elements

- Store background images in `src/assets/background/`
- Store UI elements in `src/assets/elements/`
- Use consistent naming conventions

## Development Commands

- `npm start` - Development server
- `npm test` - Run tests
- `npm run build` - Production build
- `npm run find-dead-exports` - Find unused exports

## Accessibility Standards

- Include proper ARIA labels for interactive elements
- Support keyboard navigation
- Ensure proper color contrast
- Use semantic HTML elements

## Performance Considerations

- Use React.memo for expensive components
- Implement proper dependency arrays in useEffect
- Optimize chess piece images
- Use code splitting for different game modes

## Error Handling

- Implement proper error boundaries
- Handle localStorage access safely with try-catch
- Validate chess moves before applying
- Provide user feedback for invalid actions

## Testing Standards

- Write unit tests for chess engines
- Test component rendering and interactions
- Test internationalization key usage
- Validate Redux state changes
