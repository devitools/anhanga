import { useCallback, useState } from "react";
import { View, Text, Pressable, StyleSheet, Platform } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSchemaForm, getRenderer } from "@anhanga/react";
import type { UseSchemaFormOptions } from "@anhanga/react";
import { fakeAll } from "../support/faker";
import { theme } from "../theme";
import { ActionBar } from "./ActionBar";
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

export function SchemaForm({ debug = __DEV__, ...props }: SchemaFormProps) {
  const form = useSchemaForm(props);
  const [debugExpanded, setDebugExpanded] = useState(false);

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
            <View style={styles.debugActions}>
              <Pressable style={styles.debugButton} onPress={handleFill}>
                <Feather name="zap" size={12} color={theme.colors.warning} />
              </Pressable>
              <Pressable style={styles.debugButton} onPress={() => form.reset()}>
                <Feather name="rotate-ccw" size={12} color={theme.colors.mutedForeground} />
              </Pressable>
              <Pressable style={styles.debugButton} onPress={() => form.validate()}>
                <Feather name="check" size={12} color={theme.colors.success} />
              </Pressable>
              <Pressable style={styles.debugButton} onPress={reload}>
                <Feather name="refresh-cw" size={12} color={theme.colors.info} />
              </Pressable>
              <Pressable style={styles.debugButton} onPress={() => setDebugExpanded((v) => !v)}>
                <Feather name={debugExpanded ? "minus" : "plus"} size={12} color={theme.colors.warning} />
              </Pressable>
            </View>
          </View>

          {debugExpanded && (
            <>
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
            </>
          )}
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
