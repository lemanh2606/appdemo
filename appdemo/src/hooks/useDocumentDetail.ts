// app/(tabs)/documents/hooks/useDocumentDetail.ts

import { useReducer, useRef } from "react";
import { Alert, ScrollView, View } from "react-native";
import { Directory, File, Paths } from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
import * as Sharing from "expo-sharing";

import {
    documentDetailReducer,
    initialDocumentDetailState,
} from "../reducers/documentDetailReducer";
import { DocData, AttachedFile } from "../../app/documents/types";
import { REQUIRED_FIELDS, FIELD_ORDER } from "../../app/documents/constants";

export function useDocumentDetail() {
    const [state, dispatch] = useReducer(
        documentDetailReducer,
        initialDocumentDetailState,
    );

    const scrollViewRef = useRef<ScrollView>(null);
    const fieldViewRefs = useRef<Partial<Record<keyof DocData, View | null>>>({});
    const commentSectionRef = useRef<View | null>(null);

    // ─── Helpers ──────────────────────────────────────────────
    const isUnchanged =
        JSON.stringify(state.draft) === JSON.stringify(state.docData) &&
        state.draftHasAltCheckbox === state.hasAltCheckbox;

    const scrollToFirstError = (keys: (keyof DocData)[], delay = 50) => {
        const first = FIELD_ORDER.find((f) => keys.includes(f));
        if (!first) return;
        setTimeout(() => {
            const ref = fieldViewRefs.current[first];
            if (ref && scrollViewRef.current) {
                (ref as any).measureLayout(
                    scrollViewRef.current as any,
                    (_x: number, y: number) => {
                        scrollViewRef.current?.scrollTo({ y: Math.max(0, y - 16), animated: true });
                    },
                    () => { },
                );
            }
        }, delay);
    };

    // ─── Form ─────────────────────────────────────────────────
    const handleStartEdit = () => dispatch({ type: "START_EDIT" });

    const handleCancel = () => {
        if (isUnchanged) {
            dispatch({ type: "CANCEL_EDIT" });
            return;
        }
        Alert.alert(
            "Hủy chỉnh sửa",
            "Các thay đổi chưa lưu sẽ bị mất. Bạn có chắc?",
            [
                { text: "Tiếp tục chỉnh sửa", style: "cancel" },
                {
                    text: "Hủy bỏ",
                    style: "destructive",
                    onPress: () => dispatch({ type: "CANCEL_EDIT" }),
                },
            ],
        );
    };

    const validate = (data: DocData): boolean => {
        const newErrors: Partial<Record<keyof DocData, boolean>> = {};
        REQUIRED_FIELDS.forEach((f) => {
            if (!data[f]?.trim() || data[f] === "-") newErrors[f] = true;
        });
        const pc = Number(data.pageCount);
        if (
            !newErrors.pageCount &&
            (!data.pageCount?.trim() || isNaN(pc) || pc <= 0 || !Number.isInteger(pc))
        ) {
            newErrors.pageCount = true;
        }
        dispatch({ type: "SET_ERRORS", errors: newErrors });
        const keys = Object.keys(newErrors) as (keyof DocData)[];
        if (keys.length > 0) scrollToFirstError(keys);
        return keys.length === 0;
    };

    const handleSave = () => {
        if (!state.draft) return;
        if (isUnchanged) {
            dispatch({ type: "CANCEL_EDIT" });
            return;
        }
        if (!validate(state.draft)) {
            Alert.alert("Thiếu thông tin", "Vui lòng điền đầy đủ các trường bắt buộc (*).");
            return;
        }
        dispatch({
            type: "SAVE_DOC",
            docData: state.draft,
            hasAltCheckbox: state.draftHasAltCheckbox,
        });
        Alert.alert("✅ Thành công", "Đã lưu thông tin văn bản.");
    };

    const updateDraft = (field: keyof DocData) => (value: string) => {
        dispatch({ type: "UPDATE_DRAFT", field, value });
        if (state.errors[field]) dispatch({ type: "CLEAR_FIELD_ERROR", field });
    };

    // ─── Forward ──────────────────────────────────────────────
    const handleForward = () => {
        const docErrors: Partial<Record<keyof DocData, boolean>> = {};
        REQUIRED_FIELDS.forEach((f) => {
            if (!state.docData[f]?.trim() || state.docData[f] === "-") docErrors[f] = true;
        });
        const pc = Number(state.docData.pageCount);
        if (
            !docErrors.pageCount &&
            (!state.docData.pageCount?.trim() || isNaN(pc) || pc <= 0 || !Number.isInteger(pc))
        ) {
            docErrors.pageCount = true;
        }
        const docErrorKeys = Object.keys(docErrors) as (keyof DocData)[];
        if (docErrorKeys.length > 0) {
            dispatch({ type: "SET_ERRORS", errors: docErrors });
            if (!state.isEditing) dispatch({ type: "START_EDIT" });
            scrollToFirstError(docErrorKeys, 300);
            Alert.alert("Thiếu thông tin", "Vui lòng điền đầy đủ các trường bắt buộc (*) trước khi chuyển xử lý.");
            return;
        }
        if (!state.comment.trim()) {
            dispatch({ type: "SET_COMMENT_ERROR", value: true });
            setTimeout(() => {
                commentSectionRef.current?.measureLayout(
                    scrollViewRef.current as any,
                    (_x: number, y: number) => {
                        scrollViewRef.current?.scrollTo({ y: Math.max(0, y - 16), animated: true });
                    },
                    () => { },
                );
            }, 50);
            Alert.alert("Thiếu ý kiến xử lý", "Vui lòng nhập ý kiến xử lý trước khi chuyển.");
            return;
        }
        Alert.alert(
            "Chuyển xử lý",
            "Xác nhận chuyển văn bản này đến bộ phận xử lý tiếp theo?",
            [
                { text: "Hủy", style: "cancel" },
                {
                    text: "Chuyển",
                    onPress: () =>
                        Alert.alert("✅ Thành công", "Đã chuyển văn bản đến bộ phận xử lý."),
                },
            ],
        );
    };

    const handleReturn = () => {
        Alert.alert("Trả lại văn bản", "Vui lòng cho biết lý do trả lại:", [
            { text: "Hủy", style: "cancel" },
            {
                text: "Xác nhận trả lại",
                style: "destructive",
                onPress: () =>
                    Alert.alert("Đã trả lại", "Văn bản đã được trả lại cho người phát hành."),
            },
        ]);
    };

    // ─── Files ────────────────────────────────────────────────
    const handlePickFile = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: "*/*",
                multiple: true,
                copyToCacheDirectory: true,
            });
            if (result.canceled || !result.assets?.length) return;
            dispatch({ type: "SET_UPLOADING", value: true });
            const newFiles: AttachedFile[] = result.assets.map((asset) => {
                const fileId = `f_${Date.now()}_${Math.random().toString(36).slice(2)}`;
                try {
                    const uploadsDir = new Directory(Paths.document, "uploads");
                    if (!uploadsDir.exists) uploadsDir.create({ intermediates: true });
                    const srcFile = new File(asset.uri);
                    const destFile = new File(uploadsDir, `${fileId}_${asset.name}`);
                    srcFile.copy(destFile);
                    return {
                        id: fileId,
                        name: asset.name,
                        size: destFile.size,
                        mimeType: destFile.type || asset.mimeType,
                        uri: destFile.uri,
                        status: "uploaded" as const,
                    };
                } catch {
                    return {
                        id: fileId,
                        name: asset.name,
                        size: asset.size ?? 0,
                        mimeType: asset.mimeType,
                        uri: asset.uri,
                        status: "error" as const,
                    };
                }
            });
            dispatch({ type: "ADD_FILES", files: newFiles });
        } catch {
            Alert.alert("Lỗi", "Không thể chọn file. Vui lòng thử lại.");
        } finally {
            dispatch({ type: "SET_UPLOADING", value: false });
        }
    };

    const handleViewFile = async (file: AttachedFile) => {
        if (!file.uri) {
            Alert.alert("Thông báo", "File này chưa được tải về thiết bị.");
            return;
        }
        const canShare = await Sharing.isAvailableAsync();
        if (canShare) {
            await Sharing.shareAsync(file.uri, { mimeType: file.mimeType, dialogTitle: file.name });
        } else {
            Alert.alert("Không hỗ trợ", "Thiết bị không hỗ trợ xem file.");
        }
    };

    const handleDeleteFile = (fileId: string) => {
        Alert.alert("Xóa file", "Bạn có chắc muốn xóa file này?", [
            { text: "Hủy", style: "cancel" },
            {
                text: "Xóa",
                style: "destructive",
                onPress: () => {
                    const file = state.files.find((f) => f.id === fileId);
                    if (file?.uri?.startsWith(Paths.document.uri)) {
                        const f = new File(file.uri);
                        if (f.exists) f.delete();
                    }
                    dispatch({ type: "DELETE_FILE", id: fileId });
                },
            },
        ]);
    };

    return {
        state,
        dispatch,
        scrollViewRef,
        fieldViewRefs,
        commentSectionRef,
        display: state.isEditing && state.draft ? state.draft : state.docData,
        handleStartEdit,
        handleCancel,
        handleSave,
        updateDraft,
        handleForward,
        handleReturn,
        handlePickFile,
        handleViewFile,
        handleDeleteFile,
    };
}
