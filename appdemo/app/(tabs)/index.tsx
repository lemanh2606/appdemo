import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";

import { DashboardHeader } from "../../src/components/dashboard/DashboardHeader";
import { QuickActions } from "../../src/components/dashboard/QuickActions";
import { TaskSection } from "../../src/components/dashboard/TaskSection";
import authService from "../../services/authService";
import { useAuth } from "../_layout";

export default function HomeScreen() {
  const { session, signOut } = useAuth();
  const router = useRouter();

  // ─── Xử lý sự kiện bấm chuông ─────────────────────────────
  const handleNotificationPress = () => {
    Alert.alert("Thông báo", "Bạn đã nhấn vào nút chuông!");
  };

  // ─── Xử lý chọn chức danh ─────────────────────────────────
  const handleRolePress = () => {
    Alert.alert("Chức danh", "Mở BottomSheet chọn chức danh...");
  };

  // ─── Xử lý Đăng xuất ──────────────────────────────────────
  const handleLogout = useCallback(() => {
    Alert.alert(
      "Đăng xuất",
      "Bạn có chắc chắn muốn đăng xuất không?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Đăng xuất",
          style: "destructive",
          onPress: async () => {
            try {
              // 1. Revoke token phía server (nếu API hỗ trợ)
              await authService.logout();
              // 2. Xóa local storage + clear state trong AuthContext
              //    AuthGuard sẽ tự redirect về "/" khi session = null
              await signOut();
            } catch {
              Alert.alert("Lỗi", "Không thể đăng xuất. Vui lòng thử lại.");
            }
          },
        },
      ],
      { cancelable: true },
    );
  }, [signOut]); // ✅ Chỉ cần signOut — không cần router hay setSession

  // ─── Thông tin hiển thị từ session ────────────────────────
  const displayName = session?.user?.displayName ?? "Người dùng";
  const roleName = session?.user
    ? `${session.user.positionName} - ${session.user.departmentName}`
    : "Chức danh";

  return (
    <View style={styles.container}>
      {/* StatusBar đã có ở _layout.tsx — không cần khai báo lại */}

      <DashboardHeader
        userName={displayName}
        roleName={roleName}
        onNotificationPress={handleNotificationPress}
        onRolePress={handleRolePress}
        onLogoutPress={handleLogout}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={true}
        contentContainerStyle={styles.scrollContent}
      >
        <TaskSection />
        <QuickActions />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 16,
  },
});
