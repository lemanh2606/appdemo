// app/(tabs)/documents/constants.ts

import { DocData, AttachedFile, Recipient, RelatedDoc } from "./types";

// ─── Seed data ────────────────────────────────────────────────

export const INITIAL_DOC: DocData = {
    type: "Văn bản đi - Đơn vị phát hành",
    category: "Thông báo",
    arrivalDate: "01/01/2025 18:10",
    urgency: "Thường",
    department: "Trung tâm Đấu thầu qua mạng quốc gia - Phòng Hành chính tổng hợp",
    creator: "Trần Thị Mai",
    signer: "Trần Hào Hùng",
    signerRole: "Cục trưởng",
    processingDeadline: "15/01/2025 17:00",
    operationType: "Mới",
    language: "Tiếng Việt",
    pageCount: "3",
    note: "Nội dung ghi chú test",
};

export const INITIAL_FILES: AttachedFile[] = [
    { id: "f1", name: "Văn bản ký số.pdf", size: 1638400, mimeType: "application/pdf", uri: "", status: "uploaded" },
    { id: "f2", name: "Phụ lục đính kèm.docx", size: 245760, mimeType: "application/msword", uri: "", status: "uploaded" },
];

export const INITIAL_INTERNAL_RECIPIENTS: Recipient[] = [
    { code: "D01", name: "Phòng Hành chính tổng hợp", type: "internal" },
    { code: "NM003", name: "Phòng Kế hoạch - Tài chính", type: "internal" },
    { code: "GD001", name: "Ban Giám đốc", type: "internal" },
    { code: "IT002", name: "Phòng Công nghệ thông tin", type: "internal" },
    { code: "HR005", name: "Phòng Tổ chức cán bộ", type: "internal" },
];

export const INITIAL_EXTERNAL_RECIPIENTS: Recipient[] = [
    { code: "V001", name: "Bộ Kế hoạch và Đầu tư", type: "external" },
    { code: "V005", name: "Văn phòng Chính phủ", type: "external" },
    { code: "GD001", name: "Bộ Tài chính", type: "external" },
];

export const INITIAL_RELATED_DOCS: RelatedDoc[] = [
    {
        id: "r1",
        docId: "001/2026/TT-BCA",
        title: "Góp ý dự thảo Quy chế quản lý, vận hành khai thác mạng viễn thông...",
        sender: "Cục quản lý đầu thầu",
        isUrgent: false,
    },
];

export const INITIAL_ORIGINAL_DOCS: RelatedDoc[] = [];

// ─── All recipients (cho modal chọn) ─────────────────────────

export const ALL_RECIPIENTS: Recipient[] = [
    { code: "D01", name: "Phòng Hành chính tổng hợp", type: "internal" },
    { code: "NM003", name: "Phòng Kế hoạch - Tài chính", type: "internal" },
    { code: "GD001", name: "Ban Giám đốc", type: "internal" },
    { code: "IT002", name: "Phòng Công nghệ thông tin", type: "internal" },
    { code: "HR005", name: "Phòng Tổ chức cán bộ", type: "internal" },
    { code: "LG003", name: "Phòng Pháp chế", type: "internal" },
    { code: "AU001", name: "Phòng Kiểm toán nội bộ", type: "internal" },
    { code: "V001", name: "Bộ Kế hoạch và Đầu tư", type: "external" },
    { code: "V005", name: "Văn phòng Chính phủ", type: "external" },
    { code: "V006", name: "Bộ Tài chính", type: "external" },
    { code: "V007", name: "Bộ Công an", type: "external" },
    { code: "V008", name: "Bộ Tư pháp", type: "external" },
];

// ─── Sample docs để add vào văn bản liên quan ────────────────

export const SAMPLE_RELATED_DOCS: RelatedDoc[] = [
    { id: "s1", docId: "002/2026/CV-BTC", title: "Công văn về phương án tài chính năm 2026", sender: "Bộ Tài chính", isUrgent: true },
    { id: "s2", docId: "003/2026/TB-CP", title: "Thông báo kết luận họp về đấu thầu điện tử", sender: "Văn phòng Chính phủ", isUrgent: false },
    { id: "s3", docId: "015/2025/QD-BKH", title: "Quyết định ban hành quy chế hoạt động", sender: "Bộ Kế hoạch và Đầu tư", isUrgent: false },
    { id: "s4", docId: "008/2026/TT-BCA", title: "Thông tư hướng dẫn thực hiện nghị định 45", sender: "Bộ Công an", isUrgent: true },
];

// ─── Select options ───────────────────────────────────────────

export const SELECT_OPTIONS: Record<string, string[]> = {
    type: ["Văn bản đi - Đơn vị phát hành", "Văn bản đến", "Văn bản nội bộ", "Văn bản trình ký", "Văn bản mật"],
    category: ["Thông báo", "Quyết định", "Công văn", "Nghị quyết", "Chỉ thị", "Tờ trình", "Biên bản", "Hợp đồng", "Báo cáo", "Kế hoạch"],
    urgency: ["Thường", "Khẩn", "Hỏa tốc", "Thượng khẩn"],
    department: [
        "Phòng Hành chính tổng hợp",
        "Phòng Kế hoạch - Tài chính",
        "Phòng Công nghệ thông tin",
        "Phòng Pháp chế",
        "Phòng Tổ chức cán bộ",
        "Trung tâm Đấu thầu qua mạng quốc gia - Phòng Hành chính tổng hợp",
        "Ban Giám đốc",
    ],
    signer: ["Trần Hào Hùng", "Nguyễn Văn An", "Lê Thị Bích", "Phạm Minh Tuấn", "Hoàng Thị Lan"],
    signerRole: ["Cục trưởng", "Phó Cục trưởng", "Trưởng phòng", "Phó Trưởng phòng", "Giám đốc", "Phó Giám đốc"],
    operationType: ["Mới", "Sửa đổi", "Bổ sung", "Thay thế", "Hủy bỏ", "Gia hạn"],
    language: ["Tiếng Việt", "Tiếng Anh", "Song ngữ Việt - Anh", "Tiếng Pháp", "Tiếng Trung"],
};

// ─── Field metadata ───────────────────────────────────────────

export const FIELD_LABELS: Record<keyof DocData, string> = {
    type: "Loại dự thảo",
    category: "Loại văn bản",
    arrivalDate: "Ngày đến",
    urgency: "Độ khẩn",
    department: "Phòng ban soạn thảo",
    creator: "Người soạn thảo",
    signer: "Người ký",
    signerRole: "Chức vụ người ký",
    processingDeadline: "Hạn xử lý",
    operationType: "Loại nghiệp vụ",
    language: "Ngôn ngữ",
    pageCount: "Số trang",
    note: "Ghi chú",
};

export const REQUIRED_FIELDS: (keyof DocData)[] = [
    "type", "arrivalDate", "urgency", "department", "creator",
    "signer", "signerRole", "processingDeadline", "operationType",
    "language", "pageCount", "note",
];

export const FIELD_ORDER: (keyof DocData)[] = [
    "type", "category", "arrivalDate", "urgency", "department",
    "creator", "signer", "signerRole", "processingDeadline",
    "operationType", "language", "pageCount", "note",
];
