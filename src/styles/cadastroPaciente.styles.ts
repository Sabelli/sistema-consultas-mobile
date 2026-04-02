import { Platform, StyleSheet } from "react-native";

// Definição de cores para manter a consistência
const COLORS = {
    primary: "#2563eb", // Azul moderno
    background: "#f8fafc",
    card: "#ffffff",
    textPrimary: "#1e293b",
    textSecondary: "#64748b",
    error: "#ef4444",
    border: "#e2e8f0",
    disabled: "#cbd5e1",
};

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: Platform.OS === "ios" ? 60 : 40,
        paddingBottom: 40,
    },
    header: {
        alignItems: "center",
        marginBottom: 40,
    },
    icone: {
        fontSize: 32,
        fontWeight: "bold",
        color: COLORS.primary,
        letterSpacing: 2,
        marginBottom: 12,
    },
    titulo: {
        fontSize: 28,
        fontWeight: "700",
        color: COLORS.textPrimary,
        marginBottom: 8,
    },
    subtitulo: {
        fontSize: 16,
        color: COLORS.textSecondary,
        textAlign: "center",
        lineHeight: 22,
    },
    form: {
        backgroundColor: COLORS.card,
        borderRadius: 16,
        padding: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 15,
        elevation: 3,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        color: COLORS.textPrimary,
        marginBottom: 8,
        marginLeft: 4,
    },
    input: {
        backgroundColor: "#f1f5f9",
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: Platform.OS === "ios" ? 14 : 10,
        fontSize: 16,
        color: COLORS.textPrimary,
    },
    inputDesabilitado: {
        backgroundColor: "#e2e8f0",
        color: COLORS.textSecondary,
    },
    botao: {
        backgroundColor: COLORS.primary,
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    botaoTexto: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "700",
    },
    botaoDesabilitado: {
        backgroundColor: COLORS.disabled,
        shadowOpacity: 0,
        elevation: 0,
    },
    erroContainer: {
        marginTop: 20,
        padding: 16,
        backgroundColor: "#fef2f2",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#fee2e2",
        alignItems: "center",
    },
    erroTexto: {
        color: COLORS.error,
        fontSize: 14,
        textAlign: "center",
        marginBottom: 10,
    },
    botaoCadastro: {
        paddingVertical: 4,
    },
    botaoCadastroTexto: {
        color: COLORS.primary,
        fontWeight: "700",
        fontSize: 14,
        textDecorationLine: "underline",
    },
    infoContainer: {
        marginTop: 24,
        paddingHorizontal: 10,
    },
    infoTexto: {
        fontSize: 13,
        color: COLORS.textSecondary,
        textAlign: "center",
        fontStyle: "italic",
    },
    botaoVoltar: {
        marginTop: 20,
        alignItems: "center",
        paddingVertical: 10,
    },
    botaoVoltarTexto: {
        color: COLORS.textSecondary,
        fontSize: 14,
        fontWeight: "500",
    },
});