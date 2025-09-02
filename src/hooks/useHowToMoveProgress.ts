import { useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { selectProgressByCategory } from "../store/progressSlice";

interface UseHowToMoveProgressReturn {
  isLessonCompleted: (lessonId: number) => boolean;
  getCompletedLessons: () => string[];
  completedCount: number;
  totalCount: number;
  completionPercentage: number;
  isAllCompleted: boolean;
}

export const useHowToMoveProgress = (): UseHowToMoveProgressReturn => {
  const CATEGORY = "how_to_move";
  const TOTAL_LESSONS = 6; // pawn, rook, knight, bishop, queen, king

  // Get progress data from Redux store
  const progressItems = useSelector((state: RootState) =>
    selectProgressByCategory(CATEGORY)(state)
  );

  // Get all completed lessons for how-to-move category
  const completedLessons = useMemo(() => {
    const categoryProgress = progressItems.find(
      (item) => item.category === CATEGORY
    );
    return categoryProgress?.completed || [];
  }, [progressItems]);

  // Check if a specific lesson is completed
  const isLessonCompleted = useMemo(() => {
    return (lessonId: number): boolean => {
      return completedLessons.includes(lessonId.toString());
    };
  }, [completedLessons]);

  // Get completed lessons array
  const getCompletedLessons = useMemo(() => {
    return (): string[] => completedLessons;
  }, [completedLessons]);

  // Calculate completion statistics
  const completedCount = completedLessons.length;
  const completionPercentage = Math.round(
    (completedCount / TOTAL_LESSONS) * 100
  );
  const isAllCompleted = completedCount === TOTAL_LESSONS;

  return {
    isLessonCompleted,
    getCompletedLessons,
    completedCount,
    totalCount: TOTAL_LESSONS,
    completionPercentage,
    isAllCompleted,
  };
};
