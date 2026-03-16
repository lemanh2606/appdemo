/**
 * sessionService.ts
 * ─────────────────────────────────────────────────────────────
 * Quản lý phiên đăng nhập: lưu, đọc và xóa thông tin token
 * + dữ liệu người dùng vào AsyncStorage (bộ nhớ cục bộ an toàn).
 *
 * Các key lưu trữ:
 *   @auth_token        – JWT access token
 *   @auth_refreshToken – Refresh token
 *   @auth_user         – JSON string của StaffInfo
 * ─────────────────────────────────────────────────────────────
 */

import AsyncStorage from "@react-native-async-storage/async-storage";

import { StaffInfo } from "./authService";

// ─── Storage keys ─────────────────────────────────────────────
const KEYS = {
  TOKEN: "@auth_token",
  REFRESH_TOKEN: "@auth_refreshToken",
  USER: "@auth_user",
} as const;

// ─── Session data type ────────────────────────────────────────

/** Toàn bộ dữ liệu phiên đăng nhập đang hoạt động */
export interface SessionData {
  token: string;
  refreshToken: string;
  user: StaffInfo;
}

// ─── Hàm lưu phiên ────────────────────────────────────────────

/**
 * Lưu phiên đăng nhập sau khi login thành công.
 * Gọi hàm này ngay sau khi API trả về data.ok === true.
 */
async function save(session: SessionData): Promise<void> {
  // Lưu song song 3 key cùng lúc bằng Promise.all
  await Promise.all([
    AsyncStorage.setItem(KEYS.TOKEN, session.token),
    AsyncStorage.setItem(KEYS.REFRESH_TOKEN, session.refreshToken),
    AsyncStorage.setItem(KEYS.USER, JSON.stringify(session.user)),
  ]);
}

// ─── Hàm đọc phiên ────────────────────────────────────────────

/**
 * Đọc toàn bộ phiên đăng nhập từ bộ nhớ.
 * Trả về null nếu chưa đăng nhập hoặc token không tồn tại.
 */
async function get(): Promise<SessionData | null> {
  // Đọc song song 3 key cùng lúc bằng Promise.all
  const [token, refreshToken, userRaw] = await Promise.all([
    AsyncStorage.getItem(KEYS.TOKEN),
    AsyncStorage.getItem(KEYS.REFRESH_TOKEN),
    AsyncStorage.getItem(KEYS.USER),
  ]);

  // Nếu thiếu bất kỳ trường nào → coi như chưa đăng nhập
  if (!token || !refreshToken || !userRaw) return null;

  try {
    const user: StaffInfo = JSON.parse(userRaw);
    return { token, refreshToken, user };
  } catch {
    return null;
  }
}

/**
 * Chỉ lấy token (dùng khi cần đính kèm Authorization header).
 * Trả về null nếu chưa đăng nhập.
 */
async function getToken(): Promise<string | null> {
  return AsyncStorage.getItem(KEYS.TOKEN);
}

// ─── Hàm xóa phiên (logout) ───────────────────────────────────

/**
 * Xóa toàn bộ dữ liệu phiên đăng nhập.
 * Gọi hàm này khi người dùng nhấn Đăng xuất.
 */
async function clear(): Promise<void> {
  // Xóa song song 3 key cùng lúc bằng Promise.all
  await Promise.all([
    AsyncStorage.removeItem(KEYS.TOKEN),
    AsyncStorage.removeItem(KEYS.REFRESH_TOKEN),
    AsyncStorage.removeItem(KEYS.USER),
  ]);
}

// ─── Export ──────────────────────────────────────────────────

const sessionService = {
  save,
  get,
  getToken,
  clear,
};

export default sessionService;
