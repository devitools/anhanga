import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { FieldRendererProps } from "@ybyra/react";
import { useTheme } from "../theme/context";
import type { Theme } from "../theme/default";
import { ds } from "../support/ds";

export function ListField({ domain, name, value, config, proxy, errors, onChange }: FieldRendererProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = createStyles(theme);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  if (proxy.hidden) return null;

  const fieldLabel = t(`${domain}.fields.${name}`, { defaultValue: name });
  const hasError = errors.length > 0;
  const items = Array.isArray(value) ? (value as Record<string, unknown>[]) : [];
  const reorderable = config.attrs.reorderable === true;

  const remove = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const add = () => {
    onChange([...items, {}]);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const next = [...items];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    onChange(next);
  };

  const moveDown = (index: number) => {
    if (index >= items.length - 1) return;
    const next = [...items];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    onChange(next);
  };

  return (
    <div style={styles.container} {...ds(`ListField:${name}`)}>
      <label style={{ ...styles.label, ...(hasError ? styles.labelError : {}) }}>{fieldLabel}</label>
      <div style={styles.list}>
        {items.map((item, index) => (
          <div key={index} style={styles.row}>
            <span style={styles.rowIndex}>#{index + 1}</span>
            <span style={styles.rowPreview}>
              {Object.values(item).filter(Boolean).join(", ") || "—"}
            </span>
            <div style={styles.rowActions}>
              {reorderable && (
                <>
                  <button type="button" style={styles.btn} onClick={() => moveUp(index)} disabled={proxy.disabled || index === 0}>↑</button>
                  <button type="button" style={styles.btn} onClick={() => moveDown(index)} disabled={proxy.disabled || index >= items.length - 1}>↓</button>
                </>
              )}
              {!proxy.disabled && (
                <button type="button" style={{ ...styles.btn, ...styles.btnDestructive }} onClick={() => remove(index)}>×</button>
              )}
            </div>
          </div>
        ))}
      </div>
      {!proxy.disabled && (
        <button type="button" style={styles.addBtn} onClick={add}>+</button>
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
  list: {
    border: `1px solid ${theme.colors.input}`,
    borderRadius: theme.borderRadius.md,
    overflow: "hidden",
  },
  row: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing.xs,
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
    borderBottom: `1px solid ${theme.colors.input}`,
    backgroundColor: theme.colors.card,
  },
  rowIndex: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.mutedForeground,
    minWidth: 24,
  },
  rowPreview: {
    flex: 1,
    fontSize: theme.fontSize.sm,
    color: theme.colors.cardForeground,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap" as const,
  },
  rowActions: {
    display: "flex",
    gap: 4,
  },
  btn: {
    border: `1px solid ${theme.colors.input}`,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.card,
    color: theme.colors.cardForeground,
    cursor: "pointer",
    padding: "2px 6px",
    fontSize: theme.fontSize.xs,
  },
  btnDestructive: {
    color: theme.colors.destructive,
  },
  addBtn: {
    marginTop: theme.spacing.xs,
    border: `1px dashed ${theme.colors.input}`,
    borderRadius: theme.borderRadius.md,
    backgroundColor: "transparent",
    color: theme.colors.mutedForeground,
    cursor: "pointer",
    padding: `${theme.spacing.xs}px`,
    width: "100%",
    fontSize: theme.fontSize.md,
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
