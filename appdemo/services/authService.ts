/**
 * authService.ts
 * ─────────────────────────────────────────────────────────────
 * Tập hợp tất cả các hàm liên quan đến xác thực người dùng:
 *   • login   – Đăng nhập, lấy token, lưu session
 *   • logout  – Xóa session local
 * ─────────────────────────────────────────────────────────────
 */

import * as Device from "expo-device";

import apiClient, { ApiResponse } from "./apiClient";
import sessionService from "./sessionService";

// ─── Kiểu dữ liệu ────────────────────────────────────────────

/** Payload gửi lên server khi đăng nhập */
export interface LoginPayload {
  DeviceCode: string; // Mã thiết bị (brand-model-buildId)
  Password: string; // Mật khẩu người dùng nhập
  UserName: string; // Tên đăng nhập người dùng nhập
}

/** Thông tin nhân viên/người dùng trong response */
export interface StaffInfo {
  id: number;
  userName: string;
  displayName: string; // Tên hiển thị đầy đủ
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  mobile?: string;
  departmentId: number;
  departmentName: string; // Tên phòng ban
  positionName: string; // Chức danh
  unitName: string; // Tên đơn vị
  defaultRoleId: number;
  isAdministrator: boolean;
  isLocked: boolean;
  linkImage?: string; // URL ảnh đại diện
}

/** Thông tin vai trò hiện tại */
export interface CurrentRole {
  id: number;
  name: string; // Tên vai trò (VD: "Chuyên viên")
  code: string;
  departmentId: number;
  departmentName: string;
  positionName: string;
  unitName: string;
  description?: string;
}

/**
 * Cấu trúc response đầy đủ từ API /Auth/login
 * Dựa theo response thực tế của server.
 */
export interface LoginSuccessResponse {
  success: true;
  message: string;
  token: string;
  refreshToken: string;
  tokenVersion: number;
  staff: StaffInfo;
  currentRole: CurrentRole;
  roles: CurrentRole[];
}

export interface LoginFailResponse {
  success: false;
  message: string;
}

export type LoginResponse = LoginSuccessResponse | LoginFailResponse;

// ─── Hàm login ───────────────────────────────────────────────

/**
 * Đăng nhập người dùng.
 *
 * Flow:
 *  1. Tạo DeviceCode từ thông tin thiết bị
 *  2. Gọi POST /Auth/login
 *  3. Nếu thành công → lưu token + user vào AsyncStorage
 *
 * @param username  Tên đăng nhập do người dùng nhập
 * @param password  Mật khẩu do người dùng nhập
 * @returns         ApiResponse<LoginResponse>
 *                    • ok = true  → data chứa token và thông tin user
 *                    • ok = false → error chứa message lỗi từ server
 */
async function login(
  username: string,
  password: string,
): Promise<ApiResponse<LoginResponse>> {
  // Tạo device code từ thông tin phần cứng thiết bị
  const deviceCode = `${Device.brand}-${Device.modelName}-${Device.osBuildId}`;

  const payload: LoginPayload = {
    DeviceCode: deviceCode,
    Password: password,
    UserName: username,
  };

  const response = await apiClient.post<LoginResponse>("/Auth/login", payload);

  if (response.ok && response.data?.success && "token" in response.data) {
    await sessionService.save({
      token: response.data.token,
      refreshToken: response.data.refreshToken,
      user: response.data.staff,
    });
  }

  return response;
}

// ─── Hàm logout ──────────────────────────────────────────────

/**
 * Đăng xuất người dùng.
 * Xóa toàn bộ dữ liệu phiên khỏi bộ nhớ cục bộ.
 * (Nếu server có API logout, thêm lời gọi ở đây trước khi clear.)
 */
async function logout(): Promise<void> {
  await sessionService.clear();
}

// ─── Export ──────────────────────────────────────────────────

const authService = {
  login,
  logout,
};

export default authService;
