import { useCallback } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Platform } from "react-native";
import { useTranslation } from "react-i18next";
import { useDataForm } from "@anhanga/react";
import type { UseDataFormOptions } from "@anhanga/react";
import { fill, createFiller } from "@anhanga/core";
import type { FillerRegistry } from "@anhanga/core";
import { useTheme } from "../theme/context";
import type { Theme } from "../theme/default";
import { ActionBar } from "./ActionBar";
import { FieldsGrid as DefaultFieldsGrid } from "./defaults/FieldsGrid";
import { DebugPanel } from "./defaults/DebugPanel";
import { ds } from "../support/ds";
import type { DataFormComponents } from "../types";
import "../renderers";

interface DataFormProps extends UseDataFormOptions {
  debug?: boolean;
  components?: DataFormComponents;
  filler?: FillerRegistry;
}

function reload() {
  if (Platform.OS === "web" && typeof window !== "undefined") {
    window.location.reload();
  }
}

export function DataForm({ debug, components, filler, ...props }: DataFormProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const form = useDataForm({ ...props, translate: props.translate ?? t });
  const styles = createStyles(theme);
  const ResolvedActionBar = components?.ActionBar ?? ActionBar;
  const ResolvedFieldsGrid = components?.FieldsGrid ?? DefaultFieldsGrid;
  const ResolvedLoading = components?.Loading;

  const handleFill = useCallback(() => {
    const fillerFn = filler ? createFiller(filler) : fill;
    form.setValues(fillerFn(props.schema.fields, props.schema.identity));
  }, [filler, form, props.schema]);

  if (form.loading) {
    if (ResolvedLoading) return <ResolvedLoading />;
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View {...ds("DataForm")}>
      <ResolvedActionBar
        actions={form.actions}
        position="top"
        domain={props.schema.domain}
      />

      {form.sections.map((section, index) => {
        if (section.kind === "group") {
          if (components?.GroupWrapper) {
            const GroupWrapper = components.GroupWrapper;
            return (
              <GroupWrapper
                key={section.name}
                name={section.name}
                domain={props.schema.domain}
              >
                <ResolvedFieldsGrid
                  fields={section.fields}
                  getFieldProps={form.getFieldProps}
                />
              </GroupWrapper>
            );
          }
          return (
            <View
              key={section.name}
              style={styles.group} {...ds(`group:${section.name}`)}>
              <Text style={styles.groupTitle}>{t(`${props.schema.domain}.groups.${section.name}`, { defaultValue: section.name })}</Text>
              <ResolvedFieldsGrid
                fields={section.fields}
                getFieldProps={form.getFieldProps}
              />
            </View>
          );
        }
        return (
          <View
            key={`ungrouped-${index}`}
            style={styles.group} {...ds("ungrouped")}>
            <ResolvedFieldsGrid
              fields={section.fields}
              getFieldProps={form.getFieldProps}
            />
          </View>
        );
      })}

      {components?.Divider
        ? <components.Divider />
        : <View style={styles.divider} />}

      <ResolvedActionBar
        actions={form.actions}
        position="footer"
        domain={props.schema.domain}
      />

      <ResolvedActionBar
        actions={form.actions}
        position="floating"
        domain={props.schema.domain}
      />

      {debug && (
        <DebugPanel
          actions={[
            { icon: "zap", color: theme.colors.warning, onPress: handleFill },
            { icon: "rotate-ccw", color: theme.colors.mutedForeground, onPress: () => form.reset() },
            { icon: "check", color: theme.colors.success, onPress: () => form.validate() },
            { icon: "refresh-cw", color: theme.colors.info, onPress: reload },
          ]}
          entries={[
            { title: "State", content: JSON.stringify(form.state, null, 2) },
            { title: "Errors", content: JSON.stringify(form.errors, null, 2) },
          ]}
          meta={`dirty: ${String(form.dirty)} | valid: ${String(form.valid)}`}
        />
      )}
    </View>
  );
}

const createStyles = (theme: Theme) => StyleSheet.create({
  loadingContainer: {
    paddingVertical: theme.spacing.xxl,
    alignItems: "center",
    justifyContent: "center",
  },
  group: {
    marginBottom: theme.spacing.lg,
  },
  groupTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.mutedForeground,
    marginBottom: theme.spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.xl,
  },
});
