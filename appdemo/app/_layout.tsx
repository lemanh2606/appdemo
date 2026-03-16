/**
 * app/_layout.tsx — Root Layout (Expo Router v5 / SDK 53+)
 * ─────────────────────────────────────────────────────────────
 * Dùng Stack.Protected thay cho AuthGuard + useEffect + useSegments
 * - Không cần redirect thủ công
 * - Không bị bug useSegments SDK 53
 * - Expo tự xử lý cả 2 chiều: login→tabs và logout→login
 * ─────────────────────────────────────────────────────────────
 */

import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Provider } from "react-redux";
import store from "../redux/store";

import sessionService, { SessionData } from "../services/sessionService";

SplashScreen.preventAutoHideAsync();

// ─── Auth Context ─────────────────────────────────────────────

interface AuthContextValue {
  session: SessionData | null;
  isLoading: boolean;
  signIn: (data: SessionData) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  session: null,
  isLoading: true,
  signIn: async () => {},
  signOut: async () => {},
});

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}

// ─── Root Layout ──────────────────────────────────────────────

export default function RootLayout() {
  const [session, setSession] = useState<SessionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const saved = await sessionService.get();
        setSession(saved);
      } catch {
        setSession(null);
      } finally {
        setIsLoading(false);
        await SplashScreen.hideAsync();
      }
    })();
  }, []);

  const signIn = async (data: SessionData) => {
    await sessionService.save(data);
    setSession(data);
  };

  const signOut = async () => {
    await sessionService.clear();
    setSession(null);
  };

  // Chờ load xong mới render Stack để Stack.Protected
  // nhận đúng giá trị session ngay từ đầu — tránh flash
  if (isLoading) return null;

  return (
    <Provider store={store}>
      <AuthContext.Provider value={{ session, isLoading, signIn, signOut }}>
        {/* ✅ Stack.Protected thay hoàn toàn AuthGuard + useEffect */}
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#FFFFFF" },
          }}
        >
          {/* Chỉ hiện khi CHƯA đăng nhập */}
          <Stack.Protected guard={!session}>
            <Stack.Screen name="index" /> {/* màn hình login */}
          </Stack.Protected>

          {/* Chỉ hiện khi ĐÃ đăng nhập */}
          <Stack.Protected guard={!!session}>
            <Stack.Screen name="(tabs)" />
          </Stack.Protected>
        </Stack>
        <StatusBar style="light" />
      </AuthContext.Provider>
    </Provider>
  );
}
