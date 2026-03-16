import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { modalStyles } from "@/components/common/modalStyles";
import { ALL_RECIPIENTS } from "@/constants";
import { Recipient } from "@/types";

interface Props {
  visible: boolean;
  type: "internal" | "external";
  current: Recipient[];
  onSave: (list: Recipient[]) => void;
  onClose: () => void;
}

export const RecipientModal = ({
  visible,
  type,
  current,
  onSave,
  onClose,
}: Props) => {
  const options = ALL_RECIPIENTS.filter((r) => r.type === type);

  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(current.map((r) => r.code)),
  );

  const toggle = (code: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(code) ? next.delete(code) : next.add(code);
      return next;
    });
  };

  const handleSave = () => {
    onSave(options.filter((r) => selected.has(r.code)));
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

      <View style={[modalStyles.sheet, { maxHeight: "75%" }]}>
        {/* Handle */}
        <View style={modalStyles.handle} />

        {/* Header */}
        <View style={modalStyles.sheetHeader}>
          <Text style={modalStyles.sheetTitle}>
            {type === "internal"
              ? "Nơi nhận trong ngành"
              : "Nơi nhận ngoài ngành"}
          </Text>
          <TouchableOpacity
            onPress={onClose}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="close" size={22} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Danh sách đơn vị */}
        <FlatList
          data={options}
          keyExtractor={(item) => item.code}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const isSelected = selected.has(item.code);
            return (
              <TouchableOpacity
                style={[
                  modalStyles.option,
                  isSelected && modalStyles.optionSelected,
                ]}
                onPress={() => toggle(item.code)}
                activeOpacity={0.7}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      modalStyles.optionText,
                      isSelected && modalStyles.optionTextSelected,
                    ]}
                  >
                    {item.name}
                  </Text>
                  <Text
                    style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}
                  >
                    {item.code}
                  </Text>
                </View>
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
              Xác nhận ({selected.size} đơn vị)
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
