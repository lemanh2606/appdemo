import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Section } from "@/components/common/Section";
import { AttachedFile } from "@/types";
import { formatFileSize, getFileIcon } from "@/utils/documentHelpers";
import { styles } from "./documentDetail.styles";

interface Props {
  files: AttachedFile[];
  isUploadingFile: boolean;
  onPickFile: () => void;
  onViewFile: (file: AttachedFile) => void;
  onDeleteFile: (id: string) => void;
}

export const DocumentFilesSection = ({
  files,
  isUploadingFile,
  onPickFile,
  onViewFile,
  onDeleteFile,
}: Props) => (
  <Section title={`Tệp văn bản (${files.length})`} icon="attach-outline">
    <View style={{ gap: 10 }}>
      {files.map((file) => {
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
                  style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
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
                        style={[styles.statusBadgeText, { color: "#EF4444" }]}
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
                onPress={() => onDeleteFile(file.id)}
              >
                <Ionicons name="trash-outline" size={20} color="#EF4444" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.mainFileAction}
                onPress={() => onViewFile(file)}
              >
                <Ionicons name="eye-outline" size={20} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>
        );
      })}
    </View>
    <TouchableOpacity
      style={[styles.outlineButton, isUploadingFile && { opacity: 0.5 }]}
      onPress={onPickFile}
      disabled={isUploadingFile}
    >
      <Ionicons
        name={isUploadingFile ? "hourglass-outline" : "cloud-upload-outline"}
        size={20}
        color="#2563EB"
      />
      <Text style={styles.outlineButtonText}>
        {isUploadingFile ? "Đang xử lý..." : "Chọn file đính kèm"}
      </Text>
    </TouchableOpacity>
  </Section>
);
