// src/types/navigation.types.ts

export type RootStackParamList = {
    "(tabs)": undefined;
    "documents/[id]": { id: string };
    "documents/history": undefined;
    "+not-found": undefined;
};

// Dùng cho expo-router typed routes
declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList { }
    }
}
