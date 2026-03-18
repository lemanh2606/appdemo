import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import sessionService from "./sessionService";

/**
 * apiClient.ts
 * ─────────────────────────────────────────────────────────────
 * HTTP client built on Axios for the entire application.
 * Centralizes base URL configuration, timeouts, interceptors,
 * and standardizes API responses and errors.
 */

// --- Base Configuration ---

const BASE_URL: string =
  process.env.EXPO_PUBLIC_API_URL ?? "https://api-qlvb.niq.vn/apiservice";

const TIMEOUT_MS = 15_000;

// --- Types ---

/** Standard structure of an API Error */
export interface ApiError {
  message: string;
  statusCode?: number;
  code?: string;
}

/** Standard structure of all API Responses */
export interface ApiResponse<T = unknown> {
  data: T | null;
  error: ApiError | null;
  ok: boolean;
}

// --- Axios Instance Creation ---

const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT_MS,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// --- Interceptors ---

// 1. Request Interceptor: Attach Authorization Token
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await sessionService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// 2. Response Interceptor: Handle Global Errors & Formatting
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Return standard ApiResponse format for successful responses
    // Note: If you prefer React Query to handle raw data, you can return response.data directly.
    return response;
  },
  async (error: AxiosError) => {
    // Log error for debugging
    console.error(`[API Error] ${error.config?.method?.toUpperCase()} ${error.config?.url}:`, error.response?.status, error.message);

    // Handle session expiration (e.g., 401 Unauthorized)
    if (error.response?.status === 401) {
      // Potentially trigger global logout or token refresh
      // await sessionService.clear(); 
      // Redirect logic can be triggered via observers or event emitters if needed
    }

    return Promise.reject(error);
  }
);

export default apiClient;

