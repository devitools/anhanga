import type { ReactNode } from "react";
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { useTranslation } from "react-i18next";
import { Feather } from "@expo/vector-icons";
import type { ScopeValue } from "@anhanga/core";
import { isScopePermitted } from "@anhanga/core";
import { useTheme } from "../theme/context";
import type { Theme } from "../theme/default";

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
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!permitted) {
    if (forbidden) return <>{forbidden}</>;
    return (
      <View style={styles.forbidden}>
        <Feather name="shield-off" size={32} color={theme.colors.mutedForeground} />
        <Text style={styles.forbiddenText}>{t("common.forbidden")}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
      <View style={[styles.container, { maxWidth }]}>
        <Text style={styles.title}>{t(`${domain}.title`)} / {t(`common.scopes.${scope}`)}</Text>
        {children}
      </View>
    </ScrollView>
  );
}

const createStyles = (theme: Theme) => StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    padding: theme.spacing.xl,
    paddingTop: 60,
  },
  container: {
    width: "100%",
    alignSelf: "center",
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xxl,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    marginBottom: theme.spacing.xxl,
    color: theme.colors.foreground,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  forbidden: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  forbiddenText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.mutedForeground,
  },
});
