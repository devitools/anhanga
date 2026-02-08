import { useTranslation } from "react-i18next";
import { useSchemaForm, getRenderer } from "@anhanga/react";
import type { UseSchemaFormOptions, ResolvedField, UseSchemaFormReturn, ResolvedAction } from "@anhanga/react";
import type { Position } from "@anhanga/core";

interface SchemaFormProps extends UseSchemaFormOptions {}

function ActionBar({ actions, position, domain }: { actions: ResolvedAction[]; position: string; domain: string }) {
  const { t } = useTranslation();
  const filtered = actions.filter((a) => a.config.positions?.includes(position as Position));
  if (filtered.length === 0) return null;

  return (
    <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
      {filtered.map((action) => (
        <button
          key={action.name}
          onClick={() => action.execute()}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: 4,
            border: "1px solid #ccc",
            cursor: "pointer",
            backgroundColor: action.config.variant === "primary" ? "#2563eb" : undefined,
            color: action.config.variant === "primary" ? "#fff" : undefined,
          }}
        >
          {t(`common.actions.${action.name}`, { defaultValue: t(`${domain}.actions.${action.name}`, { defaultValue: action.name }) })}
        </button>
      ))}
    </div>
  );
}

function FieldsGrid({ fields, getFieldProps }: {
  fields: ResolvedField[];
  getFieldProps: UseSchemaFormReturn["getFieldProps"];
}) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(100, 1fr)", gap: "0.5rem" }}>
      {fields.map((field) => {
        if (field.proxy.hidden) return null;
        const Renderer = getRenderer(field.config.component);
        if (!Renderer) return null;
        return (
          <div key={field.name} style={{ gridColumn: `span ${field.proxy.width}` }}>
            <Renderer {...getFieldProps(field.name)} />
          </div>
        );
      })}
    </div>
  );
}

export function SchemaForm(props: SchemaFormProps) {
  const { t } = useTranslation();
  const form = useSchemaForm({ ...props, translate: props.translate ?? t });

  if (form.loading) {
    return <div style={{ textAlign: "center", padding: "2rem" }}>Loading...</div>;
  }

  return (
    <div>
      <ActionBar actions={form.actions} position="top" domain={props.schema.domain} />

      {form.sections.map((section, index) => {
        if (section.kind === "group") {
          return (
            <div key={section.name} style={{ marginBottom: "1.5rem" }}>
              <h3 style={{ color: "#6b7280", marginBottom: "0.75rem" }}>
                {t(`${props.schema.domain}.groups.${section.name}`, { defaultValue: section.name })}
              </h3>
              <FieldsGrid fields={section.fields} getFieldProps={form.getFieldProps} />
            </div>
          );
        }
        return (
          <div key={`ungrouped-${index}`} style={{ marginBottom: "1.5rem" }}>
            <FieldsGrid fields={section.fields} getFieldProps={form.getFieldProps} />
          </div>
        );
      })}

      <hr style={{ margin: "1.5rem 0", border: "none", borderTop: "1px solid #e5e7eb" }} />

      <ActionBar actions={form.actions} position="footer" domain={props.schema.domain} />
    </div>
  );
}
