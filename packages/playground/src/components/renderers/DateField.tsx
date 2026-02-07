import { View, Text, TextInput, StyleSheet } from "react-native";
import type { FieldRendererProps } from "@anhanga/react";
import { theme } from "../../theme";

const ds = (id: string) => ({ dataSet: { id } }) as any;

export function DateField({ name, value, proxy, errors, onChange, onBlur, onFocus }: FieldRendererProps) {
  if (proxy.hidden) return null;

  return (
    <View style={styles.container} {...ds(`DateField:${name}`)}>
      <Text style={styles.label}>{name}</Text>
      <TextInput
        style={[styles.input, proxy.disabled && styles.inputDisabled, errors.length > 0 && styles.inputError]}
        value={String(value ?? "")}
        onChangeText={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        editable={!proxy.disabled}
        placeholder="YYYY-MM-DD"
        placeholderTextColor={theme.colors.mutedForeground}
      />
      {errors.map((error, i) => (
        <Text key={i} style={styles.error}>{error}</Text>
      ))}
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
  input: {
    borderWidth: 1,
    borderColor: theme.colors.input,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 10,
    fontSize: theme.fontSize.md,
    backgroundColor: theme.colors.card,
    color: theme.colors.cardForeground,
  },
  inputDisabled: {
    backgroundColor: theme.colors.muted,
    color: theme.colors.mutedForeground,
  },
  inputError: {
    borderColor: theme.colors.destructive,
  },
  error: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.destructive,
    marginTop: 2,
  },
});
