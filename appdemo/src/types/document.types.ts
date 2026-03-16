// src/types/document.types.ts

export interface DocData {
    type: string;
    category: string;
    arrivalDate: string;
    urgency: string;
    department: string;
    creator: string;
    signer: string;
    signerRole: string;
    processingDeadline: string;
    operationType: string;
    language: string;
    pageCount: string;
    note: string;
}

export interface AttachedFile {
    id: string;
    name: string;
    size: number;
    mimeType?: string;
    uri: string;
    status: "uploaded" | "pending" | "error";
}

export interface RelatedDoc {
    id: string;
    docId: string;
    title: string;
    sender: string;
    isUrgent: boolean;
}

export interface Recipient {
    code: string;
    name: string;
    type: "internal" | "external";
}

export type DocDataKey = keyof DocData;



export type DocumentDetailAction =
    | { type: "START_EDIT" }
    | { type: "CANCEL_EDIT" }
    | { type: "UPDATE_DRAFT"; field: keyof DocData; value: string }
    | { type: "SET_DRAFT_CHECKBOX"; value: boolean }
    | { type: "SAVE_DOC"; docData: DocData; hasAltCheckbox: boolean }
    | { type: "SET_ERRORS"; errors: Partial<Record<keyof DocData, boolean>> }
    | { type: "CLEAR_FIELD_ERROR"; field: keyof DocData }
    | { type: "ADD_FILES"; files: AttachedFile[] }
    | { type: "DELETE_FILE"; id: string }
    | { type: "SET_UPLOADING"; value: boolean }
    | { type: "SET_INTERNAL_RECIPIENTS"; list: Recipient[] }
    | { type: "SET_EXTERNAL_RECIPIENTS"; list: Recipient[] }
    | { type: "SET_RELATED_DOCS"; list: RelatedDoc[] }
    | { type: "REMOVE_RELATED_DOC"; id: string }
    | { type: "SET_ORIGINAL_DOCS"; list: RelatedDoc[] }
    | { type: "REMOVE_ORIGINAL_DOC"; id: string }
    | { type: "SET_COMMENT"; value: string }
    | { type: "SET_COMMENT_ERROR"; value: boolean }
    | { type: "OPEN_SELECT_MODAL"; field: keyof DocData; title: string }
    | { type: "CLOSE_SELECT_MODAL" }
    | { type: "OPEN_DATE_MODAL"; field: keyof DocData; title: string }
    | { type: "CLOSE_DATE_MODAL" }
    | { type: "SET_RECIPIENT_MODAL"; value: "internal" | "external" | null }
    | { type: "SET_RELATED_DOC_MODAL"; value: "related" | "original" | null }
    | { type: "TOGGLE_EXPANDED_INTERNAL" }
    | { type: "TOGGLE_EXPANDED_EXTERNAL" };

export interface DocumentDetailState {
    docData: DocData;
    draft: DocData | null;
    isEditing: boolean;
    errors: Partial<Record<keyof DocData, boolean>>;
    hasAltCheckbox: boolean;
    draftHasAltCheckbox: boolean;
    files: AttachedFile[];
    isUploadingFile: boolean;
    internalRecipients: Recipient[];
    externalRecipients: Recipient[];
    relatedDocs: RelatedDoc[];
    originalDocs: RelatedDoc[];
    comment: string;
    commentError: boolean;
    selectModal: { field: keyof DocData; title: string } | null;
    dateModal: { field: keyof DocData; title: string } | null;
    recipientModal: "internal" | "external" | null;
    relatedDocModal: "related" | "original" | null;
    expandedInternal: boolean;
    expandedExternal: boolean;
}
