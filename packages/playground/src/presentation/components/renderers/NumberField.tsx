import { View, Text, TextInput, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import type { FieldRendererProps } from "@anhanga/react";
import { theme } from "../../theme";

const ds = (id: string) => ({ dataSet: { id } }) as any;

export function NumberField({ domain, name, value, proxy, errors, onChange, onBlur, onFocus }: FieldRendererProps) {
  const { t } = useTranslation();
  if (proxy.hidden) return null;

  const fieldLabel = t(`${domain}.fields.${name}`, { defaultValue: name });

  return (
    <View style={styles.container} {...ds(`NumberField:${name}`)}>
      <Text style={styles.label}>{fieldLabel}</Text>
      <TextInput
        style={[styles.input, proxy.disabled && styles.inputDisabled, errors.length > 0 && styles.inputError]}
        value={value !== undefined && value !== null ? String(value) : ""}
        onChangeText={(text) => {
          const num = Number(text);
          onChange(isNaN(num) ? text : num);
        }}
        onBlur={onBlur}
        onFocus={onFocus}
        editable={!proxy.disabled}
        keyboardType="numeric"
        placeholder={fieldLabel}
        placeholderTextColor={theme.colors.mutedForeground}
      />
      <View style={styles.errorSlot}>
        {errors.map((error, i) => (
          <Text key={i} style={styles.error}>{error}</Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.xs,
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
  errorSlot: {
    minHeight: 20,
    marginTop: 2,
  },
  error: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.destructive,
  },
});
