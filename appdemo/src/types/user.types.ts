// src/types/user.types.ts

export interface User {
    id: string;
    fullName: string;
    email: string;
    role: "admin" | "manager" | "staff";
    department: string;
    avatarUrl?: string;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
}
