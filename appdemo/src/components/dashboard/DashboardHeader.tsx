import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// 1. Định nghĩa khuôn mẫu Dữ liệu và Sự kiện (Props) mà Component này có thể nhận từ ngoài truyền vào
interface DashboardHeaderProps {
  userName?: string;              // Tên hiển thị
  roleName?: string;              // Chức danh hiển thị
  onRolePress?: () => void;       // Sự kiện khi bấm vào ô chọn chức danh
  onNotificationPress?: () => void; // Sự kiện khi bấm vào quả chuông
  onLogoutPress?: () => void;     // Sự kiện khi bấm nút đăng xuất
}

export function DashboardHeader({
  userName = "Phạm Thị Thu Hồng",
  roleName = "Chuyên viên Cục quản lý đ...",
  onRolePress,
  onNotificationPress,
  onLogoutPress,
}: DashboardHeaderProps) {
  return (
    <LinearGradient
      colors={["#5B89ED", "#2563EB"]}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0 }}
      style={styles.headerContainer}
    >
      <SafeAreaView>
        <View style={styles.topRow}>
          <Text style={styles.welcomeText}>
            Xin chào! <Text style={styles.userName}>{userName}</Text>
          </Text>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.roleSelector}
            activeOpacity={0.8}
            onPress={onRolePress}
          >
            <View style={styles.roleIconContainer}>
              <Ionicons name="person-outline" size={16} color="#2563EB" />
            </View>
            <Text style={styles.roleText} numberOfLines={1}>
              {roleName}
            </Text>
            <Ionicons name="chevron-down" size={16} color="#4B5563" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.notificationBtn}
            activeOpacity={0.8}
            onPress={onNotificationPress}
          >
            <Ionicons name="notifications-outline" size={20} color="#2563EB" />
          </TouchableOpacity>

          {/* Nút đăng xuất — icon mũi tên ra, nằm cạnh chuông */}
          <TouchableOpacity
            style={styles.logoutBtn}
            activeOpacity={0.8}
            onPress={onLogoutPress}
          >
            <Ionicons name="log-out-outline" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    paddingHorizontal: 16,
    paddingBottom: 24,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  topRow: {
    alignItems: "center",
    marginTop: 16,
    marginBottom: 16,
  },
  welcomeText: {
    color: "#E0E7FF",
    fontSize: 14,
  },
  userName: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  roleSelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 24,
    gap: 8,
  },
  roleIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },
  roleText: {
    fontSize: 14,
    color: "#1F2937",
    fontWeight: "500",
    maxWidth: 160,
  },
  notificationBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  // Nút đăng xuất: nền trong suốt, viền trắng mờ — hòa vào gradient
  logoutBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
});
