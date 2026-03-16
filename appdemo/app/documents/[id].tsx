import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useDocumentDetail } from "@/hooks/useDocumentDetail";
import { DocumentCommentSection } from "@/components/documents/DocumentCommentSection";
import { DocumentFilesSection } from "@/components/documents/DocumentFilesSection";
import { DocumentFooter } from "@/components/documents/DocumentFooter";
import { DocumentHeader } from "@/components/documents/DocumentHeader";
import { DocumentInfoSection } from "@/components/documents/DocumentInfoSection";
import { DocumentModals } from "@/components/documents/DocumentModals";
import { DocumentRecipientSection } from "@/components/documents/DocumentRecipientSection";
import { DocumentRelatedDocsSection } from "@/components/documents/DocumentRelatedDocsSection";
import { styles } from "@/components/documents/documentDetail.styles";

export default function DocumentDetailScreen() {
  useLocalSearchParams(); // id sẽ dùng khi gọi API
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
    isEditing,
    draft,
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
    expandedInternal,
    expandedExternal,
  } = state;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <DocumentHeader
        title="Quyết định về việc điều chỉnh phương án kinh doanh ABC"
        urgency="Hỏa tốc"
        status="Đang thực hiện"
      />

      <ScrollView
        ref={scrollViewRef}
        style={styles.content}
        contentContainerStyle={styles.contentPadding}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <DocumentInfoSection
          display={display}
          draft={draft}
          isEditing={isEditing}
          errors={errors}
          hasAltCheckbox={hasAltCheckbox}
          draftHasAltCheckbox={draftHasAltCheckbox}
          fieldViewRefs={fieldViewRefs}
          updateDraft={updateDraft}
          dispatch={dispatch}
          onStartEdit={handleStartEdit}
          onCancel={handleCancel}
          onSave={handleSave}
        />

        <DocumentCommentSection
          comment={comment}
          commentError={commentError}
          commentSectionRef={commentSectionRef}
          dispatch={dispatch}
        />

        <DocumentRecipientSection
          internalRecipients={internalRecipients}
          externalRecipients={externalRecipients}
          expandedInternal={expandedInternal}
          expandedExternal={expandedExternal}
          dispatch={dispatch}
        />

        <DocumentFilesSection
          files={files}
          isUploadingFile={isUploadingFile}
          onPickFile={handlePickFile}
          onViewFile={handleViewFile}
          onDeleteFile={handleDeleteFile}
        />

        <DocumentRelatedDocsSection
          title={`Văn bản thay thế (${relatedDocs.length})`}
          icon="repeat-outline"
          docs={relatedDocs}
          emptyText="Chưa có văn bản thay thế"
          addText="Thêm văn bản"
          onAdd={() =>
            dispatch({ type: "SET_RELATED_DOC_MODAL", value: "related" })
          }
          onRemove={(id) => dispatch({ type: "REMOVE_RELATED_DOC", id })}
          rightElement={
            <TouchableOpacity
              onPress={() =>
                dispatch({ type: "SET_RELATED_DOC_MODAL", value: "related" })
              }
            >
              <Ionicons name="add-circle-outline" size={20} color="#2563EB" />
            </TouchableOpacity>
          }
        />

        <DocumentRelatedDocsSection
          title={`Văn bản gốc (${originalDocs.length})`}
          icon="document-outline"
          docs={originalDocs}
          emptyText="Chưa có văn bản gốc"
          addText="Thêm văn bản gốc"
          onAdd={() =>
            dispatch({ type: "SET_RELATED_DOC_MODAL", value: "original" })
          }
          onRemove={(id) => dispatch({ type: "REMOVE_ORIGINAL_DOC", id })}
          rightElement={
            <TouchableOpacity
              onPress={() =>
                dispatch({ type: "SET_RELATED_DOC_MODAL", value: "original" })
              }
            >
              <Ionicons name="add-circle-outline" size={20} color="#2563EB" />
            </TouchableOpacity>
          }
        />
      </ScrollView>

      <DocumentFooter
        paddingBottom={insets.bottom + 16}
        onForward={handleForward}
        onReturn={handleReturn}
      />

      <DocumentModals state={state} dispatch={dispatch} />
    </View>
  );
}
