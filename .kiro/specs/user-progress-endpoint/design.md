# Design Document

## Overview

Данный дизайн описывает реализацию нового API эндпоинта `/user/{userId}/progress` для обновления прогресса пользователя. Эндпоинт будет интегрирован в существующую архитектуру API и будет использовать текущую инфраструктуру HTTP клиента, обработки ошибок и типов данных.

**Важно**: Рекомендуется использовать "maze" вместо "labyrinth", так как "maze" используется в роутах (`/puzzles/maze/:puzzleId`), данных (`CHESS_PUZZLES`), и компонентах (`MazePuzzleSolver`). Это обеспечит консистентность системы.

## Architecture

### High-Level Architecture

```mermaid
graph TB
    A[React Components] --> B[Progress Service]
    B --> C[HTTP Client]
    C --> D[Backend API /user/{userId}/progress]
    D --> E[Database]

    F[Token Manager] --> C
    G[Error Handler] --> C
    H[Auth Service] --> C
```

### Integration with Existing Architecture

Новый эндпоинт будет интегрирован в существующую архитектуру:

- **HTTP Client**: Использует существующий `httpClient` с автоматической аутентификацией
- **Progress Service**: Расширяет существующий `progressService` новым методом
- **Error Handling**: Использует существующий `errorHandler` для обработки ошибок
- **Type System**: Расширяет существующие типы в `src/api/types/progress.ts`

## Components and Interfaces

### Extended Progress Service Interface

```typescript
interface ProgressService {
  // Existing methods...

  /**
   * Update user progress by userId
   * POST /user/{userId}/progress
   */
  updateUserProgress(
    userId: string,
    data: UserProgressUpdateRequest
  ): Promise<UserProgressResponse>;
}
```

### New API Types

```typescript
// Request type for the new endpoint
interface UserProgressUpdateRequest {
  type: ActivityType;
  category: ProgressCategory;
  completed: string[];
}

// Response type for the new endpoint
interface UserProgressResponse {
  id: string;
  user: ProgressUser;
  type: ActivityType;
  category: ProgressCategory;
  completed: string[];
  createdAt: string;
  updatedAt: string;
}

// Updated ProgressCategory to use "maze" instead of "labyrinth" (matches system data)
export type ProgressCategory =
  | "how_to_move"
  | "how_to_play"
  | "mate-in-one"
  | "mate-in-two"
  | "basic-tactics"
  | "maze"; // Replaces "labyrinth" to match CHESS_PUZZLES data and routes
```

### HTTP Client Integration

```typescript
class ProgressService {
  // Existing methods...

  /**
   * Update user progress by userId
   * POST /user/{userId}/progress
   */
  async updateUserProgress(
    userId: string,
    data: UserProgressUpdateRequest
  ): Promise<UserProgressResponse> {
    return httpClient.post<UserProgressResponse>(
      `/user/${userId}/progress`,
      data
    );
  }
}
```

## Data Models

### Request/Response Models

```typescript
// Input data structure (matches your example)
interface UserProgressUpdateRequest {
  type: ActivityType; // "tutorial" | "game"
  category: ProgressCategory; // e.g., "maze" (from existing categories)
  completed: string[]; // e.g., ["1"]
}

// Response data structure
interface UserProgressResponse {
  id: string;
  user: ProgressUser; // Uses existing ProgressUser interface
  type: ActivityType;
  category: ProgressCategory;
  completed: string[];
  createdAt: string;
  updatedAt: string;
}

// Existing categories in system:
// - "how_to_move"
// - "how_to_play"
// - "mate-in-one"
// - "mate-in-two"
// - "basic-tactics"
// - "labyrinth"
// - "maze" (already exists in CHESS_PUZZLES)
```

### Validation Schema

```typescript
// Client-side validation
const validateUserProgressRequest = (
  data: UserProgressUpdateRequest
): boolean => {
  // Validate type
  if (!["tutorial", "game"].includes(data.type)) {
    throw new Error("Invalid type. Must be 'tutorial' or 'game'");
  }

  // Validate category
  const validCategories: ProgressCategory[] = [
    "how_to_move",
    "how_to_play",
    "mate-in-one",
    "mate-in-two",
    "basic-tactics",
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

  return true;
};

// UUID validation for userId
const validateUserId = (userId: string): boolean => {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(userId);
};
```

## Error Handling

### Error Response Types

