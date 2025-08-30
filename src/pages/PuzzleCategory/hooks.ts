import { useState, useMemo } from "react";
import { PuzzleCategory } from "../../types/types";
import {
  getVisiblePuzzles,
  getTotalPages,
  getPuzzleNumber,
  PUZZLES_PER_PAGE,
} from "./utils";

export const usePagination = (category: PuzzleCategory | undefined) => {
  const [currentPage, setCurrentPage] = useState(0);

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

  // Navigation functions
  const goToNextPage = () => {
    if (paginationData.canGoForward) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const goToPreviousPage = () => {
    if (paginationData.canGoBackward) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const goToPage = (pageIndex: number) => {
    if (pageIndex >= 0 && pageIndex < paginationData.totalPages) {
      setCurrentPage(pageIndex);
    }
  };

  // Reset to first page when category changes
  const resetPagination = () => {
    setCurrentPage(0);
  };

  return {
    currentPage,
    ...paginationData,
    goToNextPage,
    goToPreviousPage,
    goToPage,
    resetPagination,
  };
};
