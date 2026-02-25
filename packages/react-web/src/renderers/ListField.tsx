import { useState, useMemo } from "react";
import { createPortal } from "react-dom";
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
}: {
  itemSchema: SchemaProvide;
  scope: string;
  initialValues?: Record<string, unknown>;
  onSave: (values: Record<string, unknown>) => void;
  onCancel: () => void;
}) {
  const { t } = useTranslation();
  const theme = useTheme();
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

  return createPortal(
    <div style={modalStyles.overlay} onClick={onCancel}>
      <div style={modalStyles.card} onClick={(e) => e.stopPropagation()}>
        <div style={modalStyles.title}>
          {initialValues ? t("common.list.editItem", { defaultValue: "Edit item" }) : t("common.list.addItem", { defaultValue: "Add item" })}
        </div>
        <div style={modalStyles.body}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(100, 1fr)" }}>
            {form.fields.map((field) => {
              if (field.proxy.hidden) return null;
              const Renderer = getRenderer(field.config.component);
              if (!Renderer) return null;
              return (
                <div key={field.name} style={{ gridColumn: `span ${field.proxy.width}` }}>
                  <Renderer {...form.getFieldProps(field.name)} />
                </div>
              );
            })}
          </div>
        </div>
        <div style={modalStyles.actions}>
          <button type="button" style={modalStyles.cancelButton} onClick={onCancel}>
            {t("common.dialog.cancel", { defaultValue: "Cancel" })}
          </button>
          <button type="button" style={modalStyles.okButton} onClick={handleSave}>
            {t("common.dialog.ok", { defaultValue: "OK" })}
          </button>
        </div>
      </div>
    </div>,
    document.body,
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
  const hasError = errors.length > 0;
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
              {itemSchema && !proxy.disabled && (
                <button type="button" style={styles.btn} onClick={() => setEditIndex(index)}>✎</button>
              )}
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

      {showAdd && itemSchema && (
        <ItemFormModal
          itemSchema={itemSchema}
          scope={scope}
          onSave={handleSaveNew}
          onCancel={() => setShowAdd(false)}
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
        />
      )}
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

const createModalStyles = (theme: Theme) => ({
  overlay: {
    position: "fixed" as const,
    inset: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xxl,
    minWidth: 400,
    maxWidth: 640,
    maxHeight: "80vh",
    overflow: "auto",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
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
    display: "flex",
    justifyContent: "flex-end",
    gap: theme.spacing.sm,
  },
  cancelButton: {
    padding: `${theme.spacing.sm}px ${theme.spacing.lg}px`,
    borderRadius: theme.borderRadius.md,
    minWidth: 80,
    textAlign: "center" as const,
    backgroundColor: theme.colors.secondary,
    color: theme.colors.secondaryForeground,
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    border: "none",
    cursor: "pointer",
  },
  okButton: {
    padding: `${theme.spacing.sm}px ${theme.spacing.lg}px`,
    borderRadius: theme.borderRadius.md,
    minWidth: 80,
    textAlign: "center" as const,
    backgroundColor: theme.colors.primary,
    color: theme.colors.primaryForeground,
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    border: "none",
    cursor: "pointer",
  },
});
