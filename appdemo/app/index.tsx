import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { AuthFooter } from "../src/components/auth/AuthFooter";
import { AuthHeader } from "../src/components/auth/AuthHeader";
import { useLoginMutation } from "../hooks/api/useAuthApi";

/**
 * app/index.tsx — Màn hình Login (Điểm vào của ứng dụng)
 * ─────────────────────────────────────────────────────────────
 * Sử dụng Axios và TanStack Query để quản lý đăng nhập chuyên nghiệp.
 */

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const router = useRouter();
  const loginMutation = useLoginMutation();

  const handleLogin = async () => {
    // 1. Validate form đơn giản
    if (!username.trim() || !password.trim()) {
      Alert.alert("Thông báo", "Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu");
      return;
    }

    // 2. Thực hiện mutation login thông qua TanStack Query
    loginMutation.mutate(
      { UserName: username, Password: password },
      {
        onSuccess: (data) => {
          if (data.success) {
            // Expo router tự động xử lý redirect nhờ Stack.Protected trong _layout
            // Tuy nhiên có thể redirect thủ công để chắc chắn
            router.replace("/(tabs)");
          } else {
            Alert.alert("Lỗi đăng nhập", data.message || "Vui lòng kiểm tra lại thông tin.");
          }
        },
        onError: (error: any) => {
          const errMsg = error?.response?.data?.message || error.message || "Lỗi kết nối server";
          Alert.alert("Lỗi hệ thống", errMsg);
        },
      }
    );
  };

  const isLoading = loginMutation.isPending;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <StatusBar style="dark" />
          
          {/* Header với Logo */}
          <AuthHeader />

          {/* Form đăng nhập */}
          <View style={styles.formContainer}>
            {/* Input Tên đăng nhập */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Tên đăng nhập</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Nhập tên đăng nhập"
                  placeholderTextColor="#9CA3AF"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                  editable={!isLoading}
                />
              </View>
            </View>

            {/* Input Mật khẩu */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Mật khẩu</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Nhập mật khẩu"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  editable={!isLoading}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons 
                    name={showPassword ? "eye-off-outline" : "eye-outline"} 
                    size={20} 
                    color="#6B7280" 
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Hàng Ghi nhớ & Quên mật khẩu */}
            <View style={styles.actionsRow}>
              <TouchableOpacity 
                style={styles.rememberMeRow} 
                onPress={() => setRememberMe(!rememberMe)}
                activeOpacity={0.7}
              >
                <Ionicons 
                  name={rememberMe ? "checkbox" : "square-outline"} 
                  size={20} 
                  color={rememberMe ? "#C10007" : "#9CA3AF"} 
                />
                <Text style={styles.rememberMeText}>Ghi nhớ</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => Alert.alert("Thông báo", "Tính năng đang phát triển")}>
                <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
              </TouchableOpacity>
            </View>

            {/* Nút Đăng nhập */}
            <TouchableOpacity
              style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.loginButtonText}>ĐĂNG NHẬP</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer bản quyền */}
          <View style={styles.footerWrapper}>
            <AuthFooter />
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  formContainer: {
    marginTop: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontFamily: "Inter",
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontFamily: "Inter",
    fontSize: 16,
    color: "#111827",
    paddingVertical: 0, // Tránh lệch chữ trên Android
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  rememberMeRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  rememberMeText: {
    fontFamily: "Inter",
    fontSize: 14,
    color: "#4B5563",
    marginLeft: 8,
  },
  forgotPasswordText: {
    fontFamily: "Inter",
    fontSize: 14,
    color: "#2563EB",
    fontWeight: "600",
  },
  loginButton: {
    height: 56,
    backgroundColor: "#C10007",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loginButtonDisabled: {
    backgroundColor: "#FCA5A5",
  },
  loginButtonText: {
    fontFamily: "Inter",
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  footerWrapper: {
    marginTop: "auto",
    paddingTop: 40,
  },
});
