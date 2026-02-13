import { useTranslation } from "react-i18next";
import type { FieldRendererProps } from "@ybyra/react";
import { useTheme } from "../theme/context";
import type { Theme } from "../theme/default";
import { ds } from "../support/ds";

export function TextareaField({ domain, name, value, config, proxy, errors, onChange, onBlur, onFocus }: FieldRendererProps) {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const styles = createStyles(theme);
  if (proxy.hidden) return null;

  const fieldLabel = t(`${domain}.fields.${name}`, { defaultValue: name });
  const placeholderKey = `${domain}.fields.${name}.placeholder`;
  const placeholder = i18n.exists(placeholderKey) ? t(placeholderKey) : undefined;
  const hasError = errors.length > 0;
  const rows = proxy.height || config.form.height || 3;

  return (
    <div style={styles.container} {...ds(`TextareaField:${name}`)}>
      <label style={{ ...styles.label, ...(hasError ? styles.labelError : {}) }}>{fieldLabel}</label>
      <textarea
        style={{ ...styles.input, ...(proxy.disabled ? styles.inputDisabled : {}), ...(hasError ? styles.inputError : {}) }}
        value={String(value ?? "")}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        onFocus={onFocus}
        disabled={proxy.disabled}
        placeholder={placeholder}
      />
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
  input: {
    display: "block",
    width: "100%",
    boxSizing: "border-box" as const,
    border: `1px solid ${theme.colors.input}`,
    borderRadius: theme.borderRadius.md,
    padding: `10px ${theme.spacing.md}px`,
    fontSize: theme.fontSize.md,
    backgroundColor: theme.colors.card,
    color: theme.colors.cardForeground,
    fontFamily: "inherit",
    outline: "none",
    resize: "vertical" as const,
  },
  inputDisabled: {
    backgroundColor: theme.colors.muted,
    color: theme.colors.mutedForeground,
  },
  inputError: {
    borderColor: theme.colors.destructive,
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
