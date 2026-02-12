import { getRenderer } from "@ybyra/react";
import { ds } from "../../support/ds";
import type { FieldsGridProps } from "../../types";

export function FieldsGrid({ fields, getFieldProps }: FieldsGridProps) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(100, 1fr)" }}>
      {fields.map((field) => {
        if (field.proxy.hidden) return null;
        const Renderer = getRenderer(field.config.component);
        if (!Renderer) return null;
        return (
          <div
            key={field.name}
            style={{ gridColumn: `span ${field.proxy.width}` }}
            {...ds(`field:${field.name}`)}
          >
            <Renderer {...getFieldProps(field.name)} />
          </div>
        );
      })}
    </div>
  );
}