```typescript
interface ApiErrorResponse {
  error: string;
  message: string;
  statusCode: number;
  timestamp: string;
}

// Specific error types for the endpoint
type UserProgressErrorType =
  | "INVALID_USER_ID"
  | "USER_NOT_FOUND"
  | "INVALID_REQUEST_DATA"
  | "DATABASE_ERROR"
  | "UNAUTHORIZED";
```

### Error Handling Strategy

```typescript
class ProgressService {
  async updateUserProgress(
    userId: string,
    data: UserProgressUpdateRequest
  ): Promise<UserProgressResponse> {
    try {
      // Validate userId format
      if (!validateUserId(userId)) {
        throw new Error("Invalid userId format. Must be a valid UUID.");
      }

      // Validate request data
      validateUserProgressRequest(data);

      // Make API call
      return await httpClient.post<UserProgressResponse>(
        `/user/${userId}/progress`,
        data
      );
    } catch (error) {
      // Enhanced error handling
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const errorData = error.response?.data as ApiErrorResponse;

        switch (status) {
          case 400:
            throw new Error(
              `Bad Request: ${errorData?.message || "Invalid request data"}`
            );
          case 404:
            throw new Error(`User not found: ${userId}`);
          case 401:
            throw new Error("Unauthorized: Please log in again");
          case 500:
            throw new Error("Server error: Please try again later");
          default:
            throw new Error(
              `API Error: ${errorData?.message || error.message}`
            );
        }
      }

      throw error;
    }
  }
}
```

### Integration with Existing Error Handler

```typescript
// The existing errorHandler will automatically handle:
// - Token refresh on 401 errors
// - Logging of errors
// - Circuit breaker patterns
// - Retry mechanisms

// No additional error handling configuration needed
// as the httpClient already integrates with errorHandler
```

## Testing Strategy

### Unit Tests

```typescript
describe("ProgressService.updateUserProgress", () => {
  it("should successfully update user progress", async () => {
    const userId = "690d51f9-80b0-4e1b-9fa1-04c9f500fd72";
    const requestData = {
      type: "tutorial" as const,
      category: "maze",
      completed: ["1"],
    };

    const mockResponse: UserProgressResponse = {
      id: "progress-id-123",
      user: {
        id: userId,
        email: "test@example.com",
        username: "testuser",
        name: "Test User",
      },
      type: "tutorial",
      category: "maze",
      completed: ["1"],
      createdAt: "2025-01-01T00:00:00Z",
      updatedAt: "2025-01-01T00:00:00Z",
    };

    httpClient.post = jest.fn().mockResolvedValue(mockResponse);

    const result = await progressService.updateUserProgress(
      userId,
      requestData
    );

    expect(httpClient.post).toHaveBeenCalledWith(
      `/user/${userId}/progress`,
      requestData
    );
    expect(result).toEqual(mockResponse);
  });

  it("should throw error for invalid userId", async () => {
    const invalidUserId = "invalid-uuid";
    const requestData = {
      type: "tutorial" as const,
      category: "maze",
      completed: ["1"],
    };

    await expect(
      progressService.updateUserProgress(invalidUserId, requestData)
    ).rejects.toThrow("Invalid userId format");
  });

  it("should handle 404 user not found error", async () => {
    const userId = "690d51f9-80b0-4e1b-9fa1-04c9f500fd72";
    const requestData = {
      type: "tutorial" as const,
      category: "maze",
      completed: ["1"],
    };

    const mockError = {
      response: {
        status: 404,
        data: {
          error: "USER_NOT_FOUND",
          message: "User not found",
          statusCode: 404,
          timestamp: "2025-01-01T00:00:00Z",
        },
      },
    };

    httpClient.post = jest.fn().mockRejectedValue(mockError);

    await expect(
      progressService.updateUserProgress(userId, requestData)
    ).rejects.toThrow("User not found");
  });
});
```

### Integration Tests

```typescript
describe("User Progress Endpoint Integration", () => {
  it("should integrate with existing authentication flow", async () => {
    // Test that the endpoint works with existing auth tokens
    // Test token refresh on 401 errors
    // Test error handling integration
  });

  it("should work with existing Redux store integration", async () => {
    // Test that progress updates are reflected in Redux store
    // Test component re-rendering after progress update
  });
});
```

### API Contract Tests

