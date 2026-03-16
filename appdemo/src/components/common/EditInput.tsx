import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Props {
  label: string;
  value: string;
  onChange: (v: string) => void;
  isRequired?: boolean;
  isSelect?: boolean;
  isDate?: boolean;
  isMultiline?: boolean;
  isNumeric?: boolean;
  onSelectPress?: () => void;
  onDatePress?: () => void;
  hasError?: boolean;
  errorMessage?: string;
  viewRef?: React.RefCallback<View>;
}

export const EditInput = ({
  label,
  value,
  onChange,
  isRequired,
  isSelect,
  isDate,
  isMultiline,
  isNumeric,
  onSelectPress,
  onDatePress,
  hasError,
  errorMessage,
  viewRef,
}: Props) => {
  const isTappable = isSelect || isDate;
  return (
    <View ref={viewRef} style={s.container}>
      <Text style={s.label}>
        {label}
        {isRequired && <Text style={{ color: "#EF4444" }}> *</Text>}
      </Text>
      <TouchableOpacity
        style={[
          s.wrapper,
          isMultiline && s.multiline,
          hasError && s.errorBorder,
        ]}
        onPress={
          isTappable ? (isDate ? onDatePress : onSelectPress) : undefined
        }
        activeOpacity={isTappable ? 0.7 : 1}
      >
        <TextInput
          style={[
            s.input,
            isMultiline && { textAlignVertical: "top", height: 80 },
          ]}
          value={value}
          onChangeText={onChange}
          editable={!isTappable}
          pointerEvents={isTappable ? "none" : "auto"}
          multiline={isMultiline}
          keyboardType={isNumeric ? "numeric" : "default"}
          placeholderTextColor="#9CA3AF"
        />
        {isSelect && <Ionicons name="chevron-down" size={20} color="#9CA3AF" />}
        {isDate && (
          <Ionicons name="calendar-outline" size={20} color="#9CA3AF" />
        )}
      </TouchableOpacity>
      {hasError && (
        <Text style={s.error}>
          {errorMessage ?? `${label} không được để trống`}
        </Text>
      )}
    </View>
  );
};

const s = StyleSheet.create({
  container: { marginBottom: 4 },
  label: { fontSize: 13, fontWeight: "600", color: "#374151", marginBottom: 6 },
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    backgroundColor: "#FFF",
    paddingHorizontal: 12,
  },
  multiline: { minHeight: 80, alignItems: "flex-start", paddingVertical: 10 },
  errorBorder: { borderColor: "#EF4444", borderWidth: 1.5 },
  input: { flex: 1, height: 44, fontSize: 14, color: "#111827" },
  error: { fontSize: 12, color: "#EF4444", marginTop: 4 },
});
