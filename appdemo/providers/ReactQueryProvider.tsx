import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { ReactNode } from "react";

/**
 * ReactQueryProvider.tsx
 * ─────────────────────────────────────────────────────────────
 * Cấu hình TanStack Query (React Query) cho toàn bộ ứng dụng.
 * Thiết lập các giá trị mặc định cho việc caching và retry.
 */

// Tạo instance QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Số lần thử lại khi request lỗi (mặc định là 3)
      retry: 1,
      // Thời gian data được coi là "fresh" (5 phút)
      staleTime: 1000 * 60 * 5,
      // Giữ data trong cache dù đã stale (10 phút)
      gcTime: 1000 * 60 * 10,
      // Tự động fetch lại khi refocus app? (thường tắt trên Mobile nếu không cần)
      refetchOnWindowFocus: false,
    },
  },
});

interface Props {
  children: ReactNode;
}

export function ReactQueryProvider({ children }: Props) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
