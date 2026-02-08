import { useCallback } from "react";
import { View, Text, Pressable, StyleSheet, Platform } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSchemaForm, getRenderer } from "@anhanga/react";
import type { UseSchemaFormOptions } from "@anhanga/react";
import type { PositionValue } from "@anhanga/core";
import { fakeAll } from "../support/faker";
import { theme } from "../theme";
import "./renderers";

const ds = (id: string) => ({ dataSet: { id } }) as any;

interface SchemaFormProps extends UseSchemaFormOptions {
  debug?: boolean
}

function reload() {
  if (Platform.OS === "web" && typeof window !== "undefined") {
    window.location.reload();
  }
}

const variantStyles: Record<string, { bg: string; border: string; text: string }> = {
  default: { bg: theme.colors.card, border: theme.colors.border, text: theme.colors.foreground },
  primary: { bg: theme.colors.primary, border: theme.colors.primary, text: theme.colors.primaryForeground },
  destructive: { bg: theme.colors.destructive, border: theme.colors.destructive, text: theme.colors.destructiveForeground },
  warning: { bg: theme.colors.warning, border: theme.colors.warning, text: theme.colors.warningForeground },
  success: { bg: theme.colors.success, border: theme.colors.success, text: theme.colors.successForeground },
  info: { bg: theme.colors.info, border: theme.colors.info, text: theme.colors.infoForeground },
  muted: { bg: theme.colors.muted, border: theme.colors.muted, text: theme.colors.mutedForeground },
  accent: { bg: theme.colors.accent, border: theme.colors.accent, text: theme.colors.accentForeground },
};

function ActionButton({ action }: { action: { name: string; config: { icon?: string; variant: string }; execute: () => void } }) {
  const variant = variantStyles[action.config.variant] ?? variantStyles.default;
  return (
    <Pressable
      style={[styles.actionButton, { backgroundColor: variant.bg, borderColor: variant.border }]}
      onPress={action.execute}
      {...ds(`action:${action.name}`)}
    >
      {action.config.icon && <Feather name={action.config.icon as any} size={16} color={variant.text} style={styles.actionIcon} />}
      <Text style={[styles.actionButtonText, { color: variant.text }]}>{action.name}</Text>
    </Pressable>
  );
}

function ActionBar({ actions, position }: { actions: { name: string; config: any; execute: () => void }[]; position: PositionValue }) {
  const items = actions.filter((a) => a.config.positions.includes(position));
  if (items.length === 0) return null;

  if (position === "floating") {
    return (
      <View style={styles.floatingContainer} {...ds("actions:floating")}>
        {items.map((action) => <ActionButton key={action.name} action={action} />)}
      </View>
    );
  }

  const startItems = items.filter((a) => a.config.align === "start");
  const endItems = items.filter((a) => a.config.align === "end");

  return (
    <View style={styles.actionsRow} {...ds(`actions:${position}`)}>
      <View style={styles.actionsGroup}>
        {startItems.map((action) => <ActionButton key={action.name} action={action} />)}
      </View>
      <View style={styles.actionsGroup}>
        {endItems.map((action) => <ActionButton key={action.name} action={action} />)}
      </View>
    </View>
  );
}

