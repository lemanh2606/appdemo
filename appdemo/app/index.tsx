import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";

import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import authService from "../services/authService";
import { useAuth } from "./_layout";

import { AuthFooter } from "../src/components/auth/AuthFooter";
import { AuthHeader } from "../src/components/auth/AuthHeader";
import { CustomButton } from "../src/components/ui/CustomButton";
import { CustomInput } from "../src/components/ui/CustomInput";

const { height } = Dimensions.get("window"); // Kéo giá trị chiều cao của thiết bị ra tại đây

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { signIn } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert(
        "Thiếu thông tin",
        "Vui lòng nhập tên đăng nhập và mật khẩu.",
      );
      return;
    }

    setIsLoading(true);

    try {
      const result = await authService.login(username.trim(), password);

      console.log("result", result);

      // request thành công + login thành công
      if (result.ok && result.data?.success) {
        await signIn({
          token: result.data.token,
          refreshToken: result.data.refreshToken,
          user: result.data.staff,
        });

        router.replace("/(tabs)");
      } else if (result.ok && result.data && !result.data.success) {
        // API trả về lỗi logic (sai mật khẩu, bị khóa...)
        Alert.alert(
          "Đăng nhập thất bại",
          result.data.message || "Vui lòng kiểm tra lại thông tin đăng nhập.",
        );
      } else {
        // lỗi network / HTTP
        Alert.alert(
          "Lỗi kết nối",
          result.error?.message || "Không thể kết nối tới máy chủ.",
        );
      }
    } catch (error) {
      console.log("LOGIN ERROR:", error);

      Alert.alert("Lỗi hệ thống", "Đã có lỗi xảy ra. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // KeyboardAvoidingView có tác dụng lớn trong iOS. Nhờ có nó form sẽ đẩy lên và bàn phím ảo sẽ không che che khuất màn hình text box
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Tính năng này che phủ toàn bộ màn hình, chỉ để nhận biết sự kiện nhấp của ngón tay ngoài vùng form để làm thao tác 1 là -> Ản bàn phím đi  */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          bounces={false}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.innerContainer, { minHeight: height }]}>
            {/* Thanh trên đỉnh như các hình cục Pin điện thoại làm nổi bật sáng với nền tối. */}
            <StatusBar style="light" />

            {/* Background có phần ở trên (25% chiều cao đt) tạo ảo ảnh là có phần nền mầu xanh ở trên nhưng không chạy hết trang của điện thoại */}
            <View style={styles.topBackground} />

            {/* Wrapper chứa UI thật (Nó bắt đầu là nền trắng phía dưới bị nhô cao bao phủ lấy viền xanh.) */}
            <View style={styles.card}>
              {/* Sử dụng Component Logo có sẵn cho gọn. */}
              <AuthHeader />

              {/* Container Khúc Form (Tên đăng nhập / Password)  */}
              <View style={styles.formContainer}>
                {/* Box Đầu Vào Dữ Liệu Tự Chế (Ô Tên Đăng Nhập)  */}
                <CustomInput
                  label="Tên đăng nhập"
                  placeholder="Nhập tên đăng nhập"
                  iconName="person-outline" // Chuyển string biểu tượng
                  value={username}
                  onChangeText={setUsername}
                />

                {/* Box Đầu Vào Dữ Liệu Tự Chế thứ 2 (Ô Mã Mật Khẩu, thuộc tính secureTextEntry có)  */}
                <CustomInput
                  label="Mật khẩu"
                  placeholder="Nhập mật khẩu"
                  iconName="lock-closed-outline"
                  secureTextEntry={true} // Bật tính năng mã hóa dấu sao hiển thị mật khẩu
                  value={password}
                  onChangeText={setPassword}
                />

                {/* Box Hàng Kéo Dài 2 Bên Chứa "Ghi nhớ" và "Quên mật khẩu" */}
                <View style={styles.optionsRow}>
                  {/* Nút giả Lập Checkbox tích vào */}
                  <TouchableOpacity
                    style={styles.checkboxContainer}
                    onPress={() => setRememberMe(!rememberMe)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={rememberMe ? "checkbox" : "square-outline"}
                      size={20}
                      color={rememberMe ? "#2563EB" : "#9CA3AF"}
                    />
                    <Text style={styles.rememberText}>Ghi nhớ đăng nhập</Text>
                  </TouchableOpacity>

                  {/* Chữ đường dẫn link text không cần box ảo */}
                  <TouchableOpacity activeOpacity={0.7}>
                    <Text style={styles.forgotPassword}>Quên mật khẩu?</Text>
                  </TouchableOpacity>
                </View>

                {/* Nút bấm Gửi Form – hiển thị loading khi đang gọi API */}
                <CustomButton
                  title={isLoading ? "" : "ĐĂNG NHẬP"}
                  onPress={handleLogin}
                  disabled={isLoading}
                  icon={
                    isLoading ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : undefined
                  }
                />
              </View>

              <View style={{ marginTop: "auto" }}>
                <AuthFooter />
              </View>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

// Bảng chứa hệ thống kích thước và mã màu
const styles = StyleSheet.create({
  container: {
    flex: 1, // Chiếm 100% tỷ lệ khoảng trống
    backgroundColor: "#1E4DB7", // Màu nền xanh dương ngập mặt ở đỉnh màn hình
  },
  innerContainer: {
    flex: 1, // Layout full khoảng trống, không bọc tràn ra 2 bên
  },
  topBackground: {
    // Chiều cao bị khống chế bằng 25% màn hình sử dụng thư viện Dimension
    height: height * 0.25,
  },
  card: {
    flex: 1,
    backgroundColor: "#FFFFFF", // Form màu trắng đắp ở dưới kéo dài
    borderTopLeftRadius: 16, // Bị cong mép phần cắt trên cùng giao nhau với màu xanh
    borderTopRightRadius: 16,
    paddingHorizontal: 24, // Dãn lề từ mép màn hình trái và phải vào
    paddingTop: 32, // Bỏ phần lề trên
    // Thuộc tính đổ bóng chân thật
    elevation: 8, // Cái này cho môi trường Android để hắt bóng card
    shadowColor: "#000", // Apple: màu bóng hắt
    shadowOffset: { width: 0, height: -2 }, // Apple đổ bóng ngược lên trên
    shadowOpacity: 0.1, // Apple
    shadowRadius: 10, // Apple
  },
  formContainer: {
    flex: 1,
    gap: 12,
  },
  optionsRow: {
    flexDirection: "row", // Chuyển giao diện cột chia làm 2 về ngang
    justifyContent: "space-between", // Trải thẳng hàng ra 2 mút để lấy khoảng rộng ở giữa
    alignItems: "center", // Căn 2 phần tử về vị trí ở ngay hàng dọc chính giữa
    marginBottom: 12,
    marginTop: 8,
    // Mẹo hút đẩy sát lên form trên
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center", // Logo và dòng text ở cùng đường trung trực với nhau
  },
  rememberText: {
    marginLeft: 8, // Khoảng dãn với cái tích V là 8
    fontSize: 14,
    color: "#4B5563",
  },
  forgotPassword: {
    fontFamily: "Inter",
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 21,
    letterSpacing: -0.15,
    textAlign: "center",
    color: "#155DFC",
  },
});
