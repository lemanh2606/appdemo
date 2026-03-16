import React from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";

export const AuthHeader = () => {
  return (
    // Box hiển thị khu vực logo + Tiêu đề
    <View style={styles.headerContainer}>
      {/* Component hỗ trợ tải logo từ url không tốn hiệu năng, resizeMode cho scale vừa phải độ phân giải */}
      <Image
        source={require("../../../assets/logo/logoBoTaiChinh.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Cụm tên ứng dụng ở tiêu đề */}
      <Text style={styles.titleText}>BỘ TÀI CHÍNH</Text>
      <Text style={styles.subtitleText}>THE MINISTRY OF FINANCE</Text>
    </View>
  );
};
const { width } = Dimensions.get("window");

const scale = width / 375; // 375 là width iPhone chuẩn trong Figma
const styles = StyleSheet.create({
  headerContainer: {
    // Đảm bảo cụm header không bao giờ bị méo khi căn giữa
    alignItems: "center",
    marginBottom: 32, // Khoảng cách đẩy form ra xa nó 1 chút
  },
  logo: {
    width: 81 * scale,
    height: 68 * scale,
    marginBottom: 16,
  },
  titleText: {
    fontFamily: "Inter",
    fontSize: 24,
    fontWeight: "800",
    lineHeight: 32,
    letterSpacing: 0.67,
    textAlign: "center",
    color: "#C10007",
    marginBottom: 4,
  },
  subtitleText: {
    fontFamily: "Inter",
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
    letterSpacing: 0.55,
    textAlign: "center",
    textTransform: "uppercase",
    color: "#4A5565",
  },
});
