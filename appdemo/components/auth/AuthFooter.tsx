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
    alignItems: "center", // Canh lề ở giữa
    paddingBottom: 24,
    // Bọc padding để giãn chân trang với màn hình
  },
  footerText: {
    fontSize: 12,
    color: "#9CA3AF", // Màu xám nhạt hiện đại (Không gây chú ý quá mức)
  },
});
