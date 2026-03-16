import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const ACTIONS = [
  { id: "1", title: "Văn bản đến", type: "in", icon: "document-text" as const },
  { id: "2", title: "Văn bản đi", type: "out", icon: "document-text" as const },
  {
    id: "3",
    title: "Tờ trình",
    type: "report",
    icon: "document-text" as const,
  },
];

export function QuickActions() {
  const router = useRouter(); // Bật bộ chuyển trang

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Tác vụ</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {ACTIONS.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={styles.actionCard}
            activeOpacity={0.7}
            onPress={() =>
              router.push({
                pathname: "/documents",
                params: { tab: action.type },
              } as any)
            }
          >
            <View style={styles.iconContainer}>
              <Ionicons name={action.icon} size={28} color="#FFFFFF" />
            </View>
            <Text style={styles.actionTitle}>{action.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  actionCard: {
    backgroundColor: "#FFFFFF",
    width: 140,
    height: 140,
    borderRadius: 16,
    padding: 16,

    alignItems: "center",
    justifyContent: "center",

    borderWidth: 1,
    borderColor: "#E5E7EB",

    elevation: 2,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,

    overflow: "hidden", // fix viền đen
    marginBottom: 2,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
    textAlign: "center",
  },
});
