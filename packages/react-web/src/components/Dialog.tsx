import { createContext, useCallback, useContext, useRef, useState } from "react";
import { createPortal } from "react-dom";
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
      {dialog.visible && createPortal(
        <div style={styles.overlay} onClick={() => close(false)}>
          <div style={styles.card} onClick={(e) => e.stopPropagation()}>
            <div style={styles.title}>{title}</div>
            <div style={styles.message}>{t(dialog.message)}</div>
            <div style={styles.actions}>
              {dialog.type === "confirm" && (
                <button
                  type="button"
                  style={styles.cancelButton}
                  onClick={() => close(false)}
                >
                  {t("common.dialog.cancel")}
                </button>
              )}
              <button
                type="button"
                style={styles.okButton}
                onClick={() => close(true)}
              >
                {t("common.dialog.ok")}
              </button>
            </div>
          </div>
        </div>,
        document.body,
      )}
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

const createStyles = (theme: Theme) => ({
  overlay: {
    position: "fixed" as const,
    inset: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xxl,
    minWidth: 360,
    maxWidth: 480,
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
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
    lineHeight: 1.5,
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: theme.spacing.sm,
  },
  cancelButton: {
    padding: `${theme.spacing.sm}px ${theme.spacing.lg}px`,
    borderRadius: theme.borderRadius.md,
    minWidth: 80,
    textAlign: "center" as const,
    backgroundColor: theme.colors.secondary,
    color: theme.colors.secondaryForeground,
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    border: "none",
    cursor: "pointer",
  },
  okButton: {
    padding: `${theme.spacing.sm}px ${theme.spacing.lg}px`,
    borderRadius: theme.borderRadius.md,
    minWidth: 80,
    textAlign: "center" as const,
    backgroundColor: theme.colors.primary,
    color: theme.colors.primaryForeground,
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    border: "none",
    cursor: "pointer",
  },
});
