// app/(tabs)/documents/reducers/documentDetailReducer.ts

import { DocData, AttachedFile, Recipient, RelatedDoc } from "../../app/documents/types";
import {
    INITIAL_DOC, INITIAL_FILES,
    INITIAL_INTERNAL_RECIPIENTS, INITIAL_EXTERNAL_RECIPIENTS,
    INITIAL_RELATED_DOCS, INITIAL_ORIGINAL_DOCS,
} from "../../app/documents/constants";

// ─── State ────────────────────────────────────────────────────

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

// ─── Actions ──────────────────────────────────────────────────

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

// ─── Initial state ────────────────────────────────────────────

export const initialDocumentDetailState: DocumentDetailState = {
    docData: INITIAL_DOC,
    draft: null,
    isEditing: false,
    errors: {},
    hasAltCheckbox: true,
    draftHasAltCheckbox: true,
    files: INITIAL_FILES,
    isUploadingFile: false,
    internalRecipients: INITIAL_INTERNAL_RECIPIENTS,
    externalRecipients: INITIAL_EXTERNAL_RECIPIENTS,
    relatedDocs: INITIAL_RELATED_DOCS,
    originalDocs: INITIAL_ORIGINAL_DOCS,
    comment: "",
    commentError: false,
    selectModal: null,
    dateModal: null,
    recipientModal: null,
    relatedDocModal: null,
    expandedInternal: false,
    expandedExternal: false,
};

// ─── Reducer ──────────────────────────────────────────────────

export function documentDetailReducer(
    state: DocumentDetailState,
    action: DocumentDetailAction,
): DocumentDetailState {
    switch (action.type) {
        case "START_EDIT":
            return {
                ...state,
                draft: { ...state.docData },
                draftHasAltCheckbox: state.hasAltCheckbox,
                isEditing: true,
                errors: {},
            };
        case "CANCEL_EDIT":
            return { ...state, draft: null, errors: {}, isEditing: false };
        case "UPDATE_DRAFT":
            if (!state.draft) return state;
            return { ...state, draft: { ...state.draft, [action.field]: action.value } };
        case "SET_DRAFT_CHECKBOX":
            return { ...state, draftHasAltCheckbox: action.value };
        case "SAVE_DOC":
            return {
                ...state,
                docData: action.docData,
                hasAltCheckbox: action.hasAltCheckbox,
                draft: null,
                errors: {},
                isEditing: false,
            };
        case "SET_ERRORS":
            return { ...state, errors: action.errors };
        case "CLEAR_FIELD_ERROR":
            return { ...state, errors: { ...state.errors, [action.field]: false } };
        case "ADD_FILES":
            return { ...state, files: [...state.files, ...action.files] };
        case "DELETE_FILE":
            return { ...state, files: state.files.filter((f) => f.id !== action.id) };
        case "SET_UPLOADING":
            return { ...state, isUploadingFile: action.value };
        case "SET_INTERNAL_RECIPIENTS":
            return { ...state, internalRecipients: action.list };
        case "SET_EXTERNAL_RECIPIENTS":
            return { ...state, externalRecipients: action.list };
        case "SET_RELATED_DOCS":
            return { ...state, relatedDocs: action.list };
        case "REMOVE_RELATED_DOC":
            return { ...state, relatedDocs: state.relatedDocs.filter((d) => d.id !== action.id) };
        case "SET_ORIGINAL_DOCS":
            return { ...state, originalDocs: action.list };
        case "REMOVE_ORIGINAL_DOC":
            return { ...state, originalDocs: state.originalDocs.filter((d) => d.id !== action.id) };
        case "SET_COMMENT":
            return { ...state, comment: action.value };
        case "SET_COMMENT_ERROR":
            return { ...state, commentError: action.value };
        case "OPEN_SELECT_MODAL":
            return { ...state, selectModal: { field: action.field, title: action.title } };
        case "CLOSE_SELECT_MODAL":
            return { ...state, selectModal: null };
        case "OPEN_DATE_MODAL":
            return { ...state, dateModal: { field: action.field, title: action.title } };
        case "CLOSE_DATE_MODAL":
            return { ...state, dateModal: null };
        case "SET_RECIPIENT_MODAL":
            return { ...state, recipientModal: action.value };
        case "SET_RELATED_DOC_MODAL":
            return { ...state, relatedDocModal: action.value };
        case "TOGGLE_EXPANDED_INTERNAL":
            return { ...state, expandedInternal: !state.expandedInternal };
        case "TOGGLE_EXPANDED_EXTERNAL":
            return { ...state, expandedExternal: !state.expandedExternal };
        default:
            return state;
    }
}
