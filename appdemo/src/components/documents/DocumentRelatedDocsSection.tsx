import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Section } from "@/components/common/Section";
import { TaskCard } from "@/components/dashboard/TaskCard";
import { DocumentDetailAction, RelatedDoc } from "@/types";
import { styles } from "./documentDetail.styles";

interface Props {
  title: string;
  icon: string;
  docs: RelatedDoc[];
  emptyText: string;
  addText: string;
  onAdd: () => void;
  onRemove: (id: string) => void;
  rightElement: React.ReactNode;
}

export const DocumentRelatedDocsSection = ({
  title,
  icon,
  docs,
  emptyText,
  addText,
  onAdd,
  onRemove,
  rightElement,
}: Props) => (
  <Section title={title} icon={icon as any} rightElement={rightElement}>
    {docs.length === 0 ? (
      <Text style={styles.emptyText}>{emptyText}</Text>
    ) : (
      <View style={{ gap: 10 }}>
        {docs.map((doc) => (
          <View key={doc.id} style={{ position: "relative" }}>
            <TaskCard
              docId={doc.docId}
              isUrgent={doc.isUrgent}
              title={doc.title}
              sender={doc.sender}
            />
            <TouchableOpacity
              style={styles.removeDocBtn}
              onPress={() => onRemove(doc.id)}
            >
              <Ionicons name="close-circle" size={22} color="#EF4444" />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    )}
    <TouchableOpacity
      style={[styles.outlineButton, { marginTop: docs.length > 0 ? 8 : 0 }]}
      onPress={onAdd}
    >
      <Ionicons name="add-outline" size={20} color="#2563EB" />
      <Text style={styles.outlineButtonText}>{addText}</Text>
    </TouchableOpacity>
  </Section>
);
