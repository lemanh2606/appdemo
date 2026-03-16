import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  title: string;
  icon:
    | keyof typeof Ionicons.glyphMap
    | keyof typeof MaterialCommunityIcons.glyphMap;
  iconType?: "ionicons" | "material";
  children: React.ReactNode;
  rightElement?: React.ReactNode;
  isCollapsible?: boolean;
}

export const Section = ({
  title,
  icon,
  iconType = "ionicons",
  children,
  rightElement,
  isCollapsible = true,
}: Props) => {
  const [isExpanded, setIsExpanded] = useState(true);
  return (
    <View style={s.container}>
      <TouchableOpacity
        style={s.header}
        activeOpacity={0.7}
        onPress={() => isCollapsible && setIsExpanded(!isExpanded)}
      >
        <View style={s.titleRow}>
          <View style={s.iconBg}>
            {iconType === "ionicons" ? (
              <Ionicons name={icon as any} size={20} color="#2563EB" />
            ) : (
              <MaterialCommunityIcons
                name={icon as any}
                size={20}
                color="#2563EB"
              />
            )}
          </View>
          <Text style={s.title}>{title}</Text>
        </View>
        <View style={s.headerRight}>
          {rightElement}
          {isCollapsible && (
            <Ionicons
              name={isExpanded ? "chevron-up" : "chevron-down"}
              size={20}
              color="#9CA3AF"
              style={{ marginLeft: 8 }}
            />
          )}
        </View>
      </TouchableOpacity>
      {isExpanded && <View style={s.content}>{children}</View>}
    </View>
  );
};

const s = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  iconBg: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontSize: 15, fontWeight: "bold", color: "#111827" },
  headerRight: { flexDirection: "row", alignItems: "center" },
  content: { padding: 16, paddingTop: 0, gap: 8 },
});
