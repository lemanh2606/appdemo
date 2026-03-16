import React from "react";
import { Text, TextInput, View } from "react-native";
import { Section } from "@/components/common/Section";
import { DocumentDetailAction } from "@/types";
import { styles } from "./documentDetail.styles";

interface Props {
  comment: string;
  commentError: boolean;
  commentSectionRef: React.RefObject<View | null>;
  dispatch: (a: DocumentDetailAction) => void;
}

export const DocumentCommentSection = ({
  comment,
  commentError,
  commentSectionRef,
  dispatch,
}: Props) => (
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
        <Text style={styles.errorText}>Ý kiến xử lý không được để trống</Text>
      )}
    </View>
  </Section>
);
