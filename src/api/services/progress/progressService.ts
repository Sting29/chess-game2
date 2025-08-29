import httpClient from "../../core/httpClient";
import {
  Progress,
  ProgressListResponse,
  ProgressResponse,
  CreateProgressRequest,
  UpdateProgressRequest,
} from "../../types/progress";

class ProgressService {
  private readonly baseUrl = "/progress";

  /**
   * Get all progress records
   * GET /progress
   */
  async getAllProgress(): Promise<ProgressListResponse> {
    return httpClient.get<ProgressListResponse>(this.baseUrl);
  }

  /**
   * Create new progress record
   * PUT /progress
   */
  async createProgress(data: CreateProgressRequest): Promise<ProgressResponse> {
    return httpClient.post<ProgressResponse>(this.baseUrl, data);
  }

  /**
   * Update progress record
   * PUT /progress
   */
  async updateProgress(data: UpdateProgressRequest): Promise<ProgressResponse> {
    return httpClient.patch<ProgressResponse>(this.baseUrl, data);
  }

  /**
   * Get specific progress record by ID
   * GET /progress/{id}
   */
  async getProgressById(id: string): Promise<ProgressResponse> {
    return httpClient.get<ProgressResponse>(`${this.baseUrl}/${id}`);
  }

  /**
   * Update specific progress record by ID
   * PUT /progress/{id}
   */
  async updateProgressById(
    id: string,
    data: UpdateProgressRequest
  ): Promise<ProgressResponse> {
    return httpClient.patch<ProgressResponse>(`${this.baseUrl}/${id}`, data);
  }

  /**
   * Partially update specific progress record by ID
   * PATCH /progress/{id}
   */
  async patchProgressById(
    id: string,
    data: Partial<UpdateProgressRequest>
  ): Promise<ProgressResponse> {
    return httpClient.patch<ProgressResponse>(`${this.baseUrl}/${id}`, data);
  }

  /**
   * Delete specific progress record by ID
   * DELETE /progress/{id}
   */
  async deleteProgressById(id: string): Promise<void> {
    return httpClient.delete<void>(`${this.baseUrl}/${id}`);
  }

  // Utility methods for common operations

  /**
   * Add completed item to progress
   */
  async addCompletedItem(id: string, item: string): Promise<ProgressResponse> {
    const progress = await this.getProgressById(id);
    const updatedCompleted = [...new Set([...progress.completed, item])];

    return this.patchProgressById(id, {
      completed: updatedCompleted,
    });
  }

  /**
   * Remove completed item from progress
   */
  async removeCompletedItem(
    id: string,
    item: string
  ): Promise<ProgressResponse> {
    const progress = await this.getProgressById(id);
    const updatedCompleted = progress.completed.filter(
      (completedItem) => completedItem !== item
    );

    return this.patchProgressById(id, {
      completed: updatedCompleted,
    });
  }

  /**
   * Get progress by category and type
   */
  async getProgressByCategory(
    category: string,
    type?: string
  ): Promise<Progress[]> {
    const allProgress = await this.getAllProgress();

    return allProgress.filter((progress) => {
      const matchesCategory = progress.category === category;
      const matchesType = !type || progress.type === type;
      return matchesCategory && matchesType;
    });
  }

  /**
   * Check if specific item is completed in any progress
   */
  async isItemCompleted(category: string, item: string): Promise<boolean> {
    const categoryProgress = await this.getProgressByCategory(category);

    return categoryProgress.some((progress) =>
      progress.completed.includes(item)
    );
  }
}

// Export singleton instance
export const progressService = new ProgressService();
export default progressService;
