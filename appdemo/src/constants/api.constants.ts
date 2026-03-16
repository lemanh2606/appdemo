// src/constants/api.constants.ts

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "https://api.example.com";
export const API_TIMEOUT = 15_000; // ms

export const API_ENDPOINTS = {
    // Auth
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",

    // Documents
    DOCUMENTS: "/documents",
    DOCUMENT_DETAIL: (id: string) => `/documents/${id}`,
    DOCUMENT_FORWARD: (id: string) => `/documents/${id}/forward`,
    DOCUMENT_RETURN: (id: string) => `/documents/${id}/return`,
    DOCUMENT_FILES: (id: string) => `/documents/${id}/files`,

    // Users
    USERS: "/users",
    ME: "/users/me",
} as const;
