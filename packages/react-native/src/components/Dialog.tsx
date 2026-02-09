import { createContext, useCallback, useContext, useRef, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import type { DialogContract } from "@anhanga/core";
import { useTheme } from "../theme/context";
import type { Theme } from "../theme/default";

type DialogType = "confirm" | "alert";

interface DialogState {
  visible: boolean;
  type: DialogType;
  message: string;
}

const DialogContext = createContext<DialogContract | null>(null);

export function DialogProvider({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const resolveRef = useRef<((value: boolean) => void) | null>(null);
  const [dialog, setDialog] = useState<DialogState>({
    visible: false,
    type: "confirm",
    message: "",
  });

  const close = useCallback((result: boolean) => {
    setDialog((prev) => ({ ...prev, visible: false }));
    resolveRef.current?.(result);
    resolveRef.current = null;
  }, []);

  const show = useCallback((type: DialogType, message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      resolveRef.current = resolve;
      setDialog({ visible: true, type, message });
    });
  }, []);

  const contract: DialogContract = {
    confirm: (message: string) => show("confirm", message),
    async alert(message: string) {
      await show("alert", message);
    },
  };

  const title = dialog.type === "confirm"
    ? t("common.dialog.confirm")
    : t("common.dialog.alert");

  const styles = createStyles(theme);

  return (
    <DialogContext.Provider value={contract}>
      {children}
      <Modal
        transparent
        visible={dialog.visible}
        animationType="fade"
        onRequestClose={() => close(false)}
      >
        <Pressable style={styles.overlay} onPress={() => close(false)}>
          <Pressable style={styles.card} onPress={() => {}}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{t(dialog.message)}</Text>
            <View style={styles.actions}>
              {dialog.type === "confirm" && (
                <Pressable
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => close(false)}
                >
                  <Text style={styles.cancelText}>
                    {t("common.dialog.cancel")}
                  </Text>
                </Pressable>
              )}
              <Pressable
                style={[styles.button, styles.okButton]}
                onPress={() => close(true)}
              >
                <Text style={styles.okText}>
                  {t("common.dialog.ok")}
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </DialogContext.Provider>
  );
}

export function useDialog(): DialogContract {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("useDialog must be used within a DialogProvider");
  }
  return context;
}

const createStyles = (theme: Theme) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xxl,
    minWidth: 360,
    maxWidth: 480,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.foreground,
    marginBottom: theme.spacing.sm,
  },
  message: {
    fontSize: theme.fontSize.md,
    color: theme.colors.mutedForeground,
    marginBottom: theme.spacing.xl,
    lineHeight: 22,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: theme.spacing.sm,
  },
  button: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    minWidth: 80,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: theme.colors.secondary,
  },
  cancelText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.secondaryForeground,
  },
  okButton: {
    backgroundColor: theme.colors.primary,
  },
  okText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.primaryForeground,
  },
});
