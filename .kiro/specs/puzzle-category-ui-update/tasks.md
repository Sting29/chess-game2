# Implementation Plan

- [ ] 1. Create styled components for the new puzzle map layout

  - Create `src/pages/PuzzleCategory/styles.ts` with styled components for the map container, stone positioning, and responsive design
  - Import and configure background images from puzzle_5 directory
  - Implement CSS positioning system for stones using percentage-based coordinates
  - _Requirements: 1.1, 1.4, 3.1, 3.3_

- [ ] 2. Implement PuzzleStone component with different visual states

  - Create `src/pages/PuzzleCategory/components/PuzzleStone.tsx` component
  - Implement props interface for puzzle data, state, position, and click handler
  - Add visual states: completed (white checkmark in green circle 20x20px in upper left), available, and locked
  - Style puzzle numbers with RubikOne font, 20px, bold, white color
  - Include hover effects and proper cursor styling
  - _Requirements: 1.3, 1.5, 2.1, 2.2, 2.3, 2.4, 4.2, 4.4_

- [ ] 3. Create stone positioning configuration and logic

  - Define STONE_POSITIONS array with 10 coordinate pairs following the S-curve path
  - Implement getPuzzleState function to determine stone states (completed: 1-2, available: 3-4, locked: 5+)
  - Create utility functions for calculating stone positions based on current page
  - _Requirements: 1.4, 2.1, 2.2, 2.3_

- [ ] 4. Implement pagination state management and logic

  - Add useState hook for currentPage tracking in PuzzleCategory component
  - Create pagination calculation logic (10 puzzles per page)
  - Implement functions to handle page navigation (forward/backward)
  - Add useMemo for calculating visible puzzles based on current page
  - _Requirements: 5.1, 5.3, 5.4, 5.5_

- [ ] 5. Create NavigationButton component for pagination

  - Create `src/pages/PuzzleCategory/components/NavigationButton.tsx` component
  - Implement forward/backward button functionality using `src/assets/elements/button_slide.png`
  - Use CSS transform scaleX(-1) to flip button image for backward direction
  - Position buttons at bottom center of screen with proper disabled states
  - Add proper styling and hover effects
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [ ] 6. Add decorative elements to enhance visual appeal

  - Create `src/pages/PuzzleCategory/components/DecorativeElement.tsx` component
  - Position anchor image from `src/assets/background/puzzles/puzzle_5/anchor.png` in top-right area
  - Position compass image from `src/assets/background/puzzles/common/compass.png` in bottom-right area
  - Add stone_left and stone_right images on screen edges
  - _Requirements: 6.1, 6.2, 6.3_

- [ ] 7. Update main PuzzleCategory component to use new layout

  - Replace existing PuzzleCategories and PuzzleItem components with new map layout
  - Integrate PuzzleStone components with proper positioning
  - Add pagination controls and decorative elements
  - Maintain existing PageTitle and BackButtonImage components
  - _Requirements: 4.1, 4.3, 7.1, 7.2, 7.4_

- [ ] 8. Implement responsive design for different screen sizes

  - Add media queries for mobile and tablet breakpoints
  - Ensure stones remain on the path when screen resizes
  - Scale stone sizes appropriately for smaller screens
  - Adjust navigation button sizes and positions for mobile
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 6.4_

- [ ] 9. Add click handlers and navigation functionality

  - Implement stone click handlers to navigate to puzzle pages using existing route pattern
  - Ensure only available and completed stones are clickable
  - Prevent navigation for locked stones
  - Maintain existing navigation logic for back button and category validation
  - _Requirements: 4.1, 4.3, 7.3, 7.4_

- [ ] 10. Test and refine stone positioning and visual states
  - Verify stones align properly with the path on different screen sizes
  - Test pagination functionality with different puzzle counts
  - Validate visual states display correctly (completed, available, locked)
  - Ensure smooth transitions and hover effects work properly
  - _Requirements: 1.4, 2.1, 2.2, 2.3, 3.1, 3.3, 4.2_
