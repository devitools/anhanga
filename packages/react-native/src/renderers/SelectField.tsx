import { useState } from "react";
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { useTranslation } from "react-i18next";
import type { FieldRendererProps } from "@ybyra/react";
import { useTheme } from "../theme/context";
import type { Theme } from "../theme/default";
import { ds } from "../support/ds";

export function SelectField({ domain, name, value, config, proxy, errors, onChange, onBlur, onFocus }: FieldRendererProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = createStyles(theme);
  const [open, setOpen] = useState(false);
  if (proxy.hidden) return null;

  const fieldLabel = t(`${domain}.fields.${name}`, { defaultValue: name });
  const options = (config.attrs.options ?? []) as (string | number)[];
  const selectedLabel = value ? t(`${domain}.fields.${name}.${value}`, { defaultValue: String(value) }) : "";

  return (
    <View style={styles.container} {...ds(`SelectField:${name}`)}>
      <Text style={styles.label}>{fieldLabel}</Text>
      <Pressable
        style={[styles.input, proxy.disabled && styles.inputDisabled, errors.length > 0 && styles.inputError]}
        onPress={() => { if (!proxy.disabled) { setOpen(!open); onFocus(); } }}
        disabled={proxy.disabled}
      >
        <Text style={[styles.inputText, !value && styles.placeholder]}>
          {selectedLabel}
        </Text>
      </Pressable>
      {open && (
        <View style={styles.dropdown}>
          <ScrollView style={styles.dropdownScroll}>
            <Pressable style={styles.option} onPress={() => { onChange(""); setOpen(false); onBlur(); }}>
              <Text style={styles.placeholder}>—</Text>
            </Pressable>
            {options.map((opt) => (
              <Pressable
                key={String(opt)}
                style={[styles.option, opt === value && styles.optionSelected]}
                onPress={() => { onChange(opt); setOpen(false); onBlur(); }}
              >
                <Text style={styles.optionText}>{t(`${domain}.fields.${name}.${opt}`, { defaultValue: String(opt) })}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}
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
  input: {
    borderWidth: 1,
    borderColor: theme.colors.input,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 10,
    backgroundColor: theme.colors.card,
  },
  inputText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.cardForeground,
  },
  inputDisabled: {
    backgroundColor: theme.colors.muted,
    color: theme.colors.mutedForeground,
  },
  inputError: {
    borderColor: theme.colors.destructive,
  },
  placeholder: {
    color: theme.colors.mutedForeground,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: theme.colors.input,
    borderRadius: theme.borderRadius.md,
    marginTop: 2,
    backgroundColor: theme.colors.card,
  },
  dropdownScroll: {
    maxHeight: 200,
  },
  option: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 8,
  },
  optionSelected: {
    backgroundColor: theme.colors.muted,
  },
  optionText: {
    fontSize: theme.fontSize.md,
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
