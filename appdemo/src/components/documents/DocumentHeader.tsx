import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "./documentDetail.styles";

interface Props {
  title: string;
  urgency: string;
  status: string;
}

export const DocumentHeader = ({ title, urgency, status }: Props) => {
  const router = useRouter();
  return (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#2563EB" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={2}>
          {title}
        </Text>
        <TouchableOpacity
          style={styles.headerAction}
          onPress={() => router.push("/documents/history" as any)}
        >
          <Ionicons name="time-outline" size={24} color="#2563EB" />
        </TouchableOpacity>
      </View>
      <View style={styles.badgeRow}>
        <View style={[styles.badge, { backgroundColor: "#EF4444" }]}>
          <Text style={styles.badgeText}>{urgency}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: "#DBEAFE" }]}>
          <Text style={[styles.badgeText, { color: "#2563EB" }]}>{status}</Text>
        </View>
      </View>
    </View>
  );
};
