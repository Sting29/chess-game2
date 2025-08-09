# Design Document

## Overview

The Maze Puzzles feature introduces a new type of chess puzzle where players navigate a single chess piece through a maze-like board containing walls, exits, and optional checkpoints. The feature integrates seamlessly with the existing puzzle system while providing unique gameplay mechanics that combine chess piece movement rules with maze navigation challenges.

## Architecture

### High-Level Architecture

The maze puzzles feature follows the existing application architecture patterns:

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   PuzzleList    │───▶│  MazePuzzleList  │───▶│ MazePuzzleSolver│
│   (Modified)    │    │     (New)        │    │     (New)       │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ CHESS_PUZZLES   │    │  MAZE_PUZZLES    │    │   MazeBoard     │
│   (Existing)    │    │     (New)        │    │     (New)       │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │                       │
                                ▼                       ▼
                       ┌──────────────────┐    ┌─────────────────┐
                       │ Redux Store      │    │  MazeEngine     │
                       │ (mazeProgress)   │    │     (New)       │
                       └──────────────────┘    └─────────────────┘
```

### Component Hierarchy

```
MazePuzzleSolver
├── PageTitle
├── BackButtonImage
├── MazeBoard
│   ├── Chessboard (react-chessboard)
│   ├── MazeCounters (checkpoints, moves, time)
│   └── PromotionDialog (reused)
├── MazeControls
│   ├── HintToggleButton
│   └── RestartButton
├── HintContainer (conditional)
└── GameComplete (conditional)
```

## Components and Interfaces

### 1. Data Models

#### MazePuzzle Interface

```typescript
interface MazePuzzle {
  id: string;
  titleKey: string;
  descriptionKey: string;
  initialPosition: string; // FEN-like: "E6C/WWWW1WWW/8/8/8/2W1W3/WWW1WWW1/R7 w - - 0 1"
  maxMoves?: number;
  timeLimit?: number; // in seconds
  hintKey: string;
}
```

#### MazeGameState Interface

```typescript
interface MazeGameState {
  position: Map<Square, string>;
  playerPiece: { square: Square; type: string };
  walls: Set<Square>;
  exits: Set<Square>;
  checkpoints: Set<Square>;
  visitedCheckpoints: Set<Square>;
  remainingMoves?: number;
  remainingTime?: number;
  gameStatus: "playing" | "won" | "lost";
  turn: "w" | "b";
}
```

#### MazeProgress Interface (Redux State)

```typescript
interface MazeProgressState {
  completedPuzzles: Set<string>;
  currentPuzzleId: string | null;
  totalPuzzles: number;
  completionPercentage: number;
}
```

### 2. Core Components

#### MazeEngine Class

```typescript
class MazeEngine {
  private gameState: MazeGameState;

  constructor(initialPosition: string, puzzle: MazePuzzle);

  // Movement validation
  isValidMove(from: Square, to: Square): boolean;
  getLegalMoves(square: Square): Square[];

  // Game state management
  makeMove(from: Square, to: Square, promotion?: PromotionPiece): MoveResult;
  isGameComplete(): boolean;
  isGameFailed(): boolean;

  // Maze-specific logic
  isWall(square: Square): boolean;
  isExit(square: Square): boolean;
  isCheckpoint(square: Square): boolean;
  areExitsActive(): boolean;

  // State queries
  getRemainingCheckpoints(): number;
  getRemainingMoves(): number | null;
  getRemainingTime(): number | null;
  fen(): string;
}
```

#### MazeBoard Component

```typescript
interface MazeBoardProps {
  puzzle: MazePuzzle;
  onComplete: (result: "success" | "failure") => void;
  showHints: boolean;
}

function MazeBoard({ puzzle, onComplete, showHints }: MazeBoardProps);
```

#### MazeCounters Component

```typescript
interface MazeCountersProps {
  remainingCheckpoints: number;
  remainingMoves?: number;
  remainingTime?: number;
}

