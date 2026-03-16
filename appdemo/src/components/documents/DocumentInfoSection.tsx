// Toggle giữa chế độ xem và chỉnh sửa
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { InfoRow } from "@/components/common/InfoRow";
import { Section } from "@/components/common/Section";
import { FIELD_LABELS } from "../../constants/document.constants";
import { DocData, DocumentDetailAction } from "../../types/document.types";
import { styles } from "./documentDetail.styles";
import { DocumentEditForm } from "./DocumentEditForm";

interface Props {
  display: DocData;
  draft: DocData | null;
  isEditing: boolean;
  errors: Partial<Record<keyof DocData, boolean>>;
  hasAltCheckbox: boolean;
  draftHasAltCheckbox: boolean;
  fieldViewRefs: React.MutableRefObject<Partial<Record<keyof DocData, any>>>;
  updateDraft: (field: keyof DocData) => (v: string) => void;
  dispatch: (a: DocumentDetailAction) => void;
  onStartEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
}

export const DocumentInfoSection = ({
  display,
  draft,
  isEditing,
  errors,
  hasAltCheckbox,
  draftHasAltCheckbox,
  fieldViewRefs,
  updateDraft,
  dispatch,
  onStartEdit,
  onCancel,
  onSave,
}: Props) => (
  <Section
    title="Thông tin văn bản"
    icon="document-text-outline"
    rightElement={
      !isEditing && (
        <TouchableOpacity onPress={onStartEdit}>
          <Ionicons name="create-outline" size={20} color="#2563EB" />
        </TouchableOpacity>
      )
    }
  >
    {isEditing && draft ? (
      <DocumentEditForm
        draft={draft}
        errors={errors}
        draftHasAltCheckbox={draftHasAltCheckbox}
        fieldViewRefs={fieldViewRefs}
        updateDraft={updateDraft}
        dispatch={dispatch}
        onCancel={onCancel}
        onSave={onSave}
      />
    ) : (
      <>
        {(Object.keys(FIELD_LABELS) as (keyof DocData)[]).map((key) => (
          <InfoRow key={key} label={FIELD_LABELS[key]} value={display[key]} />
        ))}
        <View style={styles.checkboxRow}>
          <View
            style={[
              styles.checkbox,
              !hasAltCheckbox && { backgroundColor: "#E5E7EB" },
            ]}
          >
            {hasAltCheckbox && (
              <Ionicons name="checkmark-sharp" size={14} color="#FFF" />
            )}
          </View>
          <Text style={[styles.checkboxLabel, { color: "#6B7280" }]}>
            Văn bản điện tử có kèm bản giấy
          </Text>
        </View>
      </>
    )}
  </Section>
);
