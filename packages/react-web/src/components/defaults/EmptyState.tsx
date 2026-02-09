import { useTranslation } from "react-i18next";
import { useTheme } from "../../theme/context";
import type { Theme } from "../../theme/default";
import { Icon } from "../../support/Icon";

export function EmptyState() {
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <div style={styles.container}>
      <Icon name="inbox" size={32} color={theme.colors.mutedForeground} />
      <span style={styles.text}>{t("common.table.empty")}</span>
    </div>
  );
}

const createStyles = (theme: Theme) => ({
  container: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    padding: `${theme.spacing.xxl}px 0`,
    gap: theme.spacing.sm,
  },
  text: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.mutedForeground,
  },
});
