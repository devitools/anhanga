import { useState, useMemo } from "react";
import { View, Text, Pressable, Modal, ScrollView, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import type { FieldRendererProps } from "@ybyra/react";
import { getRenderer, useDataForm } from "@ybyra/react";
import type { SchemaProvide, Scope } from "@ybyra/core";
import { useTheme } from "../theme/context";
import type { Theme } from "../theme/default";
import { ds } from "../support/ds";

function ItemFormModal({
  itemSchema,
  scope,
  initialValues,
  onSave,
  onCancel,
  theme,
}: {
  itemSchema: SchemaProvide;
  scope: string;
  initialValues?: Record<string, unknown>;
  onSave: (values: Record<string, unknown>) => void;
  onCancel: () => void;
  theme: Theme;
}) {
  const { t } = useTranslation();
  const modalStyles = createModalStyles(theme);

  const noopComponent = useMemo(() => ({
    scope: scope as typeof Scope[keyof typeof Scope],
    scopes: {} as Record<string, { path: string }>,
    reload: () => {},
    navigator: { push: () => {}, back: () => {}, replace: () => {} },
    dialog: { confirm: async () => true, alert: async () => {} },
    toast: { success: () => {}, error: () => {}, warning: () => {}, info: () => {} },
    loading: { show: () => {}, hide: () => {} },
  }), [scope]);

  const form = useDataForm({
    schema: itemSchema,
    scope: scope as typeof Scope[keyof typeof Scope],
    component: noopComponent,
    initialValues,
  });

  const handleSave = () => {
    if (form.validate()) {
      onSave(form.state);
    }
  };

  return (
    <Modal transparent visible animationType="fade" onRequestClose={onCancel}>
      <Pressable style={modalStyles.overlay} onPress={onCancel}>
        <Pressable style={modalStyles.card} onPress={() => {}}>
          <Text style={modalStyles.title}>
            {initialValues ? t("common.list.editItem", { defaultValue: "Edit item" }) : t("common.list.addItem", { defaultValue: "Add item" })}
          </Text>
          <ScrollView style={modalStyles.body}>
            {form.fields.map((field) => {
              if (field.proxy.hidden) return null;
              const Renderer = getRenderer(field.config.component);
              if (!Renderer) return null;
              return (
                <View key={field.name}>
                  <Renderer {...form.getFieldProps(field.name)} />
                </View>
              );
            })}
          </ScrollView>
          <View style={modalStyles.actions}>
            <Pressable style={[modalStyles.button, modalStyles.cancelButton]} onPress={onCancel}>
              <Text style={modalStyles.cancelText}>{t("common.dialog.cancel", { defaultValue: "Cancel" })}</Text>
            </Pressable>
            <Pressable style={[modalStyles.button, modalStyles.okButton]} onPress={handleSave}>
              <Text style={modalStyles.okText}>{t("common.dialog.ok", { defaultValue: "OK" })}</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export function ListField({ domain, name, value, config, proxy, errors, onChange, scope }: FieldRendererProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = createStyles(theme);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  if (proxy.hidden) return null;

  const fieldLabel = t(`${domain}.fields.${name}`, { defaultValue: name });
  const items = Array.isArray(value) ? (value as Record<string, unknown>[]) : [];
  const reorderable = config.attrs.reorderable === true;
  const rawSchema = config.attrs.itemSchema;
  const itemSchema = rawSchema && typeof rawSchema === 'object' && 'fields' in rawSchema && 'domain' in rawSchema
    ? (rawSchema as SchemaProvide)
    : undefined;

  const remove = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const add = () => {
    if (itemSchema) {
      setShowAdd(true);
    } else {
      onChange([...items, {}]);
    }
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

  const handleSaveNew = (values: Record<string, unknown>) => {
    onChange([...items, values]);
    setShowAdd(false);
  };

  const handleSaveEdit = (values: Record<string, unknown>) => {
    if (editIndex === null) return;
    const next = [...items];
    next[editIndex] = values;
    onChange(next);
    setEditIndex(null);
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
              {itemSchema && !proxy.disabled && (
                <Pressable onPress={() => setEditIndex(index)}>
                  <Text style={styles.btnText}>✎</Text>
                </Pressable>
              )}
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

      {showAdd && itemSchema && (
        <ItemFormModal
          itemSchema={itemSchema}
          scope={scope}
          onSave={handleSaveNew}
          onCancel={() => setShowAdd(false)}
          theme={theme}
        />
      )}

      {editIndex !== null && itemSchema && (
        <ItemFormModal
          key={editIndex}
          itemSchema={itemSchema}
          scope={scope}
          initialValues={items[editIndex]}
          onSave={handleSaveEdit}
          onCancel={() => setEditIndex(null)}
          theme={theme}
        />
      )}
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

const createModalStyles = (theme: Theme) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xxl,
    minWidth: 360,
    maxWidth: 480,
    maxHeight: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.foreground,
    marginBottom: theme.spacing.md,
  },
  body: {
    marginBottom: theme.spacing.xl,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: theme.spacing.sm,
  },
  button: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    minWidth: 80,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: theme.colors.secondary,
  },
  cancelText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.secondaryForeground,
  },
  okButton: {
    backgroundColor: theme.colors.primary,
  },
  okText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.primaryForeground,
  },
});
