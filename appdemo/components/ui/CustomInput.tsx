import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Định nghĩa kiểu dữ liệu cho trường (props) của component 
interface CustomInputProps {
  label: string; // Tên nhãn hiển thị bên trên ô nhập (vd: "Tên đăng nhập")
  placeholder: string; // Chữ gợi ý mờ hiển thị bên trong ô
  iconName: keyof typeof Ionicons.glyphMap; // Tên icon từ danh sách của thư viện Ionicons
  secureTextEntry?: boolean; // Tùy chọn để ẩn nội dung nhập (dùng cho mật khẩu)
  value: string; // Giá trị hiện tại của ô người dùng gõ
  onChangeText: (text: string) => void; // Hàm gọi khi văn bản thay đổi
}

export const CustomInput: React.FC<CustomInputProps> = ({
  label,
  placeholder,
  iconName,
  secureTextEntry,
  value,
  onChangeText,
}) => {
  // Trạng thái kiểm soát việc hiện hoặc ẩn mật khẩu người dùng
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <View style={styles.inputContainer}>
      {/* Hiển thị Tên trường phía trên với màu sắc tối giản */}
      <Text style={styles.label}>{label}</Text>

      {/* Vùng bao bọc icon chính và ô TextInput */}
      <View style={styles.inputWrapper}>
        {/* Biểu tượng hiển thị bên trái (VD: hình người hoặc chìa khóa) */}
        <Ionicons name={iconName} size={20} color="#9CA3AF" style={styles.icon} />
        
        {/* Component nhập liệu có sẵn của React Native */}
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          // Mật khẩu sẽ bị ẩn đi nếu thuộc tính secureTextEntry được bật 
          // và người dùng chưa bật nút 'con mắt' xem mật khẩu
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          value={value}
          onChangeText={onChangeText}
        />

        {/* Nút bật/tắt con mắt hiển thị mật khẩu nếu là loại mật khẩu */}
        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            style={styles.eyeIcon}
            activeOpacity={0.7} // Giảm độ đậm khi nhấn xuống
          >
            <Ionicons
              name={isPasswordVisible ? 'eye-outline' : 'eye-off-outline'}
              size={20}
              color="#9CA3AF"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

// Định nghĩa file style để có thể dễ đọc các thông số CSS ở đây
const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 20, // Tách khoảng cách giữa các khối nhập liệu
  },
  label: {
    fontSize: 14,
    fontWeight: '500', // Đậm chữ mức vừa phải
    color: '#374151',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row', // Sắp xếp icon, ô nhập thành hàng dọc
    alignItems: 'center', // Canh lề ở giữa theo chiều dọc
    borderWidth: 1, // Đường viền 1px
    borderColor: '#D1D5DB', // Màu đường viền nhạt
    borderRadius: 8, // Bo cong mép ô nhập form
    backgroundColor: '#FFFFFF',
    height: 48, // Chiều cao dễ bấm
  },
  icon: {
    paddingHorizontal: 12,
  },
  input: {
    flex: 1, // Trải dài ô nhập liệu tự do trên phần không gian còn lại
    height: '100%',
    color: '#1F2937', // Màu chữ text input chính
    fontSize: 14,
  },
  eyeIcon: {
    paddingHorizontal: 12, // Dài padding tạo khu vực bấm vào con mắt
  },
});
