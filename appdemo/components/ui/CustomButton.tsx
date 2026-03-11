import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

// Khai báo kiểu dữ liệu cho Button để báo lỗi nếu truyển sai
interface CustomButtonProps {
  title: string; // Tên hiển thị trên nút (VD: "ĐĂNG NHẬP")
  onPress: () => void; // Hàm sẽ chạy khi người dùng bấm
}

export const CustomButton: React.FC<CustomButtonProps> = ({ title, onPress }) => {
  return (
    // TouchableOpacity cung cấp hiệu ứng làm mờ khi bấm nhẹ lên
    <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

// Khu vực quản lý màu sắc và kích cỡ
const styles = StyleSheet.create({
  button: {
    backgroundColor: '#2563EB', // Màu chủ đạo ứng dụng - Màu xanh dương mạnh mẽ
    height: 48,
    borderRadius: 8, // Bo góc cho mềm mại
    justifyContent: 'center', // Đẩy các chữ vào thẳng đường giữa cho hài hoà
    alignItems: 'center', // Căn chỉnh giữa theo hàng dọc
  },
  buttonText: {
    color: '#FFFFFF', // Chữ màu trắng
    fontSize: 14,
    fontWeight: '600', // Khá nét và mạnh 
  },
});
