import httpClient from "./httpClient";
import errorHandler from "./errorHandler";
import { Progress, UpdateProgressRequest } from "./types";
import { AxiosError } from "axios";

class ProgressService {
  // Получить весь прогресс пользователя
  public async getProgress(): Promise<Progress> {
    try {
      const response = await httpClient.get<Progress>("/progress");
      return response;
    } catch (error) {
      const axiosError = error as AxiosError;
      const apiError = errorHandler.processError(axiosError);
      errorHandler.logError(axiosError, "get-progress");
      throw apiError;
    }
  }

  // Получить прогресс конкретной секции
  public async getSectionProgress(sectionId: string): Promise<Progress> {
    try {
      const response = await httpClient.get<Progress>(
        `/progress/section/${sectionId}`
      );
      return response;
    } catch (error) {
      const axiosError = error as AxiosError;
      const apiError = errorHandler.processError(axiosError);
      errorHandler.logError(axiosError, "get-section-progress");
      throw apiError;
    }
  }

  // Обновить прогресс элемента
  public async updateProgress(
    progressData: UpdateProgressRequest
  ): Promise<Progress> {
    try {
      const response = await httpClient.post<Progress>(
        "/progress/update",
        progressData
      );
      return response;
    } catch (error) {
      const axiosError = error as AxiosError;
      const apiError = errorHandler.processError(axiosError);
      errorHandler.logError(axiosError, "update-progress");
      throw apiError;
    }
  }

  // Сбросить прогресс секции
  public async resetSectionProgress(sectionId: string): Promise<Progress> {
    try {
      const response = await httpClient.post<Progress>(
        `/progress/section/${sectionId}/reset`
      );
      return response;
    } catch (error) {
      const axiosError = error as AxiosError;
      const apiError = errorHandler.processError(axiosError);
      errorHandler.logError(axiosError, "reset-section-progress");
      throw apiError;
    }
  }

  // Сбросить весь прогресс
  public async resetAllProgress(): Promise<Progress> {
    try {
      const response = await httpClient.post<Progress>("/progress/reset");
      return response;
    } catch (error) {
      const axiosError = error as AxiosError;
      const apiError = errorHandler.processError(axiosError);
      errorHandler.logError(axiosError, "reset-all-progress");
      throw apiError;
    }
  }
}

// Export singleton instance
const progressService = new ProgressService();
export default progressService;
