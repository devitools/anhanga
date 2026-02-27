import { getRenderer } from "@ybyra/react";
import { ds } from "../../support/ds";
import type { FieldsGridProps } from "../../types";

export function FieldsGrid({ fields, getFieldProps, slots }: FieldsGridProps) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(100, 1fr)" }}>
      {fields.map((field) => {
        if (field.proxy.hidden) return null;

        const isSlot = field.config.component === "slot";
        const SlotRenderer = isSlot ? slots?.[field.name] : undefined;

        if (isSlot && !SlotRenderer) return null;

        if (isSlot && SlotRenderer) {
          const { value, proxy, scope, domain } = getFieldProps(field.name);
          return (
            <div
              key={field.name}
              style={{ gridColumn: `span ${field.proxy.width}` }}
              {...ds(`field:${field.name}`)}
            >
              <SlotRenderer domain={domain} name={field.name} value={value} proxy={proxy} scope={scope} />
            </div>
          );
        }

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
