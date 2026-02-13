import { View, Text, Pressable, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import type { FieldRendererProps } from "@ybyra/react";
import { useTheme } from "../theme/context";
import type { Theme } from "../theme/default";
import { ds } from "../support/ds";

export function MultiSelectField({ domain, name, value, config, proxy, errors, onChange, onBlur, onFocus }: FieldRendererProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = createStyles(theme);
  if (proxy.hidden) return null;

  const fieldLabel = t(`${domain}.fields.${name}`, { defaultValue: name });
  const options = (config.attrs.options ?? []) as (string | number)[];
  const selected = Array.isArray(value) ? (value as string[]) : [];

  const toggle = (optValue: string) => {
    const next = selected.includes(optValue)
      ? selected.filter((v) => v !== optValue)
      : [...selected, optValue];
    onChange(next);
  };

  return (
    <View style={styles.container} {...ds(`MultiSelectField:${name}`)}>
      <Text style={styles.label}>{fieldLabel}</Text>
      {selected.length > 0 && (
        <View style={styles.chips}>
          {selected.map((v) => (
            <View key={v} style={styles.chip}>
              <Text style={styles.chipText}>{t(`${domain}.fields.${name}.${v}`, { defaultValue: v })}</Text>
              {!proxy.disabled && (
                <Pressable onPress={() => toggle(v)}>
                  <Text style={styles.chipRemove}>×</Text>
                </Pressable>
              )}
            </View>
          ))}
        </View>
      )}
      <View style={[styles.optionList, errors.length > 0 && styles.inputError]}>
        {options.map((opt) => (
          <Pressable
            key={String(opt)}
            style={[styles.option, selected.includes(String(opt)) && styles.optionSelected]}
            onPress={() => { if (!proxy.disabled) toggle(String(opt)); }}
            disabled={proxy.disabled}
          >
            <View style={[styles.checkbox, selected.includes(String(opt)) && styles.checkboxChecked]} />
            <Text style={styles.optionText}>{t(`${domain}.fields.${name}.${opt}`, { defaultValue: String(opt) })}</Text>
          </Pressable>
        ))}
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
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    marginBottom: theme.spacing.xs,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.muted,
  },
  chipText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.cardForeground,
  },
  chipRemove: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.mutedForeground,
    paddingLeft: 4,
  },
  optionList: {
    borderWidth: 1,
    borderColor: theme.colors.input,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.card,
  },
  inputError: {
    borderColor: theme.colors.destructive,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 8,
  },
  optionSelected: {
    backgroundColor: theme.colors.muted,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: theme.colors.input,
    borderRadius: 3,
  },
  checkboxChecked: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  optionText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.cardForeground,
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
