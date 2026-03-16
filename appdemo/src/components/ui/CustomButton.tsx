import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

// Khai báo kiểu dữ liệu cho Button để báo lỗi nếu truyển sai
interface CustomButtonProps {
  title: string;          // Tên hiển thị trên nút (VD: "ĐĂNG NHẬP")
  onPress: () => void;    // Hàm sẽ chạy khi người dùng bấm
  disabled?: boolean;     // Vô hiệu hóa nút (VD: khi đang loading)
  icon?: React.ReactNode; // Icon/spinner hiển thị thay thế title khi loading
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  disabled = false,
  icon,
}) => {
  return (
    // TouchableOpacity cung cấp hiệu ứng làm mờ khi bấm nhẹ lên
    <TouchableOpacity
      style={[styles.button, disabled && styles.buttonDisabled]}
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled}
    >
      {/* Nếu có icon (VD: spinner loading) thì hiển thị icon, ngược lại hiển thị chữ */}
      {icon ?? <Text style={styles.buttonText}>{title}</Text>}
    </TouchableOpacity>
  );
};

// Khu vực quản lý màu sắc và kích cỡ
const styles = StyleSheet.create({
  button: {
    backgroundColor: "#2563EB",
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",

    paddingVertical: 12,
    paddingHorizontal: 16,

    elevation: 3, // Android shadow

    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  // Style khi nút bị vô hiệu hóa (giảm opacity để báo hiệu trạng thái)
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#FFFFFF", // Chữ màu trắng
    fontSize: 14,
    fontWeight: "600", // Khá nét và mạnh
  },
});
