import { View, Text, Pressable, StyleSheet } from "react-native";
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
      <View key={path.join("-")} style={{ marginLeft: depth * 20 }}>
        <View style={styles.row}>
          <Text style={styles.rowPreview} numberOfLines={1}>{preview}</Text>
          <View style={styles.rowActions}>
            {depth < maxDepth && !proxy.disabled && (
              <Pressable onPress={() => onChange(addAt(items, path))}>
                <Text style={styles.btnText}>+</Text>
              </Pressable>
            )}
            {!proxy.disabled && (
              <Pressable onPress={() => onChange(removeAt(items, path))}>
                <Text style={[styles.btnText, styles.btnDestructive]}>×</Text>
              </Pressable>
            )}
          </View>
        </View>
        {children.map((child, ci) => renderNode(child, [...path, ci], depth + 1))}
      </View>
    );
  };

  return (
    <View style={styles.container} {...ds(`TreeField:${name}`)}>
      <Text style={styles.label}>{fieldLabel}</Text>
      <View style={[styles.tree, errors.length > 0 && styles.treeError]}>
        {items.map((item, i) => renderNode(item, [i], 0))}
      </View>
      {!proxy.disabled && (
        <Pressable style={styles.addBtn} onPress={() => onChange([...items, {}])}>
          <Text style={styles.addBtnText}>+</Text>
        </Pressable>
      )}
      <View style={styles.errorSlot}>
        {errors.map((error, i) => (
          <Text key={i} style={styles.error}>{error}</Text>
        ))}
      </View>
    </View>
  );
}

const createStyles = (theme: Theme) => StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.xs,
  },
  label: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    marginBottom: theme.spacing.xs,
    color: theme.colors.foreground,
  },
  tree: {
    borderWidth: 1,
    borderColor: theme.colors.input,
    borderRadius: theme.borderRadius.md,
    overflow: "hidden",
  },
  treeError: {
    borderColor: theme.colors.destructive,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.input,
    backgroundColor: theme.colors.card,
  },
  rowPreview: {
    flex: 1,
    fontSize: theme.fontSize.sm,
    color: theme.colors.cardForeground,
  },
  rowActions: {
    flexDirection: "row",
    gap: 8,
  },
  btnText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.cardForeground,
    paddingHorizontal: 4,
  },
  btnDestructive: {
    color: theme.colors.destructive,
  },
  addBtn: {
    marginTop: theme.spacing.xs,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: theme.colors.input,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.xs,
    alignItems: "center",
  },
  addBtnText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.mutedForeground,
  },
  errorSlot: {
    minHeight: 20,
    marginTop: 2,
  },
  error: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.destructive,
  },
});
