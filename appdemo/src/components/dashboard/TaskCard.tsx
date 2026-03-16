import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface TaskCardProps {
  docId: string;
  isUrgent: boolean;
  title: string;
  sender: string;
  showCheckbox?: boolean; // Bật cờ cho phép hiện checkbox không (chọn lọc giữa Dashboard và Màn chi tiết)
  checked?: boolean; // Tích hiện tại đang bật hay tắt?
  onCheck?: () => void; // Hàm kích hoạt khi bấm tick
}

export function TaskCard({
  id = "1", // Mặc định để test navigate
  docId,
  isUrgent,
  title,
  sender,
  showCheckbox = false,
  checked = false,
  onCheck,
  onPress,
}: TaskCardProps & { id?: string; onPress?: () => void }) {
  const router = useRouter();

  const handlePress = () => {
    if (showCheckbox && onCheck) {
      onCheck();
    } else if (onPress) {
      onPress();
    } else {
      // Mặc định điều hướng sang trang chi tiết
      router.push(`/documents/${id}` as any);
    }
  };

  return (
    <TouchableOpacity
      style={styles.cardWrapper}
      activeOpacity={0.7}
      onPress={handlePress}
    >
      {/* Vùng hộp trắng chứa toàn bộ thiệp. Nếu có check, nó sẽ chia bố cục thành layout Flex. */}
      {showCheckbox && (
        <TouchableOpacity style={styles.checkboxContainer} onPress={onCheck}>
          <Ionicons
            name={checked ? "checkbox" : "square-outline"}
            size={24}
            color={checked ? "#2563EB" : "#D1D5DB"}
          />
        </TouchableOpacity>
      )}

      {/* Vùng nội dung chính */}
      <View style={styles.cardContent}>
        <View style={styles.tagsRow}>
          <View style={styles.docIdBadge}>
            <Text style={styles.docIdText}>{docId}</Text>
          </View>
          {isUrgent && (
            <View style={styles.urgentBadge}>
              <Text style={styles.urgentText}>Hỏa tốc</Text>
            </View>
          )}
        </View>

        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>

        <View style={styles.senderRow}>
          <Ionicons name="person-outline" size={14} color="#9CA3AF" />
          <Text style={styles.senderText}>{sender}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    flexDirection: "row", // Chuyển sang bố cục Cột ngang
    alignItems: "center", // Canh giữa theo chiều dọc
  },
  checkboxContainer: {
    marginRight: 12, // Cách phần nội dung text bên cạnh 1 chút
  },
  cardContent: {
    flex: 1, // Để cho hộp chữ được nở ra chiếm hết đoạn trống bên phải
  },
  tagsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  docIdBadge: {
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  docIdText: {
    fontSize: 12,
    color: "#4B5563",
    fontWeight: "500",
  },
  urgentBadge: {
    backgroundColor: "#EF4444",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  urgentText: {
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 12,
    lineHeight: 20,
  },
  senderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  senderText: {
    fontSize: 13,
    color: "#9CA3AF",
  },
});
