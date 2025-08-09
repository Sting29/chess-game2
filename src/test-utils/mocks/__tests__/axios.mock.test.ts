import {
  mockAxios,
  setupAxiosMocks,
  createMockAxiosError,
  createMockAxiosResponse,
} from "../axios.mock";

describe("Axios Mock System", () => {
  beforeEach(() => {
    setupAxiosMocks();
  });

  test("should create mock axios instance", () => {
    expect(mockAxios).toBeDefined();
    expect(mockAxios.get).toBeDefined();
    expect(mockAxios.post).toBeDefined();
    expect(mockAxios.create).toBeDefined();
    expect(mockAxios.interceptors).toBeDefined();
  });

  test("should create mock axios error", () => {
    const error = createMockAxiosError(404, "Not Found");

    expect(error.response.status).toBe(404);
    expect(error.response.data.message).toBe("Not Found");
    expect(error.isAxiosError).toBe(true);
  });

  test("should create mock axios response", () => {
    const response = createMockAxiosResponse({ test: "data" }, 200);

    expect(response.data).toEqual({ test: "data" });
    expect(response.status).toBe(200);
    expect(response.statusText).toBe("OK");
  });

  test("should setup axios mocks correctly", () => {
    // Mock a response
    mockAxios.get.mockResolvedValue({ data: { test: "value" } });

    // Test the mock
    expect(mockAxios.get).toHaveBeenCalledTimes(0);

    // Call the mock
    mockAxios.get("/test");

    expect(mockAxios.get).toHaveBeenCalledTimes(1);
    expect(mockAxios.get).toHaveBeenCalledWith("/test");
  });
});
