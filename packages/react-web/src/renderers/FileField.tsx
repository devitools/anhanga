import { useRef, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { FieldRendererProps } from "@ybyra/react";
import { useTheme } from "../theme/context";
import type { Theme } from "../theme/default";
import { ds } from "../support/ds";

export function FileField({ domain, name, value, config, proxy, errors, onChange }: FieldRendererProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = createStyles(theme);
  const inputRef = useRef<HTMLInputElement>(null);
  if (proxy.hidden) return null;

  const fieldLabel = t(`${domain}.fields.${name}`, { defaultValue: name });
  const hasError = errors.length > 0;
  const accept = (config.attrs.accept as string) ?? undefined;
  const isImage = config.component === "image";
  const fileName = value instanceof File ? value.name : (value ? String(value) : "");

  const previewUrl = useMemo(() => {
    if (value instanceof File && isImage) return URL.createObjectURL(value);
    return null;
  }, [value, isImage]);

  useEffect(() => {
    return () => { if (previewUrl) URL.revokeObjectURL(previewUrl); };
  }, [previewUrl]);

  return (
    <div style={styles.container} {...ds(`FileField:${name}`)}>
      <label style={{ ...styles.label, ...(hasError ? styles.labelError : {}) }}>{fieldLabel}</label>
      <div style={styles.inputWrapper}>
        <button
          type="button"
          style={{ ...styles.chooseBtn, ...(proxy.disabled ? styles.chooseBtnDisabled : {}) }}
          onClick={() => inputRef.current?.click()}
          disabled={proxy.disabled}
        >
          {t("common.file.choose", { defaultValue: isImage ? "Choose image…" : "Choose file…" })}
        </button>
        <span style={styles.fileName}>{fileName || t("common.file.none", { defaultValue: "No file selected" })}</span>
        <input
          ref={inputRef}
          type="file"
          accept={accept ?? (isImage ? "image/*" : undefined)}
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            onChange(file ?? null);
          }}
          disabled={proxy.disabled}
        />
      </div>
      {previewUrl && (
        <img
          src={previewUrl}
          alt={fileName}
          style={styles.preview}
        />
      )}
      <div style={styles.errorSlot}>
        {errors.map((error, i) => (
          <p key={i} style={styles.error}>{error}</p>
        ))}
      </div>
    </div>
  );
}

const createStyles = (theme: Theme) => ({
  container: {
    padding: `0 ${theme.spacing.xs}px`,
  },
  label: {
    display: "block",
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    marginBottom: theme.spacing.xs,
    color: theme.colors.foreground,
  },
  labelError: {
    color: theme.colors.destructive,
  },
  inputWrapper: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  chooseBtn: {
    border: `1px solid ${theme.colors.input}`,
    borderRadius: theme.borderRadius.md,
    padding: `8px ${theme.spacing.md}px`,
    fontSize: theme.fontSize.sm,
    backgroundColor: theme.colors.secondary,
    color: theme.colors.secondaryForeground,
    cursor: "pointer",
    whiteSpace: "nowrap" as const,
  },
  chooseBtnDisabled: {
    backgroundColor: theme.colors.muted,
    color: theme.colors.mutedForeground,
    cursor: "default",
  },
  fileName: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.mutedForeground,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap" as const,
  },
  preview: {
    marginTop: theme.spacing.sm,
    maxWidth: 200,
    maxHeight: 150,
    borderRadius: theme.borderRadius.md,
    objectFit: "cover" as const,
  },
  errorSlot: {
    minHeight: 20,
    marginTop: 2,
  },
  error: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.destructive,
    margin: 0,
  },
});