function MazeCounters({
  remainingCheckpoints,
  remainingMoves,
  remainingTime,
}: MazeCountersProps);
```

### 3. Integration Components

#### Modified PuzzleList Component

- Add fourth button for maze puzzles
- Route to `/puzzles/maze` when clicked
- Display maze puzzle count and description

#### MazePuzzleList Component

- Display list of available maze puzzles
- Show completion status for each puzzle
- Navigate to individual maze puzzles

#### MazePuzzleSolver Component

- Main container for maze puzzle gameplay
- Manages game state and user interactions
- Handles completion and navigation

## Data Models

### Maze Puzzle Configuration Format

The maze puzzles use a FEN-like notation for initial positions:

```
"E6C/WWWW1WWW/8/8/8/2W1W3/WWW1WWW1/R7 w - - 0 1"
```

**Element Mapping:**

- `E` = Exit square
- `C` = Checkpoint square
- `W` = Wall square
- `R` = White Rook (player piece)
- `r` = Black Rook (player piece)
- Numbers = Empty squares count
- `/` = Rank separator

**Constraints:**

- Player piece never starts on a checkpoint
- Starting square never coincides with exit square
- Only one player piece per puzzle
- Multiple exits and checkpoints allowed

### Sample Maze Puzzles Data Structure

```typescript
export const MAZE_PUZZLES: MazePuzzle[] = [
  {
    id: "1",
    titleKey: "maze_puzzle_1_title",
    descriptionKey: "maze_puzzle_1_desc",
    initialPosition: "E6C/WWWW1WWW/8/8/8/2W1W3/WWW1WWW1/R7 w - - 0 1",
    hintKey: "maze_puzzle_1_hint",
  },
  {
    id: "2",
    titleKey: "maze_puzzle_2_title",
    descriptionKey: "maze_puzzle_2_desc",
    initialPosition: "2E5/1WWWWWW1/1W5W/1W2C2W/1W5W/1WWWWWW1/8/3R4 w - - 0 1",
    maxMoves: 15,
    hintKey: "maze_puzzle_2_hint",
  },
  {
    id: "3",
    titleKey: "maze_puzzle_3_title",
    descriptionKey: "maze_puzzle_3_desc",
    initialPosition: "E7/WWWWWWWW/7W/C5WW/7W/WWWWWWWW/8/7P w - - 0 1",
    maxMoves: 20,
    timeLimit: 120,
    hintKey: "maze_puzzle_3_hint",
  },
];
```

## Error Handling

### Move Validation Errors

- **Invalid piece movement**: Display "Invalid move" message
- **Wall collision**: Display "Cannot move through walls" message
- **Out of moves**: Display "No moves remaining" and end game
- **Time expired**: Display "Time's up!" and end game

### Configuration Errors

- **Invalid FEN format**: Log error and show fallback puzzle
- **Missing puzzle data**: Display "Puzzle not found" message
- **Malformed puzzle**: Skip puzzle and log warning

### State Management Errors

- **Redux state corruption**: Reset to initial state
- **Local storage errors**: Continue without persistence
- **Engine state inconsistency**: Restart puzzle with warning

## Testing Strategy

### Unit Tests

#### MazeEngine Tests

```typescript
describe("MazeEngine", () => {
  test("should parse FEN-like notation correctly");
  test("should validate piece movements according to chess rules");
  test("should prevent movement through walls");
  test("should allow knight to jump over walls");
  test("should handle pawn promotion correctly");
  test("should track checkpoint visits");
  test("should activate exits after all checkpoints visited");
  test("should handle move limits correctly");
  test("should handle time limits correctly");
});
```

#### Component Tests

```typescript
describe("MazeBoard", () => {
  test("should render board with walls, exits, and checkpoints");
  test("should highlight valid moves when piece selected");
  test("should update counters when checkpoints visited");
  test("should show promotion dialog for pawn promotion");
  test("should handle game completion correctly");
});

