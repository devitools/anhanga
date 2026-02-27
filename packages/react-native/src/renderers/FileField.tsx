import { View, Text, Pressable, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import type { FieldRendererProps } from "@ybyra/react";
import { useTheme } from "../theme/context";
import type { Theme } from "../theme/default";
import { ds } from "../support/ds";

export function FileField({ domain, name, value, config, proxy, errors }: FieldRendererProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = createStyles(theme);
  if (proxy.hidden) return null;

  const fieldLabel = t(`${domain}.fields.${name}`, { defaultValue: name });
  const isImage = config.component === "image";
  const fileName = value && typeof value === "object" && "name" in value ? String(value.name) : (value ? String(value) : "");

  return (
    <View style={styles.container} {...ds(`FileField:${name}`)}>
      <Text style={styles.label}>{fieldLabel}</Text>
      <View style={styles.inputWrapper}>
        {/* TODO: integrate expo-document-picker or react-native-document-picker for actual file selection */}
        <Pressable
          style={[styles.chooseBtn, proxy.disabled && styles.chooseBtnDisabled]}
          disabled={proxy.disabled}
        >
          <Text style={[styles.chooseBtnText, proxy.disabled && styles.chooseBtnTextDisabled]}>
            {t("common.file.choose", { defaultValue: isImage ? "Choose image…" : "Choose file…" })}
          </Text>
        </Pressable>
        <Text style={styles.fileName} numberOfLines={1}>
          {fileName || t("common.file.none", { defaultValue: "No file selected" })}
        </Text>
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
    gap: theme.spacing.sm,
  },
  chooseBtn: {
    borderWidth: 1,
    borderColor: theme.colors.input,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 8,
    backgroundColor: theme.colors.secondary,
  },
  chooseBtnDisabled: {
    backgroundColor: theme.colors.muted,
  },
  chooseBtnText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.secondaryForeground,
  },
  chooseBtnTextDisabled: {
    color: theme.colors.mutedForeground,
  },
  fileName: {
    flex: 1,
    fontSize: theme.fontSize.sm,
    color: theme.colors.mutedForeground,
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
