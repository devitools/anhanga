import { useTranslation } from "react-i18next";
import type { FieldRendererProps } from "@ybyra/react";
import { useTheme } from "../theme/context";
import type { Theme } from "../theme/default";
import { ds } from "../support/ds";

export function CurrencyField({ domain, name, value, config, proxy, errors, onChange, onBlur, onFocus }: FieldRendererProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = createStyles(theme);
  if (proxy.hidden) return null;

  const fieldLabel = t(`${domain}.fields.${name}`, { defaultValue: name });
  const hasError = errors.length > 0;
  const prefix = (config.attrs.prefix as string) ?? "";
  const precision = (config.attrs.precision as number) ?? 2;
  const step = precision > 0 ? (1 / Math.pow(10, precision)).toString() : "1";

  return (
    <div style={styles.container} {...ds(`CurrencyField:${name}`)}>
      <label style={{ ...styles.label, ...(hasError ? styles.labelError : {}) }}>{fieldLabel}</label>
      <div style={styles.inputWrapper}>
        {prefix && <span style={styles.prefix}>{prefix}</span>}
        <input
          type="number"
          step={step}
          style={{
            ...styles.input,
            ...(prefix ? styles.inputWithPrefix : {}),
            ...(proxy.disabled ? styles.inputDisabled : {}),
            ...(hasError ? styles.inputError : {}),
          }}
          value={value !== undefined && value !== null ? String(value) : ""}
          onChange={(e) => {
            const num = Number(e.target.value);
            onChange(isNaN(num) ? e.target.value : num);
          }}
          onBlur={onBlur}
          onFocus={onFocus}
          disabled={proxy.disabled}
        />
      </div>
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
    position: "relative" as const,
    display: "flex",
    alignItems: "center",
  },
  prefix: {
    position: "absolute" as const,
    left: theme.spacing.md,
    fontSize: theme.fontSize.md,
    color: theme.colors.mutedForeground,
    pointerEvents: "none" as const,
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
  },
  inputWithPrefix: {
    paddingLeft: 36,
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
