import { StyleSheet } from "react-native";

export const modalStyles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)" },
    sheet: { backgroundColor: "#FFF", borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: "65%", paddingBottom: 16 },
    handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: "#E5E7EB", alignSelf: "center", marginTop: 10, marginBottom: 4 },
    sheetHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
    sheetTitle: { fontSize: 16, fontWeight: "bold", color: "#111827" },
    option: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: "#F9FAFB" },
    optionSelected: { backgroundColor: "#EFF6FF" },
    optionText: { fontSize: 14, color: "#374151", flex: 1, marginRight: 8 },
    optionTextSelected: { color: "#2563EB", fontWeight: "600" },
    iosButtonRow: { flexDirection: "row", gap: 12, marginTop: 12 },
    iosCancelBtn: { flex: 1, paddingVertical: 13, borderRadius: 10, backgroundColor: "#F3F4F6", alignItems: "center" },
    iosCancelText: { fontSize: 15, fontWeight: "600", color: "#374151" },
    iosConfirmBtn: { flex: 2, paddingVertical: 13, borderRadius: 10, backgroundColor: "#2563EB", alignItems: "center" },
    iosConfirmText: { fontSize: 15, fontWeight: "600", color: "#FFFFFF" },
});
