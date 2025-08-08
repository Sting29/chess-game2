# Design Document

## Overview

This refactoring involves extracting TypeScript interface definitions from `src/data/play-with-computer.ts` and moving them to a dedicated type definition file in the `src/types/` directory. The goal is to improve code organization by separating type definitions from data, following the established project standards.

## Architecture

### Current State

- Type definitions (`GameEngineSettings`, `GameUISettings`, `DifficultyLevel`) are mixed with data exports in `src/data/play-with-computer.ts`
- 7 files currently import these types from the data file
- The data file serves dual purposes: type definitions and configuration data

### Target State

- Type definitions will be moved to `src/types/computerGameTypes.ts`
- Data file will only contain actual data exports and utility functions
- All consuming files will import types from the new location
- Clear separation between types and data

## Components and Interfaces

### New Type File: `src/types/computerGameTypes.ts`

This file will contain the following interfaces:

```typescript
export interface GameEngineSettings {
  skill: number;
  depth: number;
  time: number;
  MultiPV: number;
  threads: number;
  kidsMode: boolean;
}

export interface GameUISettings {
  showLastMoveArrow: boolean;
  showThreatHighlight: boolean;
  showMoveHints: boolean;
  enableSoundEffects: boolean;
}

export interface DifficultyLevel {
  id: "easy" | "medium" | "hard" | "master";
  titleKey: string;
  description: string;
  ageGroupKey: string;
  featuresKey: string;
  image: string;
  widgetSize: "large";
  avatar: string;
  engineSettings: GameEngineSettings;
  uiSettings: GameUISettings;
}
```

### Updated Data File: `src/data/play-with-computer.ts`

This file will:

- Import the type definitions from the new types file
- Keep all data exports (`DIFFICULTY_LEVELS`, `DEFAULT_DIFFICULTY`, `SETTING_DESCRIPTIONS`)
- Keep all utility functions (`getDifficultySettings`, `getDifficultyLevelsArray`)
- Remove the interface definitions

### Files Requiring Import Updates

The following files need their import statements updated:

1. `src/pages/PlayWithComputer/PlayWithComputer.tsx`
2. `src/pages/PlayWithComputerSelectLevel/PlayWithComputerSelectLevel.tsx`
3. `src/components/GameSettingsModal/GameSettingsModal.tsx`
4. `src/components/ComputerChessBoard/KidsModeManualTest.tsx`
5. `src/components/ComputerChessBoard/__tests__/ComputerChessBoard.test.tsx`
6. `src/components/ComputerChessBoard/ComputerChessBoard.tsx`
7. `src/components/ComputerChessBoard/__tests__/ThreatIntegration.test.tsx`

## Data Models

### Import Strategy

Files that need both types and data will use two import statements:

```typescript
// Import types
import {
  GameEngineSettings,
  GameUISettings,
  DifficultyLevel,
} from "src/types/computerGameTypes";
// Import data and utilities
import {
  getDifficultySettings,
  DIFFICULTY_LEVELS,
} from "src/data/play-with-computer";
```

Files that only need types will import from the types file:

```typescript
import {
  GameEngineSettings,
  GameUISettings,
} from "src/types/computerGameTypes";
```

### Naming Convention

The new type file follows the existing pattern:

- File name: `computerGameTypes.ts` (camelCase, descriptive)
- Consistent with existing files like `playTypes.ts` and `types.ts`
- Groups related types by domain (computer game functionality)

## Error Handling

### TypeScript Compilation

- All type references must be updated to prevent compilation errors
- Import paths must be correct and consistent
- No circular dependencies should be introduced

### Runtime Considerations

- No runtime behavior changes expected
- All existing functionality should remain intact
- Data exports and utility functions remain in the same location

## Testing Strategy

### Validation Steps

1. **Compilation Check**: Ensure TypeScript compiles without errors after refactoring
2. **Import Verification**: Verify all files can successfully import the moved types
3. **Functionality Test**: Ensure all existing functionality works as expected
4. **Type Safety**: Confirm type checking still works correctly

### Test Files Impact

- Test files importing these types need import statement updates
- No test logic changes required
- Existing test coverage remains valid

### Manual Verification

- Check that all consuming components still function correctly
- Verify that type intellisense works in IDE
- Confirm no runtime errors occur

## Implementation Approach

### Phase 1: Create New Type File

- Create `src/types/computerGameTypes.ts` with the extracted interfaces
- Ensure proper exports for all three interfaces

### Phase 2: Update Data File

- Add import statement for types in `src/data/play-with-computer.ts`
- Remove interface definitions from the data file
- Verify data exports still work correctly

### Phase 3: Update Consumer Files

- Update import statements in all 7 consuming files
- Add separate imports for types and data where needed
- Verify each file compiles successfully

### Phase 4: Validation

- Run TypeScript compilation to ensure no errors
- Test key functionality to ensure no regressions
- Verify IDE intellisense works correctly