```typescript
describe("API Contract Tests", () => {
  it("should match expected request/response format", () => {
    const requestData = {
      type: "tutorial",
      category: "maze",
      completed: ["1"],
    };

    // Validate request matches API specification
    expect(validateUserProgressRequest(requestData)).toBe(true);
  });

  it("should handle all expected error scenarios", () => {
    // Test 400, 401, 404, 500 error responses
    // Validate error response format
  });
});
```

## Implementation Details

### Service Method Implementation

```typescript
// In src/api/services/progress/progressService.ts

class ProgressService {
  // ... existing methods

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

  private isValidUUID(uuid: string): boolean {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  private validateProgressUpdateRequest(data: UserProgressUpdateRequest): void {
    if (!data.type || !["tutorial", "game"].includes(data.type)) {
      throw new Error("Invalid type. Must be 'tutorial' or 'game'");
    }

    const validCategories: ProgressCategory[] = [
      "how_to_move",
      "how_to_play",
      "mate-in-one",
      "mate-in-two",
      "basic-tactics",
      "maze",
    ];
    if (!data.category || !validCategories.includes(data.category)) {
      throw new Error(
        `Invalid category. Must be one of: ${validCategories.join(", ")}`
      );
    }

    if (!Array.isArray(data.completed)) {
      throw new Error("Completed must be an array");
    }

    if (!data.completed.every((item) => typeof item === "string")) {
      throw new Error("All completed items must be strings");
    }
  }
}
```

### Type Definitions Update

```typescript
// In src/api/types/progress.ts

// Add new types for the user progress endpoint
export interface UserProgressUpdateRequest {
  type: ActivityType;
  category: ProgressCategory; // Use existing ProgressCategory enum
  completed: string[];
}

export interface UserProgressResponse {
  id: string;
  user: ProgressUser;
  type: ActivityType;
  category: ProgressCategory;
  completed: string[];
  createdAt: string;
  updatedAt: string;
}

// Update existing ProgressCategory to replace "labyrinth" with "maze" (matches CHESS_PUZZLES data)
export type ProgressCategory =
  | "how_to_move"
  | "how_to_play"
  | "mate-in-one"
  | "mate-in-two"
  | "basic-tactics"
  | "maze"; // Replaces "labyrinth" to match routes and data structure
```

### Usage Examples

```typescript
// Example usage in a React component
const MazeTutorialComponent: React.FC = () => {
  const handleMazeCompletion = async (mazeId: string) => {
    try {
      const userId = "690d51f9-80b0-4e1b-9fa1-04c9f500fd72";

      const result = await progressService.updateUserProgress(userId, {
        type: "tutorial",
        category: "maze",
        completed: [mazeId],
      });

      console.log("Progress updated:", result);

      // Update local state or Redux store if needed
      // dispatch(updateProgressRecord(result));
    } catch (error) {
      console.error("Failed to update progress:", error);
      // Show user-friendly error message
    }
  };

  return (
    <div>
      <button onClick={() => handleMazeCompletion("1")}>Complete Maze 1</button>
    </div>
  );
};
```

### Integration with Existing Redux Store

```typescript
// The new endpoint can integrate with existing Redux patterns
// by dispatching actions after successful API calls

const handleProgressUpdate = async (
  userId: string,
  data: UserProgressUpdateRequest
) => {
  try {
    const result = await progressService.updateUserProgress(userId, data);

    // Dispatch to existing Redux store
    dispatch(
      updateProgressRecord({
        category: result.category,
        record: result,
      })
    );
  } catch (error) {
    dispatch(setError(error.message));
  }
};
```

## Security Considerations

### Authentication & Authorization

- Эндпоинт использует существующую систему аутентификации через `tokenManager`
- HTTP клиент автоматически добавляет Authorization header
- Поддерживается автоматическое обновление токенов через `tokenRefreshManager`

### Input Validation

- Валидация UUID формата для userId
- Валидация структуры данных запроса
- Санитизация входных данных

### Error Information Disclosure

- Ошибки не раскрывают внутреннюю структуру системы
- Используются общие сообщения об ошибках для пользователей
- Детальная информация логируется только на сервере

## Performance Considerations

### Caching Strategy

- Результаты могут кэшироваться в Redux store
- Локальное кэширование в localStorage для offline поддержки
- Оптимистичные обновления UI

### Request Optimization

- Дедупликация одновременных запросов
- Batch обновления при множественных изменениях
- Retry механизм для failed requests

### Monitoring & Metrics

- Интеграция с существующей системой логирования
- Метрики производительности API
- Error rate monitoring
