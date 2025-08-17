import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";
import tokenManager from "./tokenManager";
import errorHandler from "./errorHandler";
import tokenRefreshManager from "./tokenRefreshManager";

// API base configuration
// const API_BASE_URL = `http://167.99.40.216:3000`;
// const API_BASE_URL = `https://chess.web-professionals.info/server`;
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || process.env.API_BASE_URL;
const REQUEST_TIMEOUT = parseInt(
  process.env.REACT_APP_API_TIMEOUT || "10000",
  10
);

class HttpClient {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      timeout: REQUEST_TIMEOUT,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor for adding auth token
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const authHeader = tokenManager.getAuthHeader();
        if (authHeader) {
          config.headers.Authorization = authHeader;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor with TokenRefreshManager integration
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config;

        // Log error for debugging
        errorHandler.logError(error, originalRequest?.url);

        // Handle authentication errors
        if (this.shouldAttemptRefresh(error, originalRequest)) {
          console.log(
            "HttpClient: 401 error detected, queuing request for refresh",
            {
              url: originalRequest?.url,
              method: originalRequest?.method,
            }
          );

          try {
            // Queue the request with TokenRefreshManager
            return await tokenRefreshManager.queueRequest({
              originalRequest: originalRequest!,
              resolve: (value: any) => value,
              reject: (error: any) => Promise.reject(error),
            });
          } catch (refreshError) {
            console.error("HttpClient: Request failed after refresh attempt", {
              originalUrl: originalRequest?.url,
              error: refreshError,
            });

            // Handle authentication error through AuthService
            await this.handleAuthenticationFailure(error);

            return Promise.reject(error);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Check if we should attempt token refresh
  private shouldAttemptRefresh(
    error: AxiosError,
    originalRequest?: AxiosRequestConfig
  ): boolean {
    // Must be a 401 error
    if (!errorHandler.shouldRefreshToken(error)) {
      return false;
    }

    // Must have original request
    if (!originalRequest) {
      return false;
    }

    // Don't retry if already retried (prevent infinite loops)
    if ((originalRequest as any)._retry) {
      console.warn(
        "HttpClient: Request already retried, not attempting refresh again",
        {
          url: originalRequest.url,
        }
      );
      return false;
    }

    // Don't retry refresh endpoint itself
    if (originalRequest.url?.includes("/user/refresh")) {
      console.log("HttpClient: Not retrying refresh endpoint");
      return false;
    }

    // Don't retry logout endpoint
    if (originalRequest.url?.includes("/user/logout")) {
      console.log("HttpClient: Not retrying logout endpoint");
      return false;
    }

    // Check if TokenRefreshManager can attempt refresh
    if (!tokenRefreshManager.canAttemptRefresh()) {
      console.warn("HttpClient: TokenRefreshManager cannot attempt refresh", {
        circuitBreakerActive: tokenRefreshManager.isCircuitBreakerActive(),
        refreshInProgress: tokenRefreshManager.isRefreshInProgress(),
      });
      return false;
    }

    // Mark request as retried to prevent future retries
    (originalRequest as any)._retry = true;

    return true;
  }

  // Handle authentication failure
  private async handleAuthenticationFailure(error: AxiosError): Promise<void> {
    try {
      // Import authService dynamically to avoid circular dependency
      const { default: authService } = await import("./authService");

      // Let AuthService handle the error
      authService.handleAuthError(error);

      console.log("HttpClient: Authentication failure handled", {
        status: error.response?.status,
        url: error.config?.url,
      });
    } catch (importError) {
      console.error(
        "HttpClient: Failed to handle authentication failure",
        importError
      );
    }
  }

  // HTTP methods
  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.get<T>(url, config);
    return response.data;
  }

  public async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.axiosInstance.post<T>(url, data, config);
    return response.data;
  }

  public async patch<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.axiosInstance.patch<T>(url, data, config);
    return response.data;
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.delete<T>(url, config);
    return response.data;
  }

  // Get axios instance for advanced usage
  public getInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}

// Export singleton instance
const httpClient = new HttpClient();
export default httpClient;
