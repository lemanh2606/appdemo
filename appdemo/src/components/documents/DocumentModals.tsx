// Gom tất cả modal instances vào 1 chỗ — [id].tsx chỉ render <DocumentModals />
import React from "react";
import { SelectModal } from "@/components/common/SelectModal";
import { DatePickerModal } from "@/components/common/DatePickerModal";
import { SELECT_OPTIONS } from "../../constants/document.constants";
import {
  DocData,
  DocumentDetailAction,
  DocumentDetailState,
} from "../../types/document.types";
import { RecipientModal } from "./RecipientModal";
import { RelatedDocModal } from "./RelatedDocModal";

interface Props {
  state: DocumentDetailState;
  dispatch: (a: DocumentDetailAction) => void;
}

export const DocumentModals = ({ state, dispatch }: Props) => {
  const {
    draft,
    selectModal,
    dateModal,
    recipientModal,
    relatedDocModal,
    internalRecipients,
    externalRecipients,
    relatedDocs,
    originalDocs,
  } = state;

  return (
    <>
      {selectModal && (
        <SelectModal
          visible
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
          visible
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
          visible
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
          visible
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
    </>
  );
};
