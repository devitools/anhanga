import { View, Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../../theme/context";
import type { Theme } from "../../theme/default";

export function EmptyState() {
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.emptyContainer}>
      <Feather name="inbox" size={32} color={theme.colors.mutedForeground} />
      <Text style={styles.emptyText}>{t("common.table.empty")}</Text>
    </View>
  );
}

const createStyles = (theme: Theme) => StyleSheet.create({
  emptyContainer: {
    paddingVertical: theme.spacing.xxl,
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  emptyText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.mutedForeground,
  },
});
