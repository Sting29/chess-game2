import httpClient from "../../core/httpClient";
import {
  Progress,
  ProgressListResponse,
  ProgressResponse,
  CreateProgressRequest,
  UpdateProgressRequest,
  UserProgressUpdateRequest,
  UserProgressResponse,
  ProgressCategory,
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

  /**
   * Update user progress by userId
   * POST /user/{userId}/progress
   *
   * @param userId - UUID of the user
   * @param data - Progress update data
   * @returns Promise<UserProgressResponse>
   *
   * @example
   * const result = await progressService.updateUserProgress(
   *   "690d51f9-80b0-4e1b-9fa1-04c9f500fd72",
   *   {
   *     type: "tutorial",
   *     category: "maze",
   *     completed: ["1"]
   *   }
   * );
   */
  async updateUserProgress(
    userId: string,
    data: UserProgressUpdateRequest
  ): Promise<UserProgressResponse> {
    // Validate userId format
    if (!this.isValidUUID(userId)) {
      throw new Error("Invalid userId format. Must be a valid UUID.");
    }

    // Validate request data
    this.validateProgressUpdateRequest(data);

    // Make API call using existing httpClient
    return httpClient.post<UserProgressResponse>(
      `/user/${userId}/progress`,
      data
    );
  }

  // Validation helper methods
  private isValidUUID(uuid: string): boolean {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  private validateProgressUpdateRequest(data: UserProgressUpdateRequest): void {
    // Validate type
    if (!data.type || !["tutorial", "game"].includes(data.type)) {
      throw new Error("Invalid type. Must be 'tutorial' or 'game'");
    }

    // Validate category
    const validCategories: ProgressCategory[] = [
      "how_to_move",
      "how_to_play",
      "mate-in-one",
      "mate-in-two",
      "basic-tactics",
      "labyrinth",
      "maze",
    ];
    if (!data.category || !validCategories.includes(data.category)) {
      throw new Error(
        `Invalid category. Must be one of: ${validCategories.join(", ")}`
      );
    }

    // Validate completed array
    if (!Array.isArray(data.completed)) {
      throw new Error("Completed must be an array");
    }

    if (!data.completed.every((item) => typeof item === "string")) {
      throw new Error("All completed items must be strings");
    }
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
