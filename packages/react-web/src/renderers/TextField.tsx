import { useTranslation } from "react-i18next";
import type { FieldRendererProps } from "@ybyra/react";
import { useTheme } from "../theme/context";
import type { Theme } from "../theme/default";
import { ds } from "../support/ds";
import { getComponent } from "../components/registry";
import { resolveFieldLabel, resolveFieldPlaceholder, resolveFieldDescription } from "../support/i18n";

export function TextField({ domain, name, value, config, proxy, errors, onChange, onBlur, onFocus }: FieldRendererProps) {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const styles = createStyles(theme);
  if (proxy.hidden) return null;

  const fieldLabel = resolveFieldLabel(i18n, t, domain, name);
  const placeholder = resolveFieldPlaceholder(i18n, t, domain, name);
  const description = resolveFieldDescription(i18n, t, domain, name);
  const hasError = errors.length > 0;
  const inputType = config.kind === "password" ? "password" : "text";
  const CustomInput = getComponent('TextInput');

  return (
    <div style={styles.container} {...ds(`TextField:${name}`)}>
      <label style={{ ...styles.label, ...(hasError ? styles.labelError : {}) }}>{fieldLabel}</label>
      {CustomInput ? (
        <CustomInput
          type={inputType}
          value={String(value ?? "")}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          disabled={proxy.disabled}
          placeholder={placeholder}
          hasError={hasError}
        />
      ) : (
        <input
          type={inputType}
          style={{ ...styles.input, ...(proxy.disabled ? styles.inputDisabled : {}), ...(hasError ? styles.inputError : {}) }}
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          onFocus={onFocus}
          disabled={proxy.disabled}
          placeholder={placeholder}
        />
      )}
      {description && <p style={styles.description}>{description}</p>}
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
  description: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.mutedForeground,
    marginTop: theme.spacing.xs,
    margin: 0,
  },
  error: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.destructive,
    margin: 0,
  },
});
