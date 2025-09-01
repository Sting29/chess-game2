import { useCallback, useMemo } from "react";
import { useProgress } from "./useProgress";
import {
  ActivityType,
  ProgressCategory,
  CreateProgressRequest,
  UpdateProgressRequest,
} from "../api/types/progress";

interface UseProgressTrackingOptions {
  categoryId: ProgressCategory;
  userId: string;
  type: ActivityType;
}

interface UseProgressTrackingReturn {
  trackPuzzleCompletion: (puzzleId: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  isAlreadyCompleted: (puzzleId: string) => boolean;
  getCompletedPuzzles: () => string[];
}

export const useProgressTracking = ({
  categoryId,
  userId,
  type,
}: UseProgressTrackingOptions): UseProgressTrackingReturn => {
  const {
    loading,
    error,
    create,
    updateById,
    getProgressByCategory,
    isItemCompleted,
    ensureFreshData,
  } = useProgress();

  // Get existing progress for this category
  const existingProgress = useMemo(() => {
    const categoryProgress = getProgressByCategory(categoryId);
    return categoryProgress.length > 0 ? categoryProgress[0] : null;
  }, [getProgressByCategory, categoryId]);

  // Check if a puzzle is already completed
  const isAlreadyCompleted = useCallback(
    (puzzleId: string): boolean => {
      return isItemCompleted(categoryId, puzzleId);
    },
    [isItemCompleted, categoryId]
  );

  // Get all completed puzzles for this category
  const getCompletedPuzzles = useCallback((): string[] => {
    return existingProgress?.completed || [];
  }, [existingProgress]);

  // Track puzzle completion
  const trackPuzzleCompletion = useCallback(
    async (puzzleId: string): Promise<void> => {
      console.log(
        `[useProgressTracking] Starting trackPuzzleCompletion for puzzle ${puzzleId} in category ${categoryId}`
      );
      console.log(`[useProgressTracking] userId: ${userId}, type: ${type}`);

      try {
        // Ensure we have fresh data
        console.log(`[useProgressTracking] Ensuring fresh data...`);
        await ensureFreshData();

        // Check if puzzle is already completed
        const alreadyCompleted = isAlreadyCompleted(puzzleId);
        console.log(
          `[useProgressTracking] Is puzzle ${puzzleId} already completed: ${alreadyCompleted}`
        );

        if (alreadyCompleted) {
          console.log(`Puzzle ${puzzleId} already completed, skipping save`);
          return;
        }

        const currentCompleted = getCompletedPuzzles();
        const updatedCompleted = [...currentCompleted, puzzleId];
        console.log(
          `[useProgressTracking] Current completed: [${currentCompleted.join(
            ", "
          )}]`
        );
        console.log(
          `[useProgressTracking] Updated completed: [${updatedCompleted.join(
            ", "
          )}]`
        );
        console.log(
          `[useProgressTracking] Existing progress:`,
          existingProgress
        );

        if (existingProgress) {
          // Update existing progress
          const updateData: UpdateProgressRequest = {
            type,
            category: categoryId,
            completed: updatedCompleted,
          };

          console.log(
            `[useProgressTracking] Updating existing progress with ID ${existingProgress.id}:`,
            updateData
          );
          await updateById(existingProgress.id, updateData);
          console.log(
            `Updated progress for category ${categoryId}, puzzle ${puzzleId}`
          );
        } else {
          // Create new progress
          const createData: CreateProgressRequest = {
            userId,
            type,
            category: categoryId,
            completed: updatedCompleted,
          };

          console.log(
            `[useProgressTracking] Creating new progress:`,
            createData
          );
          await create(createData);
          console.log(
            `Created new progress for category ${categoryId}, puzzle ${puzzleId}`
          );
        }
      } catch (err) {
        console.error("Failed to track puzzle completion:", err);
        // Don't throw error to avoid blocking puzzle solving
      }
    },
    [
      ensureFreshData,
      isAlreadyCompleted,
      getCompletedPuzzles,
      existingProgress,
      type,
      categoryId,
      userId,
      updateById,
      create,
    ]
  );

  return {
    trackPuzzleCompletion,
    isLoading: loading,
    error,
    isAlreadyCompleted,
    getCompletedPuzzles,
  };
};
