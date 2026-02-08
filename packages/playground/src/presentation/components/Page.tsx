import type { ReactNode } from "react";
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { useTranslation } from "react-i18next";
import type { ScopeValue } from "@anhanga/core";
import { theme } from "../theme";

interface PageProps {
  domain: string
  scope: ScopeValue
  maxWidth?: number
  loading?: boolean
  children: ReactNode
}

export function Page({ domain, scope, maxWidth = 960, loading, children }: PageProps) {
  const { t } = useTranslation();

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
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

const styles = StyleSheet.create({
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
});
