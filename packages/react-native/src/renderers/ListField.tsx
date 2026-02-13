import { View, Text, Pressable, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import type { FieldRendererProps } from "@ybyra/react";
import { useTheme } from "../theme/context";
import type { Theme } from "../theme/default";
import { ds } from "../support/ds";

export function ListField({ domain, name, value, config, proxy, errors, onChange }: FieldRendererProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = createStyles(theme);
  if (proxy.hidden) return null;

  const fieldLabel = t(`${domain}.fields.${name}`, { defaultValue: name });
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
    <View style={styles.container} {...ds(`ListField:${name}`)}>
      <Text style={styles.label}>{fieldLabel}</Text>
      <View style={[styles.list, errors.length > 0 && styles.listError]}>
        {items.map((item, index) => (
          <View key={index} style={styles.row}>
            <Text style={styles.rowIndex}>#{index + 1}</Text>
            <Text style={styles.rowPreview} numberOfLines={1}>
              {Object.values(item).filter(Boolean).join(", ") || "—"}
            </Text>
            <View style={styles.rowActions}>
              {reorderable && (
                <>
                  <Pressable onPress={() => moveUp(index)} disabled={proxy.disabled || index === 0}>
                    <Text style={styles.btnText}>↑</Text>
                  </Pressable>
                  <Pressable onPress={() => moveDown(index)} disabled={proxy.disabled || index >= items.length - 1}>
                    <Text style={styles.btnText}>↓</Text>
                  </Pressable>
                </>
              )}
              {!proxy.disabled && (
                <Pressable onPress={() => remove(index)}>
                  <Text style={[styles.btnText, styles.btnDestructive]}>×</Text>
                </Pressable>
              )}
            </View>
          </View>
        ))}
      </View>
      {!proxy.disabled && (
        <Pressable style={styles.addBtn} onPress={add}>
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
  list: {
    borderWidth: 1,
    borderColor: theme.colors.input,
    borderRadius: theme.borderRadius.md,
    overflow: "hidden",
  },
  listError: {
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
  rowIndex: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.mutedForeground,
    minWidth: 24,
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
