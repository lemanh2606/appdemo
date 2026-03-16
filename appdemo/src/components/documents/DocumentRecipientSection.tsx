import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Section } from "@/components/common/Section";
import { DocumentDetailAction, Recipient } from "@/types";
import { styles } from "./documentDetail.styles";

interface RecipientGroupProps {
  label: string;
  recipients: Recipient[];
  expanded: boolean;
  onEdit: () => void;
  onToggleExpand: () => void;
}

const RecipientGroup = ({
  label,
  recipients,
  expanded,
  onEdit,
  onToggleExpand,
}: RecipientGroupProps) => (
  <>
    <View style={styles.recipientHeader}>
      <Text style={styles.subLabel}>
        {label} ({recipients.length})
      </Text>
      <TouchableOpacity onPress={onEdit}>
        <Text style={{ fontSize: 12, color: "#2563EB" }}>Chỉnh sửa</Text>
      </TouchableOpacity>
    </View>
    <View style={styles.tagContainer}>
      {(expanded ? recipients : recipients.slice(0, 3)).map((r) => (
        <View key={r.code} style={styles.tag}>
          <Text style={styles.tagText}>{r.code}</Text>
        </View>
      ))}
      {recipients.length > 3 && (
        <TouchableOpacity onPress={onToggleExpand}>
          <Text style={styles.moreText}>
            {expanded ? "Thu gọn" : `+ ${recipients.length - 3} đơn vị khác`}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  </>
);

interface Props {
  internalRecipients: Recipient[];
  externalRecipients: Recipient[];
  expandedInternal: boolean;
  expandedExternal: boolean;
  dispatch: (a: DocumentDetailAction) => void;
}

export const DocumentRecipientSection = ({
  internalRecipients,
  externalRecipients,
  expandedInternal,
  expandedExternal,
  dispatch,
}: Props) => (
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
    <RecipientGroup
      label="Nơi nhận trong ngành"
      recipients={internalRecipients}
      expanded={expandedInternal}
      onEdit={() =>
        dispatch({ type: "SET_RECIPIENT_MODAL", value: "internal" })
      }
      onToggleExpand={() => dispatch({ type: "TOGGLE_EXPANDED_INTERNAL" })}
    />
    <RecipientGroup
      label="Nơi nhận ngoài ngành"
      recipients={externalRecipients}
      expanded={expandedExternal}
      onEdit={() =>
        dispatch({ type: "SET_RECIPIENT_MODAL", value: "external" })
      }
      onToggleExpand={() => dispatch({ type: "TOGGLE_EXPANDED_EXTERNAL" })}
    />
  </Section>
);
