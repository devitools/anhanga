import type { ComponentType } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../theme/context";
import type { Theme } from "../../theme/default";
import { Icon } from "../../support/Icon";
import type { EmptyStateProps } from "../../types";

export function EmptyState({ icon, title, subtitle, action }: EmptyStateProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = createStyles(theme);

  const resolvedTitle = title ?? t("common.table.empty");

  const indicatorIconName = icon ?? "inbox";
  const IndicatorIcon =
    typeof indicatorIconName !== "string"
      ? (indicatorIconName as ComponentType<{ className?: string }>)
      : null;

  return (
    <div style={styles.container}>
      {IndicatorIcon ? (
        <IndicatorIcon />
      ) : (
        <Icon name={indicatorIconName as string} size={40} color={theme.colors.mutedForeground} />
      )}
      <span style={styles.title}>{resolvedTitle}</span>
      {subtitle && <span style={styles.subtitle}>{subtitle}</span>}
      {action && (
        <button
          type="button"
          style={styles.actionButton}
          onClick={action.onPress}
        >
          {action.icon && (
            <Icon name={action.icon} size={16} color={theme.colors.primaryForeground} style={{ marginRight: theme.spacing.sm }} />
          )}
          <span style={styles.actionButtonText}>{action.label}</span>
        </button>
      )}
    </div>
  );
}

const createStyles = (theme: Theme) => ({
  container: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    padding: `${theme.spacing.xxl * 2}px 0`,
    gap: theme.spacing.sm,
  },
  title: {
    fontSize: theme.fontSize.md,
    color: theme.colors.foreground,
    marginTop: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.mutedForeground,
  },
  actionButton: {
    display: "inline-flex",
    alignItems: "center",
    marginTop: theme.spacing.md,
    padding: `${theme.spacing.md}px ${theme.spacing.xl}px`,
    borderRadius: theme.borderRadius.md,
    border: "none",
    cursor: "pointer",
    fontFamily: "inherit",
  } as const,
  actionButtonText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
  },
});
