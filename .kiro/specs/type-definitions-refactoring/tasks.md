# Implementation Plan

- [x] 1. Create new type definition file

  - Create `src/types/computerGameTypes.ts` with the three interfaces extracted from the data file
  - Export `GameEngineSettings`, `GameUISettings`, and `DifficultyLevel` interfaces with proper TypeScript syntax
  - _Requirements: 1.1, 2.1, 3.3_

- [x] 2. Update data file to import types

  - Modify `src/data/play-with-computer.ts` to import the interfaces from the new types file
  - Remove the interface definitions from the data file while keeping all data exports and utility functions
  - _Requirements: 1.3, 2.2_

- [x] 3. Update PlayWithComputer page imports

  - Modify `src/pages/PlayWithComputer/PlayWithComputer.tsx` to import `DifficultyLevel` from the new types file
  - Keep existing data imports from the data file
  - _Requirements: 2.2, 2.3_

- [x] 4. Update PlayWithComputerSelectLevel page imports

  - Modify `src/pages/PlayWithComputerSelectLevel/PlayWithComputerSelectLevel.tsx` import statements
  - No type imports needed for this file, verify existing data imports still work
  - _Requirements: 2.2, 2.3_

- [x] 5. Update GameSettingsModal component imports

  - Modify `src/components/GameSettingsModal/GameSettingsModal.tsx` to import `GameEngineSettings` from the new types file
  - Keep existing data imports from the data file
  - _Requirements: 2.2, 2.3_

- [x] 6. Update ComputerChessBoard component imports

  - Modify `src/components/ComputerChessBoard/ComputerChessBoard.tsx` to import `GameEngineSettings` and `GameUISettings` from the new types file
  - Keep existing data imports from the data file
  - _Requirements: 2.2, 2.3_

- [x] 7. Update KidsModeManualTest component imports

  - Modify `src/components/ComputerChessBoard/KidsModeManualTest.tsx` to import `GameEngineSettings` and `GameUISettings` from the new types file
  - _Requirements: 2.2, 2.3_

- [x] 8. Update ComputerChessBoard test file imports

  - Modify `src/components/ComputerChessBoard/__tests__/ComputerChessBoard.test.tsx` to import types from the new types file
  - Update import path from relative to absolute path for consistency
  - _Requirements: 2.2, 2.3_

- [x] 9. Update ThreatIntegration test file imports

  - Modify `src/components/ComputerChessBoard/__tests__/ThreatIntegration.test.tsx` to import types from the new types file
  - _Requirements: 2.2, 2.3_

- [x] 10. Verify TypeScript compilation and functionality

  - Run TypeScript compilation to ensure no errors exist after all changes
  - Test that all imports resolve correctly and type checking works
  - _Requirements: 2.3, 3.4_

- [x] 11. Extract difficulty levels into a separate enum
  - Create a `DifficultyId` enum in `src/types/computerGameTypes.ts` with values: EASY, MEDIUM, HARD, MASTER
  - Update the `DifficultyLevel` interface to use the enum instead of union type
  - Update all files that reference difficulty level strings to use the enum values
  - _Requirements: 1.1, 3.3_
