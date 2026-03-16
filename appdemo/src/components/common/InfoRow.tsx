import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface Props {
  label: string;
  value: string;
  isBold?: boolean;
}

export const InfoRow = ({ label, value, isBold = false }: Props) => (
  <View style={s.row}>
    <Text style={s.label}>{label}</Text>
    <Text style={[s.value, isBold && { fontWeight: "bold", color: "#111827" }]}>
      {value || "-"}
    </Text>
  </View>
);

const s = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  label: { fontSize: 13, color: "#6B7280", flex: 1 },
  value: { fontSize: 13, color: "#374151", flex: 2, textAlign: "right" },
});
