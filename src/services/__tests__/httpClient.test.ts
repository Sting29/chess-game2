import httpClient from "../httpClient";
import tokenManager from "../tokenManager";
import tokenRefreshManager from "../tokenRefreshManager";
import { AxiosError } from "axios";

// Mock dependencies
jest.mock("../tokenManager");
jest.mock("../tokenRefreshManager");
jest.mock("../errorHandler");
jest.mock("../authService", () => ({
  default: {
    handleAuthError: jest.fn(),
  },
}));

const mockTokenManager = tokenManager as jest.Mocked<typeof tokenManager>;
const mockTokenRefreshManager = tokenRefreshManager as jest.Mocked<
  typeof tokenRefreshManager
>;

// Mock axios
jest.mock("axios", () => ({
  create: jest.fn(() => ({
    interceptors: {
      request: {
        use: jest.fn(),
      },
      response: {
        use: jest.fn(),
      },
    },
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  })),
}));

describe("HttpClient", () => {
  let mockAxiosInstance: any;
  let requestInterceptor: any;
  let responseInterceptor: any;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.spyOn(console, "warn").mockImplementation(() => {});

    // Get the mocked axios instance
    const axios = require("axios");
    mockAxiosInstance = axios.create();

    // Capture interceptors
    mockAxiosInstance.interceptors.request.use.mockImplementation(
      (success: any) => {
        requestInterceptor = success;
      }
    );

    mockAxiosInstance.interceptors.response.use.mockImplementation(
      (success: any, error: any) => {
        responseInterceptor = { success, error };
      }
    );

    // Re-import httpClient to trigger constructor
    jest.resetModules();
    require("../httpClient");
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("request interceptor", () => {
    it("should add authorization header when token is available", () => {
      mockTokenManager.getAuthHeader.mockReturnValue("Bearer token-123");

      const config = { headers: {} };
      const result = requestInterceptor(config);

      expect(result.headers.Authorization).toBe("Bearer token-123");
    });

    it("should not add authorization header when no token", () => {
      mockTokenManager.getAuthHeader.mockReturnValue(null);

      const config = { headers: {} };
      const result = requestInterceptor(config);

      expect(result.headers.Authorization).toBeUndefined();
    });
  });

  describe("response interceptor", () => {
    it("should pass through successful responses", () => {
      const response = { data: "success", status: 200 };
      const result = responseInterceptor.success(response);

      expect(result).toBe(response);
    });

    it("should queue request for 401 errors when conditions are met", async () => {
      const mockError: AxiosError = {
        response: { status: 401 } as any,
        config: { url: "/api/test", method: "GET" },
        isAxiosError: true,
        name: "AxiosError",
        message: "Request failed with status code 401",
        toJSON: () => ({}),
      };

      mockTokenRefreshManager.canAttemptRefresh.mockReturnValue(true);
      mockTokenRefreshManager.queueRequest.mockResolvedValue({
        data: "success",
      });

      const errorHandler = require("../errorHandler").default;
      errorHandler.shouldRefreshToken.mockReturnValue(true);
      errorHandler.logError.mockImplementation(() => {});

      const result = await responseInterceptor.error(mockError);

      expect(mockTokenRefreshManager.queueRequest).toHaveBeenCalledWith({
        originalRequest: mockError.config,
        resolve: expect.any(Function),
        reject: expect.any(Function),
      });
      expect(result).toEqual({ data: "success" });
    });

    it("should not retry requests that are already retried", async () => {
      const mockError: AxiosError = {
        response: { status: 401 } as any,
        config: { url: "/api/test", method: "GET", _retry: true } as any,
        isAxiosError: true,
        name: "AxiosError",
        message: "Request failed with status code 401",
        toJSON: () => ({}),
      };

      const errorHandler = require("../errorHandler").default;
      errorHandler.shouldRefreshToken.mockReturnValue(true);
      errorHandler.logError.mockImplementation(() => {});

      await expect(responseInterceptor.error(mockError)).rejects.toBe(
        mockError
      );
      expect(mockTokenRefreshManager.queueRequest).not.toHaveBeenCalled();
    });

    it("should not retry refresh endpoint", async () => {
      const mockError: AxiosError = {
        response: { status: 401 } as any,
        config: { url: "/user/refresh", method: "POST" },
        isAxiosError: true,
        name: "AxiosError",
        message: "Request failed with status code 401",
        toJSON: () => ({}),
      };

      const errorHandler = require("../errorHandler").default;
      errorHandler.shouldRefreshToken.mockReturnValue(true);
      errorHandler.logError.mockImplementation(() => {});

      await expect(responseInterceptor.error(mockError)).rejects.toBe(
        mockError
      );
      expect(mockTokenRefreshManager.queueRequest).not.toHaveBeenCalled();
    });

    it("should not retry logout endpoint", async () => {
      const mockError: AxiosError = {
        response: { status: 401 } as any,
        config: { url: "/user/logout", method: "POST" },
        isAxiosError: true,
        name: "AxiosError",
        message: "Request failed with status code 401",
        toJSON: () => ({}),
      };

      const errorHandler = require("../errorHandler").default;
      errorHandler.shouldRefreshToken.mockReturnValue(true);
      errorHandler.logError.mockImplementation(() => {});

      await expect(responseInterceptor.error(mockError)).rejects.toBe(
        mockError
      );
      expect(mockTokenRefreshManager.queueRequest).not.toHaveBeenCalled();
    });

    it("should not retry when TokenRefreshManager cannot attempt refresh", async () => {
      const mockError: AxiosError = {
        response: { status: 401 } as any,
        config: { url: "/api/test", method: "GET" },
        isAxiosError: true,
        name: "AxiosError",
        message: "Request failed with status code 401",
        toJSON: () => ({}),
      };

      mockTokenRefreshManager.canAttemptRefresh.mockReturnValue(false);
      mockTokenRefreshManager.isCircuitBreakerActive.mockReturnValue(true);
      mockTokenRefreshManager.isRefreshInProgress.mockReturnValue(false);

      const errorHandler = require("../errorHandler").default;
      errorHandler.shouldRefreshToken.mockReturnValue(true);
      errorHandler.logError.mockImplementation(() => {});

      await expect(responseInterceptor.error(mockError)).rejects.toBe(
        mockError
      );
      expect(mockTokenRefreshManager.queueRequest).not.toHaveBeenCalled();
    });

    it("should handle authentication failure when refresh fails", async () => {
      const mockError: AxiosError = {
        response: { status: 401 } as any,
        config: { url: "/api/test", method: "GET" },
        isAxiosError: true,
        name: "AxiosError",
        message: "Request failed with status code 401",
        toJSON: () => ({}),
      };

      mockTokenRefreshManager.canAttemptRefresh.mockReturnValue(true);
      mockTokenRefreshManager.queueRequest.mockRejectedValue(
        new Error("Refresh failed")
      );

      const errorHandler = require("../errorHandler").default;
      errorHandler.shouldRefreshToken.mockReturnValue(true);
      errorHandler.logError.mockImplementation(() => {});

      const authService = require("../authService").default;

      await expect(responseInterceptor.error(mockError)).rejects.toBe(
        mockError
      );
      expect(authService.handleAuthError).toHaveBeenCalledWith(mockError);
    });

    it("should pass through non-401 errors", async () => {
      const mockError: AxiosError = {
        response: { status: 500 } as any,
        config: { url: "/api/test", method: "GET" },
        isAxiosError: true,
        name: "AxiosError",
        message: "Request failed with status code 500",
        toJSON: () => ({}),
      };

      const errorHandler = require("../errorHandler").default;
      errorHandler.shouldRefreshToken.mockReturnValue(false);
      errorHandler.logError.mockImplementation(() => {});

      await expect(responseInterceptor.error(mockError)).rejects.toBe(
        mockError
      );
      expect(mockTokenRefreshManager.queueRequest).not.toHaveBeenCalled();
    });
  });

  describe("HTTP methods", () => {
    beforeEach(() => {
      // Reset modules to get fresh httpClient instance
      jest.resetModules();
    });

    it("should call axios get method", async () => {
      const httpClient = require("../httpClient").default;
      const mockResponse = { data: "test data" };

      httpClient.getInstance().get.mockResolvedValue(mockResponse);

      const result = await httpClient.get("/test");

      expect(httpClient.getInstance().get).toHaveBeenCalledWith(
        "/test",
        undefined
      );
      expect(result).toBe("test data");
    });

    it("should call axios post method", async () => {
      const httpClient = require("../httpClient").default;
      const mockResponse = { data: "created" };
      const postData = { name: "test" };

      httpClient.getInstance().post.mockResolvedValue(mockResponse);

      const result = await httpClient.post("/test", postData);

      expect(httpClient.getInstance().post).toHaveBeenCalledWith(
        "/test",
        postData,
        undefined
      );
      expect(result).toBe("created");
    });

    it("should call axios patch method", async () => {
      const httpClient = require("../httpClient").default;
      const mockResponse = { data: "updated" };
      const patchData = { name: "updated" };

      httpClient.getInstance().patch.mockResolvedValue(mockResponse);

      const result = await httpClient.patch("/test", patchData);

      expect(httpClient.getInstance().patch).toHaveBeenCalledWith(
        "/test",
        patchData,
        undefined
      );
      expect(result).toBe("updated");
    });

    it("should call axios delete method", async () => {
      const httpClient = require("../httpClient").default;
      const mockResponse = { data: "deleted" };

      httpClient.getInstance().delete.mockResolvedValue(mockResponse);

      const result = await httpClient.delete("/test");

      expect(httpClient.getInstance().delete).toHaveBeenCalledWith(
        "/test",
        undefined
      );
      expect(result).toBe("deleted");
    });
  });
});
