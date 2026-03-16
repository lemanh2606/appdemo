import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#2563EB",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarStyle: {
          paddingTop: 8,
          // Luôn cách viền dưới cùng hoặc thanh điều hướng 8px trên cả iOS và Android
          paddingBottom: insets.bottom + 8,
          // Tự động đẩy chiều cao của thanh tab lên để hiển thị đủ
          height: 60 + insets.bottom + 8,
          backgroundColor: "#FFFFFF",
          borderTopColor: "#E5E7EB",
          borderTopWidth: 1,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
          marginTop: 4,
          paddingBottom: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Trang chủ",
          tabBarIcon: ({ focused, size }) => {
            // Chọn ảnh dựa vào trạng thái focused
            const iconSource = focused
              ? require("../../assets/icon/home.png") // ảnh viền xanh (active)
              : require("../../assets/icon/home2.png"); // ảnh viền đen (inactive)
            return (
              <Image
                source={iconSource}
                style={{
                  width: size,
                  height: size,
                  resizeMode: "contain",
                }}
              />
            );
          },
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: "Cần xử lý",
          tabBarIcon: ({ color }) => (
            <Ionicons name="list-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Tra cứu",
          tabBarIcon: ({ color }) => (
            <Ionicons name="search-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Cài đặt",
          tabBarIcon: ({ color }) => (
            <Ionicons name="settings-outline" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