describe("MazeCounters", () => {
  test("should display remaining checkpoints");
  test("should display remaining moves when limited");
  test("should display countdown timer when time limited");
  test("should update counters in real-time");
});
```

### Integration Tests

```typescript
describe("Maze Puzzle Integration", () => {
  test("should complete puzzle when reaching active exit");
  test("should fail puzzle when no moves remaining");
  test("should fail puzzle when time expires");
  test("should save progress to Redux store");
  test("should navigate between puzzles correctly");
});
```

### Manual Testing Scenarios

1. **Basic Navigation**: Complete simple maze with rook
2. **Checkpoint Flow**: Complete maze requiring checkpoint visits
3. **Knight Jumping**: Test knight jumping over walls
4. **Pawn Promotion**: Test pawn promotion in maze context
5. **Time Pressure**: Complete timed puzzle
6. **Move Limits**: Complete puzzle with move restrictions
7. **Edge Cases**: Test boundary conditions and error states

## Visual Design (Temporary Implementation)

### Board Rendering

- **Walls**: Display "W" in red text on square
- **Inactive Exits**: Display "E" in red text on square
- **Active Exits**: Display "E" in green text on square
- **Checkpoints**: Display "C" in blue text on square
- **Player Piece**: Standard chess piece rendering
- **Empty Squares**: Standard board squares

### UI Elements

- **Counters**: Text display above board
  - "Checkpoints remaining: X"
  - "Moves remaining: X" (if applicable)
  - "Time remaining: MM:SS" (if applicable)
- **Buttons**: Reuse existing button styles
  - "Toggle Hints" button
  - "Restart" button
- **Messages**: Standard game status messages

### Responsive Design

- Mobile: Stack counters vertically above board
- Desktop: Display counters horizontally above board
- Maintain existing responsive breakpoints

## Performance Considerations

### Optimization Strategies

- **Memoization**: Use React.memo for MazeCounters component
- **State Updates**: Batch state updates to prevent unnecessary re-renders
- **Move Calculation**: Cache legal moves until position changes
- **Timer Updates**: Use requestAnimationFrame for smooth countdown

### Memory Management

- **Engine Instances**: Create new engine instance only when needed
- **Event Listeners**: Clean up timer intervals on component unmount
- **Redux State**: Keep maze progress state minimal and normalized

### Loading Performance

- **Lazy Loading**: Load maze puzzles data only when accessed
- **Code Splitting**: Split maze components into separate bundle
- **Asset Optimization**: Reuse existing chess piece assets

## Accessibility

### Keyboard Navigation

- **Tab Order**: Logical tab sequence through interactive elements
- **Arrow Keys**: Navigate between board squares
- **Enter/Space**: Select pieces and make moves
- **Escape**: Deselect current piece

### Screen Reader Support

- **ARIA Labels**: Describe board state and available moves
- **Live Regions**: Announce game state changes
- **Role Attributes**: Proper semantic markup for game elements

### Visual Accessibility

- **High Contrast**: Ensure sufficient color contrast for all elements
- **Focus Indicators**: Clear visual focus indicators
- **Text Scaling**: Support browser text scaling up to 200%
- **Color Independence**: Don't rely solely on color for information

## Internationalization

### Localization Keys

#### Puzzle Content

```json
{
  "maze_puzzles": "Maze Puzzles",
  "maze_puzzle_1_title": "Simple Path",
  "maze_puzzle_1_desc": "Navigate the rook to the exit",
  "maze_puzzle_1_hint": "Move the rook straight to the exit",
  "maze_puzzle_2_title": "Checkpoint Challenge",
  "maze_puzzle_2_desc": "Visit the checkpoint before reaching the exit",
  "maze_puzzle_2_hint": "Visit the blue checkpoint first, then go to the exit"
}
```

#### UI Elements

```json
{
  "checkpoints_remaining": "Checkpoints remaining: {{count}}",
  "moves_remaining": "Moves remaining: {{count}}",
  "time_remaining": "Time remaining: {{time}}",
  "toggle_hints": "Toggle Hints",
  "maze_complete": "Maze completed!",
  "maze_failed": "Maze failed!",
  "no_moves_left": "No moves remaining",
  "time_expired": "Time's up!",
  "cannot_move_through_walls": "Cannot move through walls"
}
```

### RTL Support

- **Text Direction**: Support right-to-left text for Arabic and Hebrew
- **Layout Mirroring**: Mirror UI layout for RTL languages where appropriate
- **Board Orientation**: Maintain consistent board orientation regardless of text direction

## Future Enhancements

### Advanced Features (Post-MVP)

- **Visual Design**: Replace text markers with custom graphics
- **Sound Effects**: Add audio feedback for moves and completions
- **Animations**: Smooth piece movement and checkpoint collection
- **Multiple Pieces**: Support puzzles with multiple player pieces
- **Dynamic Elements**: Moving walls or time-based obstacles

### Editor Mode

- **Puzzle Creator**: Visual editor for creating custom maze puzzles
- **Validation**: Real-time validation of puzzle solvability
- **Sharing**: Export/import puzzle configurations
- **Community**: User-generated puzzle sharing platform

### Analytics and Progress

- **Detailed Stats**: Track solve times, move efficiency, hint usage
- **Difficulty Rating**: Dynamic difficulty based on player performance
- **Achievement System**: Unlock achievements for various accomplishments
- **Leaderboards**: Compare performance with other players
