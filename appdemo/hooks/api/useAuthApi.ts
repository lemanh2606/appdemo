import { useMutation, useQueryClient } from "@tanstack/react-query";
import authService, { LoginPayload, LoginResponse } from "../../services/authService";
import { useAuth } from "../../app/_layout";

/**
 * useAuthApi.ts
 * ─────────────────────────────────────────────────────────────
 * Custom hooks để tương tác với API Auth bằng TanStack Query.
 */

export function useLoginMutation() {
  const { signIn } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ UserName, Password }: Pick<LoginPayload, "UserName" | "Password">) => 
      authService.login(UserName, Password),
    
    onSuccess: async (data: LoginResponse) => {
      if (data.success && "token" in data) {
        // Cập nhập App Context (session state)
        await signIn({
          token: data.token,
          refreshToken: data.refreshToken,
          user: data.staff,
        });

        // Invalidate cache nếu cần thiết (ví dụ thông tin user profile)
        queryClient.invalidateQueries({ queryKey: ["user"] });
      }
    },
    
    onError: (error) => {
      // Logic xử lý lỗi tập trung hoặc để component xử lý
      console.error("Login mutation error:", error);
    }
  });
}

export function useLogoutMutation() {
  const { signOut } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: async () => {
      await signOut();
      // Xóa sạch cache sau khi logout
      queryClient.clear();
    }
  });
}
