// src/constants/app.constants.ts

export const APP_NAME = "VBOffice";
export const APP_VERSION = "1.0.0";

export const COLORS = {
    primary: "#2563EB",
    danger: "#EF4444",
    success: "#10B981",
    warning: "#F59E0B",
    gray: "#6B7280",
    lightGray: "#E5E7EB",
    bgLight: "#F3F4F6",
    white: "#FFFFFF",
    dark: "#111827",
} as const;

export const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
} as const;

export const DATE_FORMAT = {
    DISPLAY: "DD/MM/YYYY HH:mm",
    API: "YYYY-MM-DDTHH:mm:ssZ",
} as const;
