import { View, Text, Pressable, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { Feather } from "@expo/vector-icons";
import type { PositionValue } from "@anhanga/core";
import { resolveActionLabel } from "@anhanga/react";
import { theme } from "../theme";

const ds = (id: string) => ({ dataSet: { id } }) as any;

const variantStyles: Record<string, { bg: string; border: string; text: string }> = {
  default: { bg: theme.colors.card, border: theme.colors.border, text: theme.colors.foreground },
  primary: { bg: theme.colors.primary, border: theme.colors.primary, text: theme.colors.primaryForeground },
  destructive: { bg: theme.colors.destructive, border: theme.colors.destructive, text: theme.colors.destructiveForeground },
  warning: { bg: theme.colors.warning, border: theme.colors.warning, text: theme.colors.warningForeground },
  success: { bg: theme.colors.success, border: theme.colors.success, text: theme.colors.successForeground },
  info: { bg: theme.colors.info, border: theme.colors.info, text: theme.colors.infoForeground },
  muted: { bg: theme.colors.muted, border: theme.colors.muted, text: theme.colors.mutedForeground },
  accent: { bg: theme.colors.accent, border: theme.colors.accent, text: theme.colors.accentForeground },
};

export function ActionButton({ action, domain }: { action: { name: string; config: { icon?: string; variant: string }; execute: () => void }; domain: string }) {
  const { t } = useTranslation();
  const variant = variantStyles[action.config.variant] ?? variantStyles.default;
  const actionLabel = resolveActionLabel(t, domain, action.name);
  return (
    <Pressable
      style={[styles.actionButton, { backgroundColor: variant.bg, borderColor: variant.border }]}
      onPress={action.execute}
      {...ds(`action:${action.name}`)}
    >
      {action.config.icon && <Feather name={action.config.icon as any} size={16} color={variant.text} style={styles.actionIcon} />}
      <Text style={[styles.actionButtonText, { color: variant.text }]}>{actionLabel}</Text>
    </Pressable>
  );
}

export function ActionBar({ actions, position, domain }: { actions: { name: string; config: any; execute: () => void }[]; position: PositionValue; domain: string }) {
  const items = actions.filter((a) => a.config.positions.includes(position));
  if (items.length === 0) return null;

  if (position === "floating") {
    return (
      <View style={styles.floatingContainer} {...ds("actions:floating")}>
        {items.map((action) => <ActionButton key={action.name} action={action} domain={domain} />)}
      </View>
    );
  }

  const startItems = items.filter((a) => a.config.align === "start");
  const endItems = items.filter((a) => a.config.align === "end");

  return (
    <View style={styles.actionsRow} {...ds(`actions:${position}`)}>
      <View style={styles.actionsGroup}>
        {startItems.map((action) => <ActionButton key={action.name} action={action} domain={domain} />)}
      </View>
      <View style={styles.actionsGroup}>
        {endItems.map((action) => <ActionButton key={action.name} action={action} domain={domain} />)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionsGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.md,
  },
  floatingContainer: {
    position: "absolute",
    bottom: theme.spacing.xl,
    right: theme.spacing.xl,
    flexDirection: "column",
    gap: theme.spacing.md,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
  },
  actionIcon: {
    marginRight: theme.spacing.sm,
  },
  actionButtonText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
  },
});
