import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { FieldRendererProps } from "@ybyra/react";
import { useTheme } from "../theme/context";
import type { Theme } from "../theme/default";
import { ds } from "../support/ds";

interface TreeNode extends Record<string, unknown> {
  [key: string]: unknown;
}

export function TreeField({ domain, name, value, config, proxy, errors, onChange }: FieldRendererProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = createStyles(theme);
  if (proxy.hidden) return null;

  const fieldLabel = t(`${domain}.fields.${name}`, { defaultValue: name });
  const hasError = errors.length > 0;
  const items = Array.isArray(value) ? (value as TreeNode[]) : [];
  const childrenKey = (config.attrs.childrenKey as string) ?? "children";
  const maxDepth = (config.attrs.maxDepth as number) ?? Infinity;

  const removeAt = (list: TreeNode[], path: number[]): TreeNode[] => {
    if (path.length === 1) return list.filter((_, i) => i !== path[0]);
    return list.map((item, i) => {
      if (i !== path[0]) return item;
      const children = (item[childrenKey] as TreeNode[]) ?? [];
      return { ...item, [childrenKey]: removeAt(children, path.slice(1)) };
    });
  };

  const addAt = (list: TreeNode[], path: number[]): TreeNode[] => {
    if (path.length === 0) return [...list, {}];
    return list.map((item, i) => {
      if (i !== path[0]) return item;
      const children = (item[childrenKey] as TreeNode[]) ?? [];
      return { ...item, [childrenKey]: addAt(children, path.slice(1)) };
    });
  };

  const renderNode = (node: TreeNode, path: number[], depth: number) => {
    const children = (node[childrenKey] as TreeNode[]) ?? [];
    const preview = Object.entries(node)
      .filter(([k]) => k !== childrenKey)
      .map(([, v]) => v)
      .filter(Boolean)
      .join(", ") || "—";

    return (
      <div key={path.join("-")} style={{ ...styles.node, paddingLeft: depth * 20 }}>
        <div style={styles.row}>
          <span style={styles.rowPreview}>{preview}</span>
          <div style={styles.rowActions}>
            {depth < maxDepth && !proxy.disabled && (
              <button type="button" style={styles.btn} onClick={() => onChange(addAt(items, path))}>+ child</button>
            )}
            {!proxy.disabled && (
              <button type="button" style={{ ...styles.btn, ...styles.btnDestructive }} onClick={() => onChange(removeAt(items, path))}>×</button>
            )}
          </div>
        </div>
        {children.map((child, ci) => renderNode(child, [...path, ci], depth + 1))}
      </div>
    );
  };

  return (
    <div style={styles.container} {...ds(`TreeField:${name}`)}>
      <label style={{ ...styles.label, ...(hasError ? styles.labelError : {}) }}>{fieldLabel}</label>
      <div style={styles.tree}>
        {items.map((item, i) => renderNode(item, [i], 0))}
      </div>
      {!proxy.disabled && (
        <button type="button" style={styles.addBtn} onClick={() => onChange([...items, {}])}>+</button>
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
  tree: {
    border: `1px solid ${theme.colors.input}`,
    borderRadius: theme.borderRadius.md,
    overflow: "hidden",
  },
  node: {
    borderBottom: `1px solid ${theme.colors.input}`,
  },
  row: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing.xs,
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
    backgroundColor: theme.colors.card,
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
