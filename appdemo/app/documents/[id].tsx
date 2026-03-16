/**
 * app/(tabs)/documents/[id].tsx
 *
 * Dependencies:
 *   npx expo install expo-document-picker expo-file-system expo-sharing
 */

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TaskCard } from "../../src/components/dashboard/TaskCard";

import {
  ALL_RECIPIENTS,
  FIELD_LABELS,
  SAMPLE_RELATED_DOCS,
  SELECT_OPTIONS,
} from "./constants";
import { useDocumentDetail } from "../../src/hooks/useDocumentDetail";
import { AttachedFile, DocData, Recipient, RelatedDoc } from "./types";

// ─── Helpers ──────────────────────────────────────────────────

const formatDateTime = (date: Date): string => {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(date.getDate())}/${p(date.getMonth() + 1)}/${date.getFullYear()} ${p(date.getHours())}:${p(date.getMinutes())}`;
};

const parseDateTime = (str: string): Date => {
  const [datePart = "", timePart = ""] = str.split(" ");
  const [dd = 1, mm = 1, yyyy = 2025] = datePart.split("/").map(Number);
  const [hh = 0, min = 0] = timePart.split(":").map(Number);
  return new Date(yyyy, mm - 1, dd, hh, min);
};

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getFileIcon = (
  mimeType?: string,
): { name: keyof typeof Ionicons.glyphMap; color: string } => {
  if (!mimeType) return { name: "document-outline", color: "#6B7280" };
  if (mimeType.includes("pdf"))
    return { name: "document-text-outline", color: "#EF4444" };
  if (mimeType.includes("word") || mimeType.includes("msword"))
    return { name: "document-outline", color: "#2563EB" };
  if (mimeType.includes("image"))
    return { name: "image-outline", color: "#10B981" };
  if (mimeType.includes("spreadsheet") || mimeType.includes("excel"))
    return { name: "grid-outline", color: "#059669" };
  return { name: "attach-outline", color: "#6B7280" };
};

// ─── SelectModal ──────────────────────────────────────────────

const SelectModal = ({
  visible,
  title,
  options,
  selected,
  onSelect,
  onClose,
}: {
  visible: boolean;
  title: string;
  options: string[];
  selected: string;
  onSelect: (v: string) => void;
  onClose: () => void;
}) => (
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

// ─── DatePickerModal ──────────────────────────────────────────

const DatePickerModal = ({
  visible,
  title,
  value,
  onConfirm,
  onClose,
}: {
  visible: boolean;
  title: string;
  value: string;
  onConfirm: (v: string) => void;
  onClose: () => void;
}) => {
  const [tempDate, setTempDate] = useState<Date>(
    value && value !== "-" ? parseDateTime(value) : new Date(),
  );
  const [mode, setMode] = useState<"date" | "time">("date");

  const handleChange = (_: DateTimePickerEvent, selected?: Date) => {
    if (!selected) return;
    setTempDate(selected);
    if (Platform.OS === "android") {
      if (mode === "date") {
        setMode("time");
      } else {
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

// ─── RecipientModal ───────────────────────────────────────────

const RecipientModal = ({
  visible,
  type,
  current,
  onSave,
  onClose,
}: {
  visible: boolean;
  type: "internal" | "external";
  current: Recipient[];
  onSave: (list: Recipient[]) => void;
  onClose: () => void;
}) => {
  const options = ALL_RECIPIENTS.filter((r) => r.type === type);
  const [selected, setSelected] = useState<Set<string>>(
    new Set(current.map((r) => r.code)),
  );

  const toggle = (code: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(code) ? next.delete(code) : next.add(code);
      return next;
    });
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
        <View style={modalStyles.handle} />
        <View style={modalStyles.sheetHeader}>
          <Text style={modalStyles.sheetTitle}>
            {type === "internal"
              ? "Nơi nhận trong ngành"
              : "Nơi nhận ngoài ngành"}
          </Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={22} color="#6B7280" />
          </TouchableOpacity>
        </View>
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
                  <Text style={{ fontSize: 12, color: "#9CA3AF" }}>
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
        <View style={{ padding: 16 }}>
          <TouchableOpacity
            style={modalStyles.iosConfirmBtn}
            onPress={() => {
              onSave(options.filter((r) => selected.has(r.code)));
              onClose();
            }}
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

// ─── RelatedDocModal ──────────────────────────────────────────

const RelatedDocModal = ({
  visible,
  current,
  onSave,
  onClose,
}: {
  visible: boolean;
  current: RelatedDoc[];
  onSave: (list: RelatedDoc[]) => void;
  onClose: () => void;
}) => {
  const [selected, setSelected] = useState<Set<string>>(
    new Set(current.map((d) => d.id)),
  );

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
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
        <View style={modalStyles.handle} />
        <View style={modalStyles.sheetHeader}>
          <Text style={modalStyles.sheetTitle}>Chọn văn bản liên quan</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={22} color="#6B7280" />
          </TouchableOpacity>
        </View>
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
                style={{
                  borderRadius: 10,
                  borderWidth: 1.5,
                  borderColor: isSelected ? "#2563EB" : "#E5E7EB",
                  backgroundColor: isSelected ? "#EFF6FF" : "#FFFFFF",
                  padding: 12,
                  flexDirection: "row",
                  alignItems: "flex-start",
                  gap: 10,
                }}
                onPress={() => toggle(item.id)}
                activeOpacity={0.7}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#2563EB",
                      fontWeight: "600",
                    }}
                  >
                    {item.docId}
                  </Text>
                  <Text
                    style={{ fontSize: 13, color: "#111827", marginTop: 2 }}
                    numberOfLines={2}
                  >
                    {item.title}
                  </Text>
                  <Text
                    style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}
                  >
                    {item.sender}
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
        <View style={{ padding: 16 }}>
          <TouchableOpacity
            style={modalStyles.iosConfirmBtn}
            onPress={() => {
              onSave(SAMPLE_RELATED_DOCS.filter((d) => selected.has(d.id)));
              onClose();
            }}
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

// ─── Section ──────────────────────────────────────────────────

const Section = ({
  title,
  icon,
  iconType = "ionicons",
  children,
  rightElement,
  isCollapsible = true,
}: {
  title: string;
  icon:
    | keyof typeof Ionicons.glyphMap
    | keyof typeof MaterialCommunityIcons.glyphMap;
  iconType?: "ionicons" | "material";
  children: React.ReactNode;
  rightElement?: React.ReactNode;
  isCollapsible?: boolean;
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  return (
    <View style={styles.sectionContainer}>
      <TouchableOpacity
        style={styles.sectionHeader}
        activeOpacity={0.7}
        onPress={() => isCollapsible && setIsExpanded(!isExpanded)}
      >
        <View style={styles.sectionTitleRow}>
          <View style={styles.sectionIconBg}>
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
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        <View style={styles.sectionHeaderRight}>
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
      {isExpanded && <View style={styles.sectionContent}>{children}</View>}
    </View>
  );
};

// ─── InfoRow ──────────────────────────────────────────────────

const InfoRow = ({
  label,
  value,
  isBold = false,
}: {
  label: string;
  value: string;
  isBold?: boolean;
}) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text
      style={[
        styles.infoValue,
        isBold && { fontWeight: "bold", color: "#111827" },
      ]}
    >
      {value || "-"}
    </Text>
  </View>
);

// ─── EditInput ────────────────────────────────────────────────

const EditInput = ({
  label,
  value,
  onChange,
  isRequired = false,
  isSelect = false,
  isDate = false,
  isMultiline = false,
  isNumeric = false,
  onSelectPress,
  onDatePress,
  hasError = false,
  errorMessage,
  viewRef,
}: {
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
}) => {
  const isTappable = isSelect || isDate;
  return (
    <View ref={viewRef} style={styles.editInputContainer}>
      <Text style={styles.editInputLabel}>
        {label}
        {isRequired && <Text style={{ color: "#EF4444" }}> *</Text>}
      </Text>
      <TouchableOpacity
        style={[
          styles.editInputWrapper,
          isMultiline && {
            minHeight: 80,
            alignItems: "flex-start",
            paddingVertical: 10,
          },
          hasError && { borderColor: "#EF4444", borderWidth: 1.5 },
        ]}
        onPress={
          isTappable ? (isDate ? onDatePress : onSelectPress) : undefined
        }
        activeOpacity={isTappable ? 0.7 : 1}
      >
        <TextInput
          style={[
            styles.editInnerInput,
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
        <Text style={styles.errorText}>
          {errorMessage ?? `${label} không được để trống`}
        </Text>
      )}
    </View>
  );
};

// ─── Main Screen ──────────────────────────────────────────────

export default function DocumentDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const {
    state,
    dispatch,
    display,
    scrollViewRef,
    fieldViewRefs,
    commentSectionRef,
    handleStartEdit,
    handleCancel,
    handleSave,
    updateDraft,
    handleForward,
    handleReturn,
    handlePickFile,
    handleViewFile,
    handleDeleteFile,
  } = useDocumentDetail();

  const {
    draft,
    isEditing,
    errors,
    files,
    isUploadingFile,
    internalRecipients,
    externalRecipients,
    relatedDocs,
    originalDocs,
    comment,
    commentError,
    hasAltCheckbox,
    draftHasAltCheckbox,
    selectModal,
    dateModal,
    recipientModal,
    relatedDocModal,
    expandedInternal,
    expandedExternal,
  } = state;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#2563EB" />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={2}>
            Quyết định về việc điều chỉnh phương án kinh doanh ABC
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
            <Text style={styles.badgeText}>Hỏa tốc</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: "#DBEAFE" }]}>
            <Text style={[styles.badgeText, { color: "#2563EB" }]}>
              Đang thực hiện
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.content}
        contentContainerStyle={styles.contentPadding}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Thông tin văn bản ── */}
        <Section
          title="Thông tin văn bản"
          icon="document-text-outline"
          rightElement={
            !isEditing && (
              <TouchableOpacity onPress={handleStartEdit}>
                <Ionicons name="create-outline" size={20} color="#2563EB" />
              </TouchableOpacity>
            )
          }
        >
          {isEditing && draft ? (
            <View style={{ gap: 4 }}>
              <EditInput
                label={FIELD_LABELS.type}
                value={draft.type}
                onChange={updateDraft("type")}
                isRequired
                isSelect
                onSelectPress={() =>
                  dispatch({
                    type: "OPEN_SELECT_MODAL",
                    field: "type",
                    title: "Chọn loại dự thảo",
                  })
                }
                hasError={!!errors.type}
                viewRef={(ref) => {
                  fieldViewRefs.current.type = ref;
                }}
              />
              <EditInput
                label={FIELD_LABELS.category}
                value={draft.category}
                onChange={updateDraft("category")}
                isSelect
                onSelectPress={() =>
                  dispatch({
                    type: "OPEN_SELECT_MODAL",
                    field: "category",
                    title: "Chọn loại văn bản",
                  })
                }
                viewRef={(ref) => {
                  fieldViewRefs.current.category = ref;
                }}
              />
              <EditInput
                label={FIELD_LABELS.arrivalDate}
                value={draft.arrivalDate}
                onChange={updateDraft("arrivalDate")}
                isRequired
                isDate
                onDatePress={() =>
                  dispatch({
                    type: "OPEN_DATE_MODAL",
                    field: "arrivalDate",
                    title: "Chọn ngày đến",
                  })
                }
                hasError={!!errors.arrivalDate}
                viewRef={(ref) => {
                  fieldViewRefs.current.arrivalDate = ref;
                }}
              />
              <EditInput
                label={FIELD_LABELS.urgency}
                value={draft.urgency}
                onChange={updateDraft("urgency")}
                isRequired
                isSelect
                onSelectPress={() =>
                  dispatch({
                    type: "OPEN_SELECT_MODAL",
                    field: "urgency",
                    title: "Chọn độ khẩn",
                  })
                }
                hasError={!!errors.urgency}
                viewRef={(ref) => {
                  fieldViewRefs.current.urgency = ref;
                }}
              />
              <EditInput
                label={FIELD_LABELS.department}
                value={draft.department}
                onChange={updateDraft("department")}
                isRequired
                isSelect
                onSelectPress={() =>
                  dispatch({
                    type: "OPEN_SELECT_MODAL",
                    field: "department",
                    title: "Chọn phòng ban",
                  })
                }
                hasError={!!errors.department}
                viewRef={(ref) => {
                  fieldViewRefs.current.department = ref;
                }}
              />
              <EditInput
                label={FIELD_LABELS.creator}
                value={draft.creator}
                onChange={updateDraft("creator")}
                isRequired
                hasError={!!errors.creator}
                viewRef={(ref) => {
                  fieldViewRefs.current.creator = ref;
                }}
              />
              <EditInput
                label={FIELD_LABELS.signer}
                value={draft.signer}
                onChange={updateDraft("signer")}
                isRequired
                isSelect
                onSelectPress={() =>
                  dispatch({
                    type: "OPEN_SELECT_MODAL",
                    field: "signer",
                    title: "Chọn người ký",
                  })
                }
                hasError={!!errors.signer}
                viewRef={(ref) => {
                  fieldViewRefs.current.signer = ref;
                }}
              />
              <EditInput
                label={FIELD_LABELS.signerRole}
                value={draft.signerRole}
                onChange={updateDraft("signerRole")}
                isRequired
                isSelect
                onSelectPress={() =>
                  dispatch({
                    type: "OPEN_SELECT_MODAL",
                    field: "signerRole",
                    title: "Chọn chức vụ",
                  })
                }
                hasError={!!errors.signerRole}
                viewRef={(ref) => {
                  fieldViewRefs.current.signerRole = ref;
                }}
              />
              <EditInput
                label={FIELD_LABELS.processingDeadline}
                value={draft.processingDeadline}
                onChange={updateDraft("processingDeadline")}
                isRequired
                isDate
                onDatePress={() =>
                  dispatch({
                    type: "OPEN_DATE_MODAL",
                    field: "processingDeadline",
                    title: "Chọn hạn xử lý",
                  })
                }
                hasError={!!errors.processingDeadline}
                viewRef={(ref) => {
                  fieldViewRefs.current.processingDeadline = ref;
                }}
              />
              <EditInput
                label={FIELD_LABELS.operationType}
                value={draft.operationType}
                onChange={updateDraft("operationType")}
                isRequired
                isSelect
                onSelectPress={() =>
                  dispatch({
                    type: "OPEN_SELECT_MODAL",
                    field: "operationType",
                    title: "Chọn loại nghiệp vụ",
                  })
                }
                hasError={!!errors.operationType}
                viewRef={(ref) => {
                  fieldViewRefs.current.operationType = ref;
                }}
              />
              <EditInput
                label={FIELD_LABELS.language}
                value={draft.language}
                onChange={updateDraft("language")}
                isRequired
                isSelect
                onSelectPress={() =>
                  dispatch({
                    type: "OPEN_SELECT_MODAL",
                    field: "language",
                    title: "Chọn ngôn ngữ",
                  })
                }
                hasError={!!errors.language}
                viewRef={(ref) => {
                  fieldViewRefs.current.language = ref;
                }}
              />
              <EditInput
                label={FIELD_LABELS.pageCount}
                value={draft.pageCount}
                onChange={updateDraft("pageCount")}
                isRequired
                isNumeric
                hasError={!!errors.pageCount}
                errorMessage="Số trang phải là số nguyên dương"
                viewRef={(ref) => {
                  fieldViewRefs.current.pageCount = ref;
                }}
              />
              <EditInput
                label={FIELD_LABELS.note}
                value={draft.note}
                onChange={updateDraft("note")}
                isRequired
                isMultiline
                hasError={!!errors.note}
                viewRef={(ref) => {
                  fieldViewRefs.current.note = ref;
                }}
              />

              {/* Checkbox */}
              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() =>
                  dispatch({
                    type: "SET_DRAFT_CHECKBOX",
                    value: !draftHasAltCheckbox,
                  })
                }
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.checkbox,
                    !draftHasAltCheckbox && { backgroundColor: "#E5E7EB" },
                  ]}
                >
                  {draftHasAltCheckbox && (
                    <Ionicons
                      name="checkmark-sharp"
                      size={14}
                      color="#FFFFFF"
                    />
                  )}
                </View>
                <Text style={styles.checkboxLabel}>
                  Văn bản điện tử có kèm bản giấy
                </Text>
              </TouchableOpacity>

              {/* Edit actions */}
              <View style={styles.editActionRow}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={handleCancel}
                >
                  <Text style={styles.cancelButtonText}>Hủy</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSave}
                >
                  <Text style={styles.saveButtonText}>Lưu lại</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <>
              {(Object.keys(FIELD_LABELS) as (keyof DocData)[]).map((key) => (
                <InfoRow
                  key={key}
                  label={FIELD_LABELS[key]}
                  value={display[key]}
                />
              ))}
              <View style={styles.checkboxRow}>
                <View
                  style={[
                    styles.checkbox,
                    !hasAltCheckbox && { backgroundColor: "#E5E7EB" },
                  ]}
                >
                  {hasAltCheckbox && (
                    <Ionicons
                      name="checkmark-sharp"
                      size={14}
                      color="#FFFFFF"
                    />
                  )}
                </View>
                <Text style={[styles.checkboxLabel, { color: "#6B7280" }]}>
                  Văn bản điện tử có kèm bản giấy
                </Text>
              </View>
            </>
          )}
        </Section>

        {/* ── Cho ý kiến ── */}
        <Section title="Cho ý kiến" icon="chatbubble-outline">
          <View ref={commentSectionRef}>
            <Text style={styles.inputLabel}>Ý kiến xử lý</Text>
            <TextInput
              style={[
                styles.textInput,
                commentError && { borderColor: "#EF4444", borderWidth: 1.5 },
              ]}
              placeholder="Nhập ý kiến xử lý..."
              multiline
              value={comment}
              onChangeText={(v) => {
                dispatch({ type: "SET_COMMENT", value: v });
                if (commentError && v.trim())
                  dispatch({ type: "SET_COMMENT_ERROR", value: false });
              }}
            />
            {commentError && (
              <Text style={styles.errorText}>
                Ý kiến xử lý không được để trống
              </Text>
            )}
          </View>
        </Section>

        {/* ── Nơi nhận ── */}
        <Section
          title="Thông tin nơi nhận"
          icon="people-outline"
          rightElement={
            <TouchableOpacity
              onPress={() =>
                dispatch({ type: "SET_RECIPIENT_MODAL", value: "internal" })
              }
            >
              <Ionicons name="create-outline" size={20} color="#2563EB" />
            </TouchableOpacity>
          }
        >
          {/* Trong ngành */}
          <View style={styles.recipientHeader}>
            <Text style={styles.subLabel}>
              Nơi nhận trong ngành ({internalRecipients.length})
            </Text>
            <TouchableOpacity
              onPress={() =>
                dispatch({ type: "SET_RECIPIENT_MODAL", value: "internal" })
              }
            >
              <Text style={{ fontSize: 12, color: "#2563EB" }}>Chỉnh sửa</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.tagContainer}>
            {(expandedInternal
              ? internalRecipients
              : internalRecipients.slice(0, 3)
            ).map((r) => (
              <View key={r.code} style={styles.tag}>
                <Text style={styles.tagText}>{r.code}</Text>
              </View>
            ))}
            {internalRecipients.length > 3 && (
              <TouchableOpacity
                onPress={() => dispatch({ type: "TOGGLE_EXPANDED_INTERNAL" })}
              >
                <Text style={styles.moreText}>
                  {expandedInternal
                    ? "Thu gọn"
                    : `+ ${internalRecipients.length - 3} đơn vị khác`}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Ngoài ngành */}
          <View style={styles.recipientHeader}>
            <Text style={styles.subLabel}>
              Nơi nhận ngoài ngành ({externalRecipients.length})
            </Text>
            <TouchableOpacity
              onPress={() =>
                dispatch({ type: "SET_RECIPIENT_MODAL", value: "external" })
              }
            >
              <Text style={{ fontSize: 12, color: "#2563EB" }}>Chỉnh sửa</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.tagContainer}>
            {(expandedExternal
              ? externalRecipients
              : externalRecipients.slice(0, 3)
            ).map((r) => (
              <View key={r.code} style={styles.tag}>
                <Text style={styles.tagText}>{r.code}</Text>
              </View>
            ))}
            {externalRecipients.length > 3 && (
              <TouchableOpacity
                onPress={() => dispatch({ type: "TOGGLE_EXPANDED_EXTERNAL" })}
              >
                <Text style={styles.moreText}>
                  {expandedExternal
                    ? "Thu gọn"
                    : `+ ${externalRecipients.length - 3} đơn vị khác`}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </Section>

        {/* ── Tệp văn bản ── */}
        <Section title={`Tệp văn bản (${files.length})`} icon="attach-outline">
          <View style={{ gap: 10 }}>
            {files.map((file: AttachedFile) => {
              const icon = getFileIcon(file.mimeType);
              return (
                <View key={file.id} style={styles.fileCard}>
                  <View style={styles.fileInfo}>
                    <View style={styles.fileIconBox}>
                      <Ionicons name={icon.name} size={24} color={icon.color} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.fileName} numberOfLines={1}>
                        {file.name}
                      </Text>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <Text style={styles.fileSize}>
                          {formatFileSize(file.size)}
                        </Text>
                        {file.status === "pending" && (
                          <View style={styles.statusBadge}>
                            <Text style={styles.statusBadgeText}>Đang tải</Text>
                          </View>
                        )}
                        {file.status === "error" && (
                          <View
                            style={[
                              styles.statusBadge,
                              { backgroundColor: "#FEE2E2" },
                            ]}
                          >
                            <Text
                              style={[
                                styles.statusBadgeText,
                                { color: "#EF4444" },
                              ]}
                            >
                              Lỗi
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                  <View style={styles.fileActions}>
                    <TouchableOpacity
                      style={styles.smallFileAction}
                      onPress={() => handleDeleteFile(file.id)}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={20}
                        color="#EF4444"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.mainFileAction}
                      onPress={() => handleViewFile(file)}
                    >
                      <Ionicons name="eye-outline" size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
          <TouchableOpacity
            style={[styles.outlineButton, isUploadingFile && { opacity: 0.5 }]}
            onPress={handlePickFile}
            disabled={isUploadingFile}
          >
            <Ionicons
              name={
                isUploadingFile ? "hourglass-outline" : "cloud-upload-outline"
              }
              size={20}
              color="#2563EB"
            />
            <Text style={styles.outlineButtonText}>
              {isUploadingFile ? "Đang xử lý..." : "Chọn file đính kèm"}
            </Text>
          </TouchableOpacity>
        </Section>

        {/* ── Văn bản thay thế ── */}
        <Section
          title={`Văn bản thay thế (${relatedDocs.length})`}
          icon="repeat-outline"
          rightElement={
            <TouchableOpacity
              onPress={() =>
                dispatch({ type: "SET_RELATED_DOC_MODAL", value: "related" })
              }
            >
              <Ionicons name="add-circle-outline" size={20} color="#2563EB" />
            </TouchableOpacity>
          }
        >
          {relatedDocs.length === 0 ? (
            <Text style={styles.emptyText}>Chưa có văn bản thay thế</Text>
          ) : (
            <View style={{ gap: 10 }}>
              {relatedDocs.map((doc) => (
                <View key={doc.id} style={{ position: "relative" }}>
                  <TaskCard
                    docId={doc.docId}
                    isUrgent={doc.isUrgent}
                    title={doc.title}
                    sender={doc.sender}
                  />
                  <TouchableOpacity
                    style={styles.removeDocBtn}
                    onPress={() =>
                      dispatch({ type: "REMOVE_RELATED_DOC", id: doc.id })
                    }
                  >
                    <Ionicons name="close-circle" size={22} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
          <TouchableOpacity
            style={[
              styles.outlineButton,
              { marginTop: relatedDocs.length > 0 ? 8 : 0 },
            ]}
            onPress={() =>
              dispatch({ type: "SET_RELATED_DOC_MODAL", value: "related" })
            }
          >
            <Ionicons name="add-outline" size={20} color="#2563EB" />
            <Text style={styles.outlineButtonText}>Thêm văn bản</Text>
          </TouchableOpacity>
        </Section>

        {/* ── Văn bản gốc ── */}
        <Section
          title={`Văn bản gốc (${originalDocs.length})`}
          icon="document-outline"
          rightElement={
            <TouchableOpacity
              onPress={() =>
                dispatch({ type: "SET_RELATED_DOC_MODAL", value: "original" })
              }
            >
              <Ionicons name="add-circle-outline" size={20} color="#2563EB" />
            </TouchableOpacity>
          }
        >
          {originalDocs.length === 0 ? (
            <Text style={styles.emptyText}>Chưa có văn bản gốc</Text>
          ) : (
            <View style={{ gap: 10 }}>
              {originalDocs.map((doc) => (
                <View key={doc.id} style={{ position: "relative" }}>
                  <TaskCard
                    docId={doc.docId}
                    isUrgent={doc.isUrgent}
                    title={doc.title}
                    sender={doc.sender}
                  />
                  <TouchableOpacity
                    style={styles.removeDocBtn}
                    onPress={() =>
                      dispatch({ type: "REMOVE_ORIGINAL_DOC", id: doc.id })
                    }
                  >
                    <Ionicons name="close-circle" size={22} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
          <TouchableOpacity
            style={[
              styles.outlineButton,
              { marginTop: originalDocs.length > 0 ? 8 : 0 },
            ]}
            onPress={() =>
              dispatch({ type: "SET_RELATED_DOC_MODAL", value: "original" })
            }
          >
            <Ionicons name="add-outline" size={20} color="#2563EB" />
            <Text style={styles.outlineButtonText}>Thêm văn bản gốc</Text>
          </TouchableOpacity>
        </Section>
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity style={styles.primaryButton} onPress={handleForward}>
          <Ionicons
            name="arrow-forward-circle-outline"
            size={20}
            color="#FFFFFF"
            style={{ marginRight: 6 }}
          />
          <Text style={styles.primaryButtonText}>Chuyển xử lý</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={handleReturn}>
          <Ionicons
            name="return-down-back-outline"
            size={20}
            color="#FFFFFF"
            style={{ marginRight: 6 }}
          />
          <Text style={styles.secondaryButtonText}>Trả lại</Text>
        </TouchableOpacity>
      </View>

      {/* ── Modals ── */}

      {selectModal && (
        <SelectModal
          visible={!!selectModal}
          title={selectModal.title}
          options={SELECT_OPTIONS[selectModal.field] ?? []}
          selected={draft?.[selectModal.field] ?? ""}
          onSelect={(v) =>
            dispatch({
              type: "UPDATE_DRAFT",
              field: selectModal.field,
              value: v,
            })
          }
          onClose={() => dispatch({ type: "CLOSE_SELECT_MODAL" })}
        />
      )}

      {dateModal && (
        <DatePickerModal
          visible={!!dateModal}
          title={dateModal.title}
          value={draft?.[dateModal.field] ?? ""}
          onConfirm={(v) =>
            dispatch({ type: "UPDATE_DRAFT", field: dateModal.field, value: v })
          }
          onClose={() => dispatch({ type: "CLOSE_DATE_MODAL" })}
        />
      )}

      {recipientModal && (
        <RecipientModal
          visible={!!recipientModal}
          type={recipientModal}
          current={
            recipientModal === "internal"
              ? internalRecipients
              : externalRecipients
          }
          onSave={(list) =>
            dispatch({
              type:
                recipientModal === "internal"
                  ? "SET_INTERNAL_RECIPIENTS"
                  : "SET_EXTERNAL_RECIPIENTS",
              list,
            })
          }
          onClose={() => dispatch({ type: "SET_RECIPIENT_MODAL", value: null })}
        />
      )}

      {relatedDocModal && (
        <RelatedDocModal
          visible={!!relatedDocModal}
          current={relatedDocModal === "related" ? relatedDocs : originalDocs}
          onSave={(list) =>
            dispatch({
              type:
                relatedDocModal === "related"
                  ? "SET_RELATED_DOCS"
                  : "SET_ORIGINAL_DOCS",
              list,
            })
          }
          onClose={() =>
            dispatch({ type: "SET_RELATED_DOC_MODAL", value: null })
          }
        />
      )}
    </View>
  );
}

// ─── Modal Styles ─────────────────────────────────────────────

const modalStyles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)" },
  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "65%",
    paddingBottom: 16,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E5E7EB",
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 4,
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  sheetTitle: { fontSize: 16, fontWeight: "bold", color: "#111827" },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F9FAFB",
  },
  optionSelected: { backgroundColor: "#EFF6FF" },
  optionText: { fontSize: 14, color: "#374151", flex: 1, marginRight: 8 },
  optionTextSelected: { color: "#2563EB", fontWeight: "600" },
  iosButtonRow: { flexDirection: "row", gap: 12, marginTop: 12 },
  iosCancelBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
  },
  iosCancelText: { fontSize: 15, fontWeight: "600", color: "#374151" },
  iosConfirmBtn: {
    flex: 2,
    paddingVertical: 13,
    borderRadius: 10,
    backgroundColor: "#2563EB",
    alignItems: "center",
  },
  iosConfirmText: { fontSize: 15, fontWeight: "600", color: "#FFFFFF" },
});

// ─── Screen Styles ────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F4F6" },
  header: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    lineHeight: 22,
  },
  headerAction: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeRow: { flexDirection: "row", gap: 8, marginTop: 4, paddingLeft: 52 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  badgeText: { fontSize: 12, color: "#FFFFFF", fontWeight: "bold" },
  content: { flex: 1 },
  contentPadding: { padding: 16, gap: 16 },
  sectionContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  sectionTitleRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  sectionIconBg: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: { fontSize: 15, fontWeight: "bold", color: "#111827" },
  sectionHeaderRight: { flexDirection: "row", alignItems: "center" },
  sectionContent: { padding: 16, paddingTop: 0, gap: 8 },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  infoLabel: { fontSize: 13, color: "#6B7280", flex: 1 },
  infoValue: { fontSize: 13, color: "#374151", flex: 2, textAlign: "right" },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 8,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxLabel: { fontSize: 13, color: "#374151" },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 4,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 12,
    minHeight: 80,
    textAlignVertical: "top",
    fontSize: 14,
  },
  recipientHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  subLabel: { fontSize: 12, color: "#6B7280", marginBottom: 4 },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  tag: {
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagText: { fontSize: 12, color: "#374151", fontWeight: "500" },
  moreText: { fontSize: 12, color: "#2563EB", fontWeight: "500" },
  fileCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  fileInfo: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1 },
  fileIconBox: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  fileName: { fontSize: 14, fontWeight: "600", color: "#111827" },
  fileSize: { fontSize: 12, color: "#9CA3AF" },
  statusBadge: {
    backgroundColor: "#DBEAFE",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusBadgeText: { fontSize: 10, color: "#2563EB", fontWeight: "600" },
  fileActions: { flexDirection: "row", alignItems: "center", gap: 8 },
  smallFileAction: { padding: 8 },
  mainFileAction: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
  },
  outlineButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#2563EB",
    borderStyle: "dashed",
    gap: 8,
    marginTop: 8,
  },
  outlineButtonText: { fontSize: 14, color: "#2563EB", fontWeight: "600" },
  emptyText: { fontSize: 13, color: "#9CA3AF", fontStyle: "italic" },
  removeDocBtn: { position: "absolute", top: -8, right: -8, zIndex: 10 },
  footer: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  primaryButton: {
    flex: 2,
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "bold" },
  secondaryButton: {
    flex: 1,
    backgroundColor: "#6B7280",
    paddingVertical: 14,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "bold" },
  editInputContainer: { marginBottom: 4 },
  editInputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6,
  },
  editInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
  },
  editInnerInput: { flex: 1, height: 44, fontSize: 14, color: "#111827" },
  errorText: { fontSize: 12, color: "#EF4444", marginTop: 4 },
  editActionRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  cancelButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
  },
  cancelButtonText: { fontSize: 14, fontWeight: "600", color: "#374151" },
  saveButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#2563EB",
  },
  saveButtonText: { fontSize: 14, fontWeight: "600", color: "#FFFFFF" },
});
