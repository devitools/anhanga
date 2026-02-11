import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import type { ScopeValue } from "@anhanga/core";
import { isScopePermitted } from "@anhanga/core";
import { useTheme } from "../theme/context";
import type { Theme } from "../theme/default";
import { Icon } from "../support/Icon";

interface PageProps {
  domain: string;
  scope: ScopeValue;
  maxWidth?: number;
  loading?: boolean;
  permissions?: string[];
  forbidden?: ReactNode;
  children: ReactNode;
}

export function DataPage({ domain, scope, maxWidth = 960, loading, permissions, forbidden, children }: PageProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = createStyles(theme);
  const permitted = !permissions || isScopePermitted(domain, scope, permissions);

  if (loading) {
    return (
      <div style={styles.loading}>Loading...</div>
    );
  }

  if (!permitted) {
    if (forbidden) return <>{forbidden}</>;
    return (
      <div style={styles.forbidden}>
        <Icon name="shield-off" size={32} color={theme.colors.mutedForeground} />
        <div style={styles.forbiddenText}>{t("common.forbidden")}</div>
      </div>
    );
  }

  return (
    <div style={styles.scroll}>
      <div style={{ ...styles.container, maxWidth }}>
        <div style={styles.title}>{t(`${domain}.title`)} / {t(`common.scopes.${scope}`)}</div>
        {children}
      </div>
    </div>
  );
}

const createStyles = (theme: Theme) => ({
  scroll: {
    minHeight: "100vh",
    backgroundColor: theme.colors.background,
    padding: theme.spacing.xl,
    paddingTop: 60,
  },
  container: {
    width: "100%",
    margin: "0 auto",
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xxl,
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  },
  title: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    marginBottom: theme.spacing.xxl,
    color: theme.colors.foreground,
  },
  loading: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    color: theme.colors.mutedForeground,
  },
  forbidden: {
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    gap: 8,
  },
  forbiddenText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.mutedForeground,
  },
});
