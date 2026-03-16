import { Ionicons } from "@expo/vector-icons";

export const formatDateTime = (date: Date): string => {
    const p = (n: number) => String(n).padStart(2, "0");
    return `${p(date.getDate())}/${p(date.getMonth() + 1)}/${date.getFullYear()} ${p(date.getHours())}:${p(date.getMinutes())}`;
};

export const parseDateTime = (str: string): Date => {
    const [datePart = "", timePart = ""] = str.split(" ");
    const [dd = 1, mm = 1, yyyy = 2025] = datePart.split("/").map(Number);
    const [hh = 0, min = 0] = timePart.split(":").map(Number);
    return new Date(yyyy, mm - 1, dd, hh, min);
};

export const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const getFileIcon = (
    mimeType?: string,
): { name: keyof typeof Ionicons.glyphMap; color: string } => {
    if (!mimeType) return { name: "document-outline", color: "#6B7280" };
    if (mimeType.includes("pdf")) return { name: "document-text-outline", color: "#EF4444" };
    if (mimeType.includes("word") || mimeType.includes("msword")) return { name: "document-outline", color: "#2563EB" };
    if (mimeType.includes("image")) return { name: "image-outline", color: "#10B981" };
    if (mimeType.includes("spreadsheet") || mimeType.includes("excel")) return { name: "grid-outline", color: "#059669" };
    return { name: "attach-outline", color: "#6B7280" };
};
