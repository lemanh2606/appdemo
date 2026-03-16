import React from "react";
import { StyleSheet, Text, View } from "react-native";

// Phần chân trang bản quyền năm phát triển
export const AuthFooter = () => {
  return (
    // Box vùng cho dòng chữ bản quyển
    <View style={styles.footerContainer}>
      <Text style={styles.footerText}>
        © 2025 Bộ Tài Chính - The Ministry of Finance
      </Text>
    </View>
  );
};

// Khai báo Style dưới dạng CSS
const styles = StyleSheet.create({
  footerContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.15,
    textAlign: "center",
    color: "#9CA3AF",
  },
});
