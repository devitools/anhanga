import { View, StyleSheet } from "react-native";
import { getRenderer } from "@ybyra/react";
import { ds } from "../../support/ds";
import type { FieldsGridProps } from "../../types";

export function FieldsGrid({ fields, getFieldProps }: FieldsGridProps) {
  return (
    <View style={styles.fieldsGrid}>
      {fields.map((field) => {
        if (field.proxy.hidden) return null;
        const Renderer = getRenderer(field.config.component);
        if (!Renderer) return null;
        return (
          <View
            key={field.name}
            style={{ gridColumn: `span ${field.proxy.width}` } as any}
            {...ds(`field:${field.name}`)}
          >
            <Renderer {...getFieldProps(field.name)} />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  fieldsGrid: {
    display: "grid" as any,
    gridTemplateColumns: "repeat(100, 1fr)",
  } as any,
});
