/**
 * apiClient.ts
 * ─────────────────────────────────────────────────────────────
 * HTTP client nền tảng dùng chung cho toàn bộ ứng dụng.
 * Tập trung cấu hình base URL, timeout, header mặc định và
 * xử lý lỗi HTTP tại một nơi duy nhất.
 * ─────────────────────────────────────────────────────────────
 */

/**
 * Địa chỉ gốc (base URL) của toàn bộ API backend.
 * Được đọc tự động từ file .env bởi Expo (yêu cầu prefix EXPO_PUBLIC_).
 */
const BASE_URL: string =
  process.env.EXPO_PUBLIC_API_URL ?? "https://api-qlvb.niq.vn/apiservice";

console.log("BASE_URL:", BASE_URL);

/** Thời gian tối đa chờ phản hồi từ server (mili-giây) */
const TIMEOUT_MS = 15_000;

// ─── Kiểu dữ liệu chung ──────────────────────────────────────

/** Cấu trúc response lỗi trả về từ server */
export interface ApiError {
  message: string;
  statusCode?: number;
}

/** Cấu trúc chung cho mọi response thành công / thất bại */
export interface ApiResponse<T = unknown> {
  data: T | null;
  error: ApiError | null;
  ok: boolean;
}

// ─── Helper: timeout wrapper ──────────────────────────────────

/**
 * Bọc một Promise với một timeout để tránh treo vô hạn.
 * @param promise  Promise gốc cần thực thi
 * @param ms       Thời gian chờ tính bằng mili-giây
 */
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error(`Request timed out after ${ms}ms`)),
      ms,
    );
    promise
      .then((result) => {
        clearTimeout(timer);
        resolve(result);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

// ─── Core request function ────────────────────────────────────

/**
 * Hàm gửi HTTP request cơ bản.
 * @param endpoint  Đường dẫn API (VD: "/Auth/login")
 * @param options   Tuỳ chọn fetch giống RequestInit của Web API
 * @returns         ApiResponse<T> – bao gồm data, error, ok
 */
async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const url = `${BASE_URL}${endpoint}`;

  // Merge header mặc định – tự động đặt Content-Type JSON
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(options.headers ?? {}),
  };

  try {
    const response = await withTimeout(
      fetch(url, { ...options, headers }),
      TIMEOUT_MS,
    );

    // Đọc body một lần duy nhất
    const text = await response.text();

    // Cố gắng parse thành JSON, nếu không được thì giữ nguyên text
    let parsed: unknown;
    try {
      parsed = text ? JSON.parse(text) : null;
    } catch {
      parsed = text;
    }

    if (!response.ok) {
      // Server trả về HTTP error (4xx, 5xx)
      const message =
        (parsed as { message?: string })?.message ??
        `HTTP ${response.status}: ${response.statusText}`;

      return {
        data: null,
        error: { message, statusCode: response.status },
        ok: false,
      };
    }

    return { data: parsed as T, error: null, ok: true };
  } catch (err: unknown) {
    // Lỗi mạng hoặc timeout
    const message =
      err instanceof Error ? err.message : "Lỗi kết nối không xác định";
    return { data: null, error: { message }, ok: false };
  }
}

// ─── Xuất các method tiện lợi ────────────────────────────────

const apiClient = {
  /**
   * Gửi HTTP GET
   * @param endpoint  VD: "/User/profile"
   * @param headers   Header bổ sung nếu cần (VD: Authorization)
   */
  get<T>(endpoint: string, headers?: HeadersInit): Promise<ApiResponse<T>> {
    return request<T>(endpoint, { method: "GET", headers });
  },

  /**
   * Gửi HTTP POST với body JSON
   * @param endpoint  VD: "/Auth/login"
   * @param body      Đối tượng JavaScript sẽ được stringify thành JSON
   * @param headers   Header bổ sung nếu cần
   */
  post<T>(
    endpoint: string,
    body: unknown,
    headers?: HeadersInit,
  ): Promise<ApiResponse<T>> {
    return request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
      headers,
    });
  },

  /**
   * Gửi HTTP PUT với body JSON
   */
  put<T>(
    endpoint: string,
    body: unknown,
    headers?: HeadersInit,
  ): Promise<ApiResponse<T>> {
    return request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
      headers,
    });
  },

  /**
   * Gửi HTTP DELETE
   */
  delete<T>(endpoint: string, headers?: HeadersInit): Promise<ApiResponse<T>> {
    return request<T>(endpoint, { method: "DELETE", headers });
  },
};

export default apiClient;
