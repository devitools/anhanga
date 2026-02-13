import { useTranslation } from "react-i18next";
import type { FieldRendererProps } from "@ybyra/react";
import { useTheme } from "../theme/context";
import type { Theme } from "../theme/default";
import { ds } from "../support/ds";

export function MultiSelectField({ domain, name, value, config, proxy, errors, onChange, onBlur, onFocus }: FieldRendererProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = createStyles(theme);
  if (proxy.hidden) return null;

  const fieldLabel = t(`${domain}.fields.${name}`, { defaultValue: name });
  const hasError = errors.length > 0;
  const options = (config.attrs.options ?? []) as (string | number)[];
  const selected = Array.isArray(value) ? (value as string[]) : [];

  const toggle = (optValue: string) => {
    const next = selected.includes(optValue)
      ? selected.filter((v) => v !== optValue)
      : [...selected, optValue];
    onChange(next);
  };

  return (
    <div style={styles.container} {...ds(`MultiSelectField:${name}`)}>
      <label style={{ ...styles.label, ...(hasError ? styles.labelError : {}) }}>{fieldLabel}</label>
      <div
        style={{ ...styles.input, ...(proxy.disabled ? styles.inputDisabled : {}), ...(hasError ? styles.inputError : {}) }}
        onBlur={onBlur}
        onFocus={onFocus}
      >
        {selected.length > 0 && (
          <div style={styles.chips}>
            {selected.map((v) => (
              <span key={v} style={styles.chip}>
                {t(`${domain}.fields.${name}.${v}`, { defaultValue: v })}
                {!proxy.disabled && (
                  <button type="button" style={styles.chipRemove} onClick={() => toggle(v)}>×</button>
                )}
              </span>
            ))}
          </div>
        )}
        <div style={styles.optionList}>
          {options.map((opt) => (
            <label key={String(opt)} style={styles.option}>
              <input
                type="checkbox"
                checked={selected.includes(String(opt))}
                onChange={() => toggle(String(opt))}
                disabled={proxy.disabled}
              />
              {t(`${domain}.fields.${name}.${opt}`, { defaultValue: String(opt) })}
            </label>
          ))}
        </div>
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
  input: {
    border: `1px solid ${theme.colors.input}`,
    borderRadius: theme.borderRadius.md,
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
    backgroundColor: theme.colors.card,
    color: theme.colors.cardForeground,
  },
  inputDisabled: {
    backgroundColor: theme.colors.muted,
    color: theme.colors.mutedForeground,
  },
  inputError: {
    borderColor: theme.colors.destructive,
  },
  chips: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: 4,
    marginBottom: theme.spacing.xs,
  },
  chip: {
    display: "inline-flex",
    alignItems: "center",
    gap: 2,
    padding: `2px ${theme.spacing.xs}px`,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.muted,
    fontSize: theme.fontSize.xs,
  },
  chipRemove: {
    border: "none",
    background: "none",
    cursor: "pointer",
    padding: 0,
    fontSize: theme.fontSize.sm,
    color: theme.colors.mutedForeground,
  },
  optionList: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 4,
  },
  option: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: theme.fontSize.sm,
    cursor: "pointer",
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
