import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDataForm } from "@ybyra/react";
import type { UseDataFormOptions } from "@ybyra/react";
import { fill, createFiller } from "@ybyra/core";
import type { FillerRegistry } from "@ybyra/core";
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
      <div style={styles.loadingContainer}>Loading...</div>
    );
  }

  return (
    <div {...ds("DataForm")}>
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
            <div
              key={section.name}
              style={styles.group}
              {...ds(`group:${section.name}`)}
            >
              <h3 style={styles.groupTitle}>
                {t(`${props.schema.domain}.groups.${section.name}`, { defaultValue: section.name })}
              </h3>
              <ResolvedFieldsGrid
                fields={section.fields}
                getFieldProps={form.getFieldProps}
              />
            </div>
          );
        }
        return (
          <div
            key={`ungrouped-${index}`}
            style={styles.group}
            {...ds("ungrouped")}
          >
            <ResolvedFieldsGrid
              fields={section.fields}
              getFieldProps={form.getFieldProps}
            />
          </div>
        );
      })}

      {components?.Divider
        ? <components.Divider />
        : <div style={styles.divider} />}

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
            { icon: "refresh-cw", color: theme.colors.info, onPress: () => window.location.reload() },
          ]}
          entries={[
            { title: "State", content: JSON.stringify(form.state, null, 2) },
            { title: "Errors", content: JSON.stringify(form.errors, null, 2) },
          ]}
          meta={`dirty: ${String(form.dirty)} | valid: ${String(form.valid)}`}
        />
      )}
    </div>
  );
}

const createStyles = (theme: Theme) => ({
  loadingContainer: {
    padding: `${theme.spacing.xxl}px 0`,
    textAlign: "center" as const,
    color: theme.colors.mutedForeground,
  },
  group: {
    marginBottom: theme.spacing.lg,
  },
  groupTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.mutedForeground,
    marginBottom: theme.spacing.md,
    marginTop: 0,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    margin: `${theme.spacing.xl}px 0`,
  },
});
