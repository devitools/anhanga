import { useTranslation } from "react-i18next";
import { resolveActionLabel } from "@anhanga/react";
import { useTheme } from "../theme/context";
import type { Theme } from "../theme/default";
import { Icon } from "../support/Icon";
import { ds } from "../support/ds";
import type { ActionButtonProps, ActionBarProps } from "../types";

export function ActionButton({ action, domain }: ActionButtonProps) {
  const { t } = useTranslation();
  const theme = useTheme();

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

  const variant = variantStyles[action.config.variant] ?? variantStyles.default;
  const actionLabel = resolveActionLabel(t, domain, action.name);
  const styles = createStyles(theme);

  return (
    <button
      type="button"
      style={{ ...styles.actionButton, backgroundColor: variant.bg, borderColor: variant.border }}
      onClick={action.execute}
      {...ds(`action:${action.name}`)}
    >
      {action.config.icon && (
        <Icon name={action.config.icon} size={16} color={variant.text} style={{ marginRight: theme.spacing.sm }} />
      )}
      <span style={{ ...styles.actionButtonText, color: variant.text }}>{actionLabel}</span>
    </button>
  );
}

export function ActionBar({ actions, position, domain }: ActionBarProps) {
  const theme = useTheme();
  const styles = createStyles(theme);
  const items = actions.filter((a) => a.config.positions.includes(position));
  if (items.length === 0) return null;

  if (position === "floating") {
    return (
      <div style={styles.floatingContainer} {...ds("actions:floating")}>
        {items.map((action) => <ActionButton key={action.name} action={action} domain={domain} />)}
      </div>
    );
  }

  const startItems = items.filter((a) => a.config.align === "start");
  const endItems = items.filter((a) => a.config.align === "end");

  return (
    <div style={styles.actionsRow} {...ds(`actions:${position}`)}>
      <div style={styles.actionsGroup}>
        {startItems.map((action) => <ActionButton key={action.name} action={action} domain={domain} />)}
      </div>
      <div style={styles.actionsGroup}>
        {endItems.map((action) => <ActionButton key={action.name} action={action} domain={domain} />)}
      </div>
    </div>
  );
}

const createStyles = (theme: Theme) => ({
  actionsRow: {
    display: "flex",
    justifyContent: "space-between",
  } as const,
  actionsGroup: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: theme.spacing.md,
  },
  floatingContainer: {
    position: "fixed" as const,
    bottom: theme.spacing.xl,
    right: theme.spacing.xl,
    display: "flex",
    flexDirection: "column" as const,
    gap: theme.spacing.md,
    zIndex: 1000,
  },
  actionButton: {
    display: "inline-flex",
    alignItems: "center",
    padding: `${theme.spacing.md}px ${theme.spacing.xl}px`,
    borderRadius: theme.borderRadius.md,
    border: "1px solid",
    cursor: "pointer",
    background: "none",
    fontFamily: "inherit",
  } as const,
  actionButtonText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
  },
});
