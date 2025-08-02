import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";
import tokenManager from "./tokenManager";
import errorHandler from "./errorHandler";

// API base configuration
// const API_BASE_URL = `http://167.99.40.216:3000`;
const API_BASE_URL = `https://chess.web-professionals.info/server`;
// const API_BASE_URL =
//   process.env.REACT_APP_API_BASE_URL || process.env.API_BASE_URL;
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

    // Response interceptor for handling common responses and errors
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config;

        // Log error for debugging
        errorHandler.logError(error, originalRequest?.url);

        // Handle token refresh for 401 errors
        if (
          errorHandler.shouldRefreshToken(error) &&
          originalRequest &&
          !(originalRequest as any)._retry
        ) {
          (originalRequest as any)._retry = true;

          try {
            // Import authService dynamically to avoid circular dependency
            const { default: authService } = await import("./authService");

            // Try to refresh token
            await authService.refreshToken();

            // Update authorization header with new token
            const newAuthHeader = tokenManager.getAuthHeader();
            if (newAuthHeader) {
              originalRequest.headers.Authorization = newAuthHeader;
            }

            // Retry the original request
            return this.axiosInstance(originalRequest);
          } catch (refreshError) {
            // Refresh failed, clear tokens
            tokenManager.clearTokens();

            // Log refresh error
            console.error("Token refresh failed:", refreshError);

            // Reject with original error
            return Promise.reject(error);
          }
        }

        return Promise.reject(error);
      }
    );
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
