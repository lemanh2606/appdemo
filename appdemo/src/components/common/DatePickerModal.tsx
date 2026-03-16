import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Modal,
  Platform,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { modalStyles } from "./modalStyles";
import { formatDateTime, parseDateTime } from "@/utils/documentHelpers";

interface Props {
  visible: boolean;
  title: string;
  value: string;
  onConfirm: (v: string) => void;
  onClose: () => void;
}

export const DatePickerModal = ({
  visible,
  title,
  value,
  onConfirm,
  onClose,
}: Props) => {
  const [tempDate, setTempDate] = useState<Date>(
    value && value !== "-" ? parseDateTime(value) : new Date(),
  );
  const [mode, setMode] = useState<"date" | "time">("date");

  const handleChange = (_: DateTimePickerEvent, selected?: Date) => {
    if (!selected) return;
    setTempDate(selected);
    if (Platform.OS === "android") {
      if (mode === "date") setMode("time");
      else {
        onConfirm(formatDateTime(selected));
        onClose();
        setMode("date");
      }
    }
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
      <View style={modalStyles.sheet}>
        <View style={modalStyles.handle} />
        <View style={modalStyles.sheetHeader}>
          <Text style={modalStyles.sheetTitle}>{title}</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={22} color="#6B7280" />
          </TouchableOpacity>
        </View>
        <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
          <DateTimePicker
            value={tempDate}
            mode={Platform.OS === "ios" ? "datetime" : mode}
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleChange}
            locale="vi-VN"
            style={{ width: "100%" }}
          />
          {Platform.OS === "ios" && (
            <View style={modalStyles.iosButtonRow}>
              <TouchableOpacity
                style={modalStyles.iosCancelBtn}
                onPress={onClose}
              >
                <Text style={modalStyles.iosCancelText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={modalStyles.iosConfirmBtn}
                onPress={() => {
                  onConfirm(formatDateTime(tempDate));
                  onClose();
                }}
              >
                <Text style={modalStyles.iosConfirmText}>Xác nhận</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};
