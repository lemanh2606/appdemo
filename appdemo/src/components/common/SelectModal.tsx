import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  FlatList,
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { modalStyles } from "./modalStyles";

interface Props {
  visible: boolean;
  title: string;
  options: string[];
  selected: string;
  onSelect: (v: string) => void;
  onClose: () => void;
}

export const SelectModal = ({
  visible,
  title,
  options,
  selected,
  onSelect,
  onClose,
}: Props) => (
  <Modal
    visible={visible}
    transparent
    animationType="slide"
    onRequestClose={onClose}
  >
    <TouchableWithoutFeedback onPress={onClose}>
      <View style={modalStyles.overlay} />
    </TouchableWithoutFeedback>
    <View style={modalStyles.sheet}>
      <View style={modalStyles.handle} />
      <View style={modalStyles.sheetHeader}>
        <Text style={modalStyles.sheetTitle}>{title}</Text>
        <TouchableOpacity
          onPress={onClose}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="close" size={22} color="#6B7280" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={options}
        keyExtractor={(item) => item}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const isSelected = item === selected;
          return (
            <TouchableOpacity
              style={[
                modalStyles.option,
                isSelected && modalStyles.optionSelected,
              ]}
              onPress={() => {
                onSelect(item);
                onClose();
              }}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  modalStyles.optionText,
                  isSelected && modalStyles.optionTextSelected,
                ]}
              >
                {item}
              </Text>
              {isSelected && (
                <Ionicons name="checkmark-circle" size={20} color="#2563EB" />
              )}
            </TouchableOpacity>
          );
        }}
      />
    </View>
  </Modal>
);
