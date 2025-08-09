// Comprehensive axios mock system

export interface MockAxiosInstance {
  get: jest.MockedFunction<any>;
  post: jest.MockedFunction<any>;
  patch: jest.MockedFunction<any>;
  delete: jest.MockedFunction<any>;
  put: jest.MockedFunction<any>;
  interceptors: {
    request: {
      use: jest.MockedFunction<any>;
      eject: jest.MockedFunction<any>;
    };
    response: {
      use: jest.MockedFunction<any>;
      eject: jest.MockedFunction<any>;
    };
  };
  defaults: {
    headers: {
      common: Record<string, string>;
      get: Record<string, string>;
      post: Record<string, string>;
      put: Record<string, string>;
      patch: Record<string, string>;
      delete: Record<string, string>;
    };
    timeout: number;
    baseURL?: string;
  };
}

// Create mock axios instance
export const createMockAxiosInstance = (): MockAxiosInstance => ({
  get: jest.fn().mockResolvedValue({ data: {} }),
  post: jest.fn().mockResolvedValue({ data: {} }),
  patch: jest.fn().mockResolvedValue({ data: {} }),
  delete: jest.fn().mockResolvedValue({ data: {} }),
  put: jest.fn().mockResolvedValue({ data: {} }),
  interceptors: {
    request: {
      use: jest.fn(),
      eject: jest.fn(),
    },
    response: {
      use: jest.fn(),
      eject: jest.fn(),
    },
  },
  defaults: {
    headers: {
      common: {},
      get: {},
      post: {},
      put: {},
      patch: {},
      delete: {},
    },
    timeout: 5000,
  },
});

// Global mock axios instance
export const mockAxiosInstance = createMockAxiosInstance();

// Mock axios create function
export const mockAxiosCreate = jest.fn().mockReturnValue(mockAxiosInstance);

// Mock axios default export
export const mockAxios = {
  ...mockAxiosInstance,
  create: mockAxiosCreate,
  isAxiosError: jest.fn().mockReturnValue(false),
  CancelToken: {
    source: jest.fn().mockReturnValue({
      token: {},
      cancel: jest.fn(),
    }),
  },
  Cancel: jest.fn(),
  isCancel: jest.fn().mockReturnValue(false),
};

// Helper functions for tests
export const setupAxiosMocks = () => {
  // Reset all mocks
  Object.values(mockAxiosInstance).forEach((method) => {
    if (typeof method === "function" && method.mockReset) {
      method.mockReset();
    }
  });

  // Reset interceptors
  mockAxiosInstance.interceptors.request.use.mockReset();
  mockAxiosInstance.interceptors.response.use.mockReset();
  mockAxiosCreate.mockReset();

  // Set default return values
  mockAxiosInstance.get.mockResolvedValue({ data: {} });
  mockAxiosInstance.post.mockResolvedValue({ data: {} });
  mockAxiosInstance.patch.mockResolvedValue({ data: {} });
  mockAxiosInstance.delete.mockResolvedValue({ data: {} });
  mockAxiosInstance.put.mockResolvedValue({ data: {} });
  mockAxiosCreate.mockReturnValue(mockAxiosInstance);
};

// Mock HTTP error creator
export const createMockAxiosError = (
  status: number,
  message: string,
  config = {}
) => {
  const error = new Error(message) as any;
  error.response = {
    status,
    data: { message },
    headers: {},
    config,
  };
  error.config = config;
  error.isAxiosError = true;
  error.name = "AxiosError";
  error.toJSON = () => ({});
  return error;
};

// Mock successful response creator
export const createMockAxiosResponse = (
  data: any,
  status = 200,
  headers = {}
) => ({
  data,
  status,
  statusText: "OK",
  headers,
  config: {},
});

// Export for Jest manual mock
export default mockAxios;
