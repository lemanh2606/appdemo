import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TaskCard } from "../../src/components/dashboard/TaskCard";

// Định nghĩa kiểu dữ liệu đồng nhất để tránh lỗi TypeScript
interface TaskItem {
  id: string;
  docId: string;
  isUrgent: boolean;
  title: string;
  sender: string;
}

const TABS = [
  { id: "out", label: "Văn bản đi", count: 4 },
  { id: "in", label: "Văn bản đến", count: 12 },
  { id: "report", label: "Tờ trình", count: 12 },
];

// Dữ liệu giả mẫu cho từng loại Tab để kiểm tra logic chuyển đổi
const DATA_BY_TAB: Record<string, TaskItem[]> = {
  out: [
    {
      id: "o1",
      docId: "001/2026/VB-DI",
      isUrgent: true,
      title: "Báo cáo kết quả triển khai dự án App Demo giai đoạn 1",
      sender: "Phòng Công nghệ",
    },
    {
      id: "o2",
      docId: "002/2026/VB-DI",
      isUrgent: false,
      title: "Đề xuất kinh phí bảo trì hệ thống quý 2",
      sender: "Phòng Kế hoạch",
    },
  ],
  in: [
    {
      id: "i1",
      docId: "105/2026/VB-DEN",
      isUrgent: true,
      title: "Chỉ thị về việc tăng cường an ninh mạng năm 2026",
      sender: "Bộ Công an",
    },
    {
      id: "i2",
      docId: "106/2026/VB-DEN",
      isUrgent: false,
      title: "Giấy mời họp sơ kết công tác Đảng bộ tháng 3",
      sender: "Văn phòng Chính phủ",
    },
    {
      id: "i3",
      docId: "107/2026/VB-DEN",
      isUrgent: false,
      title: "Công văn phúc đáp về việc phối hợp nhân sự",
      sender: "Cục Viễn thông",
    },
  ],
  report: [
    {
      id: "r1",
      docId: "TR-01/2026",
      isUrgent: true,
      title: "Phê duyệt chủ trương mua sắm thiết bị đầu cuối",
      sender: "Tổ chuyên gia",
    },
  ],
};

export default function DocumentListScreen() {
  const router = useRouter();
  const params = useLocalSearchParams(); // Đọc tham số từ URL (ví dụ: ?tab=in)
  const insets = useSafeAreaInsets(); // Lấy thông số tránh vùng cam / tai thỏ của máy

  const [activeTab, setActiveTab] = useState("out");
  const [selectedTasks, setSelectedTasks] = useState<Record<string, boolean>>(
    {},
  );
  const [tasks, setTasks] = useState<TaskItem[]>(DATA_BY_TAB.out); // Khởi tạo với dữ liệu tab mặc định

  // 0. Đồng bộ Tab từ Trang chủ truyền sang
  useEffect(() => {
    if (params.tab && typeof params.tab === "string") {
      setActiveTab(params.tab);
    }
  }, [params.tab]);

  // 1. Logic tự động đổi Tiêu đề Header theo Tab đang được chọn
  const activeTabLabel =
    TABS.find((t) => t.id === activeTab)?.label || "Tài liệu";

  // 2. Cập nhật dữ liệu hiển thị (tasks) tương ứng với Tab được chọn
  useEffect(() => {
    // Giả lập việc load dữ liệu từ API dựa trên id của Tab
    const currentData = DATA_BY_TAB[activeTab] || [];
    setTasks(currentData);

    console.log(`Tiến hành tải dữ liệu API cho phân hệ: ${activeTabLabel}`);

    // Tạm thời reset danh sách đã tick chọn khi chuyển tab khác (để tránh rác memory)
    setSelectedTasks({});
  }, [activeTab]);

  const toggleTask = (id: string) => {
    setSelectedTasks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    // Sử dụng View và padding tay để kiểm soát tốt nhất việc không cấn Status Bar (pin, sóng)
    <View style={[styles.safeArea, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#2563EB" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{activeTabLabel}</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search-outline" size={24} color="#2563EB" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
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

      {/* List */}
      <ScrollView
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      >
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            {...task}
            showCheckbox={true}
            checked={!!selectedTasks[task.id]}
            onCheck={() => toggleTask(task.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F3F4F6", // Nền ghi nhám nhạt y như mẫu thiết kế
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "#EFF6FF", // xanh nhạt
    borderRadius: 20, // hình tròn

    marginLeft: -8,
  },
  headerTitle: {
    flex: 1,
    marginLeft: 8,
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },
  searchButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  tabContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    width: "100%",
    justifyContent: "flex-start", // Đẩy tất cả tab sang trái gộp lại
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    gap: 24, // Khoảng cách giữa các tab
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
    gap: 6,
  },
  activeTab: {
    borderBottomColor: "#2563EB",
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
    color: "#2563EB",
  },
  listContainer: {
    padding: 16,
    gap: 12,
  },
});
