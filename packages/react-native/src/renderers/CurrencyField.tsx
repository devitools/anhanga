import { View, Text, TextInput, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import type { FieldRendererProps } from "@ybyra/react";
import { useTheme } from "../theme/context";
import type { Theme } from "../theme/default";
import { ds } from "../support/ds";

export function CurrencyField({ domain, name, value, config, proxy, errors, onChange, onBlur, onFocus }: FieldRendererProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = createStyles(theme);
  if (proxy.hidden) return null;

  const fieldLabel = t(`${domain}.fields.${name}`, { defaultValue: name });
  const prefix = (config.attrs.prefix as string) ?? "";

  return (
    <View style={styles.container} {...ds(`CurrencyField:${name}`)}>
      <Text style={styles.label}>{fieldLabel}</Text>
      <View style={styles.inputWrapper}>
        {prefix ? <Text style={styles.prefix}>{prefix}</Text> : null}
        <TextInput
          style={[styles.input, prefix ? styles.inputWithPrefix : null, proxy.disabled && styles.inputDisabled, errors.length > 0 && styles.inputError]}
          value={value !== undefined && value !== null ? String(value) : ""}
          onChangeText={(text) => {
            const num = Number(text);
            onChange(isNaN(num) ? text : num);
          }}
          onBlur={onBlur}
          onFocus={onFocus}
          editable={!proxy.disabled}
          keyboardType="decimal-pad"
          placeholderTextColor={theme.colors.mutedForeground}
        />
      </View>
      <View style={styles.errorSlot}>
        {errors.map((error, i) => (
          <Text key={i} style={styles.error}>{error}</Text>
        ))}
      </View>
    </View>
  );
}

const createStyles = (theme: Theme) => StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.xs,
  },
  label: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    marginBottom: theme.spacing.xs,
    color: theme.colors.foreground,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  prefix: {
    position: "absolute",
    left: theme.spacing.md,
    fontSize: theme.fontSize.md,
    color: theme.colors.mutedForeground,
    zIndex: 1,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.colors.input,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 10,
    fontSize: theme.fontSize.md,
    backgroundColor: theme.colors.card,
    color: theme.colors.cardForeground,
  },
  inputWithPrefix: {
    paddingLeft: 36,
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
