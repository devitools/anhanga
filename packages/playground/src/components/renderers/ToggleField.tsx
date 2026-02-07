import { View, Text, Switch, StyleSheet } from "react-native";
import type { FieldRendererProps } from "@anhanga/react";
import { theme } from "../../theme";

const ds = (id: string) => ({ dataSet: { id } }) as any;

export function ToggleField({ name, value, proxy, onChange }: FieldRendererProps) {
  if (proxy.hidden) return null;

  return (
    <View style={styles.container} {...ds(`ToggleField:${name}`)}>
      <Text style={styles.label}>{name}</Text>
      <View style={styles.row}>
        <Switch
          value={Boolean(value)}
          onValueChange={onChange}
          disabled={proxy.disabled}
          trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
          thumbColor={theme.colors.card}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.xs,
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    marginBottom: theme.spacing.xs,
    color: theme.colors.foreground,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
  },
});