export function SchemaForm({ debug = __DEV__, ...props }: SchemaFormProps) {
  const form = useSchemaForm(props);

  const handleFill = useCallback(() => {
    const fakeData = fakeAll(props.schema.fields, props.schema.identity);
    form.setValues(fakeData);
  }, [props.schema.fields, props.schema.identity, form]);

  return (
    <View {...ds("SchemaForm")}>
      <ActionBar actions={form.actions} position="top" />

      {form.groups.map((group) => (
        <View key={group.name} style={styles.group} {...ds(`group:${group.name}`)}>
          <Text style={styles.groupTitle}>{group.name}</Text>
          <View style={styles.fieldsGrid}>
            {group.fields.map((field) => {
              if (field.proxy.hidden) return null;
              const Renderer = getRenderer(field.config.component);
              if (!Renderer) return null;
              return (
                <View
                  key={field.name}
                  style={{ gridColumn: `span ${field.proxy.width}` } as any}
                  {...ds(`field:${field.name}`)}
                >
                  <Renderer {...form.getFieldProps(field.name)} />
                </View>
              );
            })}
          </View>
        </View>
      ))}

      {form.ungrouped.length > 0 && (
        <View style={styles.group} {...ds("ungrouped")}>
          <View style={styles.fieldsGrid}>
            {form.ungrouped.map((field) => {
              if (field.proxy.hidden) return null;
              const Renderer = getRenderer(field.config.component);
              if (!Renderer) return null;
              return (
                <View
                  key={field.name}
                  style={{ gridColumn: `span ${field.proxy.width}` } as any}
                  {...ds(`field:${field.name}`)}
                >
                  <Renderer {...form.getFieldProps(field.name)} />
                </View>
              );
            })}
          </View>
        </View>
      )}

      <View style={styles.divider} />

      <ActionBar actions={form.actions} position="footer" />

      <ActionBar actions={form.actions} position="floating" />

      {debug && (
        <View style={styles.debugSection} {...ds("debug")}>
          <View style={styles.debugToolbar}>
            <Text style={styles.debugLabel}>Debug</Text>
            <View style={styles.debugActions}>
              <Pressable style={styles.debugButton} onPress={handleFill}>
                <Feather name="zap" size={12} color={theme.colors.warning} />
                <Text style={styles.debugButtonText}>Fill</Text>
              </Pressable>
              <Pressable style={styles.debugButton} onPress={() => form.reset()}>
                <Feather name="rotate-ccw" size={12} color={theme.colors.mutedForeground} />
                <Text style={styles.debugButtonText}>Reset</Text>
              </Pressable>
              <Pressable style={styles.debugButton} onPress={() => form.validate()}>
                <Feather name="check" size={12} color={theme.colors.success} />
                <Text style={styles.debugButtonText}>Validate</Text>
              </Pressable>
              <Pressable style={styles.debugButton} onPress={reload}>
                <Feather name="refresh-cw" size={12} color={theme.colors.info} />
                <Text style={styles.debugButtonText}>Reload</Text>
              </Pressable>
            </View>
          </View>

          <Text style={styles.debugTitle}>State</Text>
          <Text style={styles.debugText}>
            {JSON.stringify(form.state, null, 2)}
          </Text>
          <Text style={styles.debugTitle}>Errors</Text>
          <Text style={styles.debugText}>
            {JSON.stringify(form.errors, null, 2)}
          </Text>
          <Text style={styles.debugMeta}>
            dirty: {String(form.dirty)} | valid: {String(form.valid)}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    marginBottom: theme.spacing.lg,
  },
  groupTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.mutedForeground,
    marginBottom: theme.spacing.md,
    textTransform: "capitalize",
  },
  fieldsGrid: {
    display: "grid" as any,
    gridTemplateColumns: "repeat(100, 1fr)",
  } as any,
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.xl,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionsGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.md,
  },
  floatingContainer: {
    position: "absolute",
    bottom: theme.spacing.xl,
    right: theme.spacing.xl,
    flexDirection: "column",
    gap: theme.spacing.md,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
  },
  actionIcon: {
    marginRight: theme.spacing.sm,
  },
  actionButtonText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
  },
  debugSection: {
    marginTop: theme.spacing.xxl,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.foreground,
    borderRadius: theme.borderRadius.md,
  },
  debugToolbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  debugLabel: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.mutedForeground,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  debugActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  debugButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: "#374151",
  },
  debugButtonText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
    color: "#F9FAFB",
  },
  debugTitle: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.mutedForeground,
    marginBottom: 2,
    marginTop: 10,
  },
  debugText: {
    fontSize: theme.fontSize.xs,
    fontFamily: "monospace",
    color: theme.colors.border,
  },
  debugMeta: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.mutedForeground,
    marginTop: 10,
  },
});
