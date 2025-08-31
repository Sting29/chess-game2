import { useMemo } from "react";
import { PuzzleCategory } from "../../types/types";
import {
  getVisiblePuzzles,
  getTotalPages,
  getPuzzleNumber,
  PUZZLES_PER_PAGE,
} from "./utils";

export const usePagination = (
  category: PuzzleCategory | undefined,
  currentPageFromUrl: number,
  onPageChange: (pageNumber: number) => void
) => {
  // Конвертируем из 1-based (URL) в 0-based (внутренняя логика)
  const currentPage = currentPageFromUrl - 1;

  // Calculate pagination data
  const paginationData = useMemo(() => {
    if (!category) {
      return {
        visiblePuzzles: [],
        totalPages: 0,
        canGoForward: false,
        canGoBackward: false,
        currentPagePuzzles: [],
      };
    }

    const totalPages = getTotalPages(category.puzzles.length, PUZZLES_PER_PAGE);
    const visiblePuzzles = getVisiblePuzzles(
      category.puzzles,
      currentPage,
      PUZZLES_PER_PAGE
    );

    // Create array with puzzle numbers and additional data for rendering
    const currentPagePuzzles = visiblePuzzles.map((puzzle, index) => ({
      ...puzzle,
      puzzleNumber: getPuzzleNumber(currentPage, index, PUZZLES_PER_PAGE),
      indexOnPage: index,
    }));

    return {
      visiblePuzzles,
      totalPages,
      canGoForward: currentPage < totalPages - 1,
      canGoBackward: currentPage > 0,
      currentPagePuzzles,
    };
  }, [category, currentPage]);

  // Navigation functions - теперь обновляют URL
  const goToNextPage = () => {
    if (paginationData.canGoForward) {
      onPageChange(currentPageFromUrl + 1);
    }
  };

  const goToPreviousPage = () => {
    if (paginationData.canGoBackward) {
      onPageChange(currentPageFromUrl - 1);
    }
  };

  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= paginationData.totalPages) {
      onPageChange(pageNumber);
    }
  };

  return {
    currentPage: currentPageFromUrl,
    ...paginationData,
    goToNextPage,
    goToPreviousPage,
    goToPage,
  };
};
