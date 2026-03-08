import { useTranslation } from "react-i18next";
import type { FieldRendererProps } from "@ybyra/react";
import { useTheme } from "../theme/context";
import type { Theme } from "../theme/default";
import { ds } from "../support/ds";
import { resolveFieldLabel, resolveFieldOption, resolveFieldPlaceholder } from "../support/i18n";
import { getComponent } from "../components/registry";

export function SelectField({ domain, name, value, config, proxy, errors, onChange, onBlur, onFocus }: FieldRendererProps) {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const styles = createStyles(theme);
  if (proxy.hidden) return null;

  const fieldLabel = resolveFieldLabel(i18n, t, domain, name);
  const placeholder = resolveFieldPlaceholder(i18n, t, domain, name);
  const hasError = errors.length > 0;
  const rawOptions = (config.attrs.options ?? []) as (string | number)[];
  const options = rawOptions.map((opt) => ({
    value: String(opt),
    label: resolveFieldOption(i18n, t, domain, name, String(opt)),
  }));

  const CustomSelect = getComponent('SelectInput');

  return (
    <div style={styles.container} {...ds(`SelectField:${name}`)}>
      <label style={{ ...styles.label, ...(hasError ? styles.labelError : {}) }}>{fieldLabel}</label>
      {CustomSelect ? (
        <CustomSelect
          value={String(value ?? "")}
          options={options}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          disabled={proxy.disabled}
          placeholder={placeholder}
          hasError={hasError}
        />
      ) : (
        <select
          style={{ ...styles.input, ...(proxy.disabled ? styles.inputDisabled : {}), ...(hasError ? styles.inputError : {}) }}
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          onFocus={onFocus}
          disabled={proxy.disabled}
        >
          <option value="">{placeholder ?? ""}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
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
    appearance: "auto" as const,
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
