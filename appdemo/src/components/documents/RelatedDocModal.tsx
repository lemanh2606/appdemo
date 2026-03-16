import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { modalStyles } from "@/components/common/modalStyles";
import { SAMPLE_RELATED_DOCS } from "@/constants";
import { RelatedDoc } from "@/types";

interface Props {
  visible: boolean;
  current: RelatedDoc[];
  onSave: (list: RelatedDoc[]) => void;
  onClose: () => void;
}

export const RelatedDocModal = ({
  visible,
  current,
  onSave,
  onClose,
}: Props) => {
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(current.map((d) => d.id)),
  );

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSave = () => {
    onSave(SAMPLE_RELATED_DOCS.filter((d: any) => selected.has(d.id)));
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={modalStyles.overlay} />
      </TouchableWithoutFeedback>

      <View style={[modalStyles.sheet, { maxHeight: "80%" }]}>
        {/* Handle */}
        <View style={modalStyles.handle} />

        {/* Header */}
        <View style={modalStyles.sheetHeader}>
          <Text style={modalStyles.sheetTitle}>Chọn văn bản liên quan</Text>
          <TouchableOpacity
            onPress={onClose}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="close" size={22} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Danh sách văn bản */}
        <FlatList
          data={SAMPLE_RELATED_DOCS}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 16,
            gap: 10,
            paddingTop: 8,
          }}
          renderItem={({ item }) => {
            const isSelected = selected.has(item.id);
            return (
              <TouchableOpacity
                style={[s.docCard, isSelected && s.docCardSelected]}
                onPress={() => toggle(item.id)}
                activeOpacity={0.7}
              >
                {/* Badge khẩn */}
                {item.isUrgent && (
                  <View style={s.urgentBadge}>
                    <Text style={s.urgentText}>Khẩn</Text>
                  </View>
                )}

                {/* Nội dung */}
                <View style={{ flex: 1 }}>
                  <Text style={s.docId}>{item.docId}</Text>
                  <Text style={s.docTitle} numberOfLines={2}>
                    {item.title}
                  </Text>
                  <Text style={s.docSender}>{item.sender}</Text>
                </View>

                {/* Checkbox */}
                <Ionicons
                  name={isSelected ? "checkbox" : "square-outline"}
                  size={22}
                  color={isSelected ? "#2563EB" : "#D1D5DB"}
                />
              </TouchableOpacity>
            );
          }}
        />

        {/* Footer button */}
        <View style={{ padding: 16 }}>
          <TouchableOpacity
            style={modalStyles.iosConfirmBtn}
            onPress={handleSave}
          >
            <Text style={modalStyles.iosConfirmText}>
              Xác nhận ({selected.size} văn bản)
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// ─── Styles riêng cho doc card ────────────────────────────────

const s = StyleSheet.create({
  docCard: {
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  docCardSelected: {
    borderColor: "#2563EB",
    backgroundColor: "#EFF6FF",
  },
  urgentBadge: {
    position: "absolute",
    top: 8,
    right: 40,
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  urgentText: {
    fontSize: 10,
    color: "#EF4444",
    fontWeight: "700",
  },
  docId: {
    fontSize: 12,
    color: "#2563EB",
    fontWeight: "600",
    marginBottom: 2,
  },
  docTitle: {
    fontSize: 13,
    color: "#111827",
    lineHeight: 18,
    marginBottom: 4,
  },
  docSender: {
    fontSize: 12,
    color: "#6B7280",
  },
});
