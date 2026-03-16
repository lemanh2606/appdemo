import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "./documentDetail.styles";

interface Props {
  paddingBottom: number;
  onForward: () => void;
  onReturn: () => void;
}

export const DocumentFooter = ({
  paddingBottom,
  onForward,
  onReturn,
}: Props) => (
  <View style={[styles.footer, { paddingBottom }]}>
    <TouchableOpacity style={styles.primaryButton} onPress={onForward}>
      <Ionicons
        name="arrow-forward-circle-outline"
        size={20}
        color="#FFF"
        style={{ marginRight: 6 }}
      />
      <Text style={styles.primaryButtonText}>Chuyển xử lý</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.secondaryButton} onPress={onReturn}>
      <Ionicons
        name="return-down-back-outline"
        size={20}
        color="#FFF"
        style={{ marginRight: 6 }}
      />
      <Text style={styles.secondaryButtonText}>Trả lại</Text>
    </TouchableOpacity>
  </View>
);
