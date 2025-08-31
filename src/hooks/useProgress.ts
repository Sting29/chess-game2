import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../store";
import {
  fetchAllProgress,
  fetchProgressById,
  createProgress,
  updateProgressById,
  deleteProgressById,
  addCompletedItem,
  removeCompletedItem,
  updateUserProgress,
  clearError,
  clearCurrentProgress,
  setCurrentProgress,
  selectAllProgress,
  selectCurrentProgress,
  selectProgressLoading,
  selectProgressError,
  selectLastFetch,
} from "../store/progressSlice";
import {
  CreateProgressRequest,
  UpdateProgressRequest,
  UserProgressUpdateRequest,
  Progress,
} from "../api/types/progress";

export const useProgress = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Selectors
  const allProgress = useSelector(selectAllProgress);
  const currentProgress = useSelector(selectCurrentProgress);
  const loading = useSelector(selectProgressLoading);
  const error = useSelector(selectProgressError);
  const lastFetch = useSelector(selectLastFetch);

  // Actions
  const fetchAll = useCallback(() => {
    return dispatch(fetchAllProgress());
  }, [dispatch]);

  const fetchById = useCallback(
    (id: string) => {
      return dispatch(fetchProgressById(id));
    },
    [dispatch]
  );

  const create = useCallback(
    (data: CreateProgressRequest) => {
      return dispatch(createProgress(data));
    },
    [dispatch]
  );

  const updateById = useCallback(
    (id: string, data: UpdateProgressRequest) => {
      return dispatch(updateProgressById({ id, data }));
    },
    [dispatch]
  );

  const deleteById = useCallback(
    (id: string) => {
      return dispatch(deleteProgressById(id));
    },
    [dispatch]
  );

  const addCompleted = useCallback(
    (id: string, item: string) => {
      return dispatch(addCompletedItem({ id, item }));
    },
    [dispatch]
  );

  const removeCompleted = useCallback(
    (id: string, item: string) => {
      return dispatch(removeCompletedItem({ id, item }));
    },
    [dispatch]
  );

  const updateUserProgressData = useCallback(
    (userId: string, data: UserProgressUpdateRequest) => {
      return dispatch(updateUserProgress({ userId, data }));
    },
    [dispatch]
  );

  const clearErr = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const clearCurrent = useCallback(() => {
    dispatch(clearCurrentProgress());
  }, [dispatch]);

  const setCurrent = useCallback(
    (progress: Progress) => {
      dispatch(setCurrentProgress(progress));
    },
    [dispatch]
  );

  // Utility functions
  const getProgressByCategory = useCallback(
    (category: string) => {
      return allProgress.filter((item) => item.category === category);
    },
    [allProgress]
  );

  const getProgressByType = useCallback(
    (type: string) => {
      return allProgress.filter((item) => item.type === type);
    },
    [allProgress]
  );

  const isItemCompleted = useCallback(
    (category: string, item: string) => {
      return allProgress
        .filter((progress) => progress.category === category)
        .some((progress) => progress.completed.includes(item));
    },
    [allProgress]
  );

  // Check if data is stale (older than 5 minutes)
  const isDataStale = useCallback(() => {
    if (!lastFetch) return true;
    const fiveMinutes = 5 * 60 * 1000;
    return Date.now() - lastFetch > fiveMinutes;
  }, [lastFetch]);

  // Fetch data if stale or not loaded
  const ensureFreshData = useCallback(() => {
    if (allProgress.length === 0 || isDataStale()) {
      return fetchAll();
    }
    return Promise.resolve();
  }, [allProgress.length, isDataStale, fetchAll]);

  return {
    // Data
    allProgress,
    currentProgress,
    loading,
    error,
    lastFetch,

    // Actions
    fetchAll,
    fetchById,
    create,
    updateById,
    deleteById,
    addCompleted,
    removeCompleted,
    updateUserProgress: updateUserProgressData,
    clearError: clearErr,
    clearCurrentProgress: clearCurrent,
    setCurrentProgress: setCurrent,

    // Utilities
    getProgressByCategory,
    getProgressByType,
    isItemCompleted,
    isDataStale,
    ensureFreshData,
  };
};
