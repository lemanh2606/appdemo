import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TaskCard } from "./TaskCard";

const TABS = [
  { id: "out", label: "Văn bản đi", count: 4 },
  { id: "in", label: "Văn bản đến", count: 12 },
  { id: "report", label: "Tờ trình", count: 12 },
];

const MOCK_TASKS = [
  {
    id: "1",
    docId: "001/2026/TT-BCA",
    isUrgent: true,
    title:
      "Góp ý dự thảo Quy chế quản lý, vận hành khai thác mạng viễn thông, công nghệ thông tin",
    sender: "Cục quản lý đấu thầu",
  },
  {
    id: "2",
    docId: "001/2026/TT-BCA",
    isUrgent: true,
    title:
      "Góp ý dự thảo Quy chế quản lý, vận hành khai thác mạng viễn thông, công nghệ thông tin",
    sender: "Cục quản lý đấu thầu",
  },
  {
    id: "3",
    docId: "001/2026/TT-BCA",
    isUrgent: true,
    title:
      "Góp ý dự thảo Quy chế quản lý, vận hành khai thác mạng viễn thông, công nghệ thông tin",
    sender: "Cục quản lý đấu thầu",
  },
];

export function TaskSection() {
  const [activeTab, setActiveTab] = useState("out");

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Cần xử lý</Text>

      <View style={styles.tabContainer}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, isActive && styles.activeTab]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Text
                style={[styles.tabLabel, isActive && styles.activeTabLabel]}
              >
                {tab.label}
              </Text>
              <View style={[styles.badge, isActive && styles.activeBadge]}>
                <Text
                  style={[styles.badgeText, isActive && styles.activeBadgeText]}
                >
                  {tab.count}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.listContainer}>
        {MOCK_TASKS.map((task) => (
          <TaskCard key={task.id} {...task} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 16,
  },
  tabContainer: {
    flexDirection: "row",
    // chia đều khoảng cách
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    marginBottom: 16,

    width: "100%",
    textAlign: "center",
    justifyContent: "space-between",
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    marginRight: 24,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
    gap: 6,
  },
  activeTab: {
    borderBottomColor: "#3B82F6",
  },
  tabLabel: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  activeTabLabel: {
    color: "#2563EB",
    fontWeight: "bold",
  },
  badge: {
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  activeBadge: {
    backgroundColor: "#DBEAFE",
  },
  badgeText: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "bold",
  },
  activeBadgeText: {
    color: "#3B82F6",
  },
  listContainer: {
    gap: 12,
  },
});
