// Chứa 13 EditInput + checkbox + nút Hủy/Lưu
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { EditInput } from "@/components/common/EditInput";
import { FIELD_LABELS } from "../../constants/document.constants";
import { DocData, DocumentDetailAction } from "../../types/document.types";
import { styles } from "./documentDetail.styles";

interface Props {
  draft: DocData;
  errors: Partial<Record<keyof DocData, boolean>>;
  draftHasAltCheckbox: boolean;
  fieldViewRefs: React.MutableRefObject<Partial<Record<keyof DocData, any>>>;
  updateDraft: (field: keyof DocData) => (v: string) => void;
  dispatch: (a: DocumentDetailAction) => void;
  onCancel: () => void;
  onSave: () => void;
}

export const DocumentEditForm = ({
  draft,
  errors,
  draftHasAltCheckbox,
  fieldViewRefs,
  updateDraft,
  dispatch,
  onCancel,
  onSave,
}: Props) => {
  const sel = (field: keyof DocData, title: string) =>
    dispatch({ type: "OPEN_SELECT_MODAL", field, title });
  const dat = (field: keyof DocData, title: string) =>
    dispatch({ type: "OPEN_DATE_MODAL", field, title });
  const ref = (field: keyof DocData) => (r: any) => {
    fieldViewRefs.current[field] = r;
  };

  return (
    <View style={{ gap: 4 }}>
      <EditInput
        label={FIELD_LABELS.type}
        value={draft.type}
        onChange={updateDraft("type")}
        isRequired
        isSelect
        onSelectPress={() => sel("type", "Chọn loại dự thảo")}
        hasError={!!errors.type}
        viewRef={ref("type")}
      />
      <EditInput
        label={FIELD_LABELS.category}
        value={draft.category}
        onChange={updateDraft("category")}
        isSelect
        onSelectPress={() => sel("category", "Chọn loại văn bản")}
        viewRef={ref("category")}
      />
      <EditInput
        label={FIELD_LABELS.arrivalDate}
        value={draft.arrivalDate}
        onChange={updateDraft("arrivalDate")}
        isRequired
        isDate
        onDatePress={() => dat("arrivalDate", "Chọn ngày đến")}
        hasError={!!errors.arrivalDate}
        viewRef={ref("arrivalDate")}
      />
      <EditInput
        label={FIELD_LABELS.urgency}
        value={draft.urgency}
        onChange={updateDraft("urgency")}
        isRequired
        isSelect
        onSelectPress={() => sel("urgency", "Chọn độ khẩn")}
        hasError={!!errors.urgency}
        viewRef={ref("urgency")}
      />
      <EditInput
        label={FIELD_LABELS.department}
        value={draft.department}
        onChange={updateDraft("department")}
        isRequired
        isSelect
        onSelectPress={() => sel("department", "Chọn phòng ban")}
        hasError={!!errors.department}
        viewRef={ref("department")}
      />
      <EditInput
        label={FIELD_LABELS.creator}
        value={draft.creator}
        onChange={updateDraft("creator")}
        isRequired
        hasError={!!errors.creator}
        viewRef={ref("creator")}
      />
      <EditInput
        label={FIELD_LABELS.signer}
        value={draft.signer}
        onChange={updateDraft("signer")}
        isRequired
        isSelect
        onSelectPress={() => sel("signer", "Chọn người ký")}
        hasError={!!errors.signer}
        viewRef={ref("signer")}
      />
      <EditInput
        label={FIELD_LABELS.signerRole}
        value={draft.signerRole}
        onChange={updateDraft("signerRole")}
        isRequired
        isSelect
        onSelectPress={() => sel("signerRole", "Chọn chức vụ")}
        hasError={!!errors.signerRole}
        viewRef={ref("signerRole")}
      />
      <EditInput
        label={FIELD_LABELS.processingDeadline}
        value={draft.processingDeadline}
        onChange={updateDraft("processingDeadline")}
        isRequired
        isDate
        onDatePress={() => dat("processingDeadline", "Chọn hạn xử lý")}
        hasError={!!errors.processingDeadline}
        viewRef={ref("processingDeadline")}
      />
      <EditInput
        label={FIELD_LABELS.operationType}
        value={draft.operationType}
        onChange={updateDraft("operationType")}
        isRequired
        isSelect
        onSelectPress={() => sel("operationType", "Chọn loại nghiệp vụ")}
        hasError={!!errors.operationType}
        viewRef={ref("operationType")}
      />
      <EditInput
        label={FIELD_LABELS.language}
        value={draft.language}
        onChange={updateDraft("language")}
        isRequired
        isSelect
        onSelectPress={() => sel("language", "Chọn ngôn ngữ")}
        hasError={!!errors.language}
        viewRef={ref("language")}
      />
      <EditInput
        label={FIELD_LABELS.pageCount}
        value={draft.pageCount}
        onChange={updateDraft("pageCount")}
        isRequired
        isNumeric
        hasError={!!errors.pageCount}
        errorMessage="Số trang phải là số nguyên dương"
        viewRef={ref("pageCount")}
      />
      <EditInput
        label={FIELD_LABELS.note}
        value={draft.note}
        onChange={updateDraft("note")}
        isRequired
        isMultiline
        hasError={!!errors.note}
        viewRef={ref("note")}
      />

      {/* Checkbox */}
      <TouchableOpacity
        style={styles.checkboxRow}
        activeOpacity={0.7}
        onPress={() =>
          dispatch({ type: "SET_DRAFT_CHECKBOX", value: !draftHasAltCheckbox })
        }
      >
        <View
          style={[
            styles.checkbox,
            !draftHasAltCheckbox && { backgroundColor: "#E5E7EB" },
          ]}
        >
          {draftHasAltCheckbox && (
            <Ionicons name="checkmark-sharp" size={14} color="#FFF" />
          )}
        </View>
        <Text style={styles.checkboxLabel}>
          Văn bản điện tử có kèm bản giấy
        </Text>
      </TouchableOpacity>

      {/* Actions */}
      <View style={styles.editActionRow}>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelButtonText}>Hủy</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={onSave}>
          <Text style={styles.saveButtonText}>Lưu lại</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
