import { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../../theme/context";
import type { Theme } from "../../theme/default";
import type { PaginationProps } from "../../types";

const PAGE_SIZE_OPTIONS = [3, 5, 10, 25, 50];

export function Pagination({ page, limit, total, totalPages, setPage, setLimit }: PaginationProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = createStyles(theme);
  const [open, setOpen] = useState(false);
  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <View style={styles.pagination}>
      <View style={styles.paginationStart}>
        <Text style={styles.pageInfo}>{t("common.table.recordsPerPage")}</Text>
        <View style={styles.pageSizeSelector}>
          <Pressable style={styles.pageSizeButton} onPress={() => setOpen(!open)}>
            <Text style={styles.pageSizeButtonText}>{limit}</Text>
            <Feather name="chevron-down" size={12} color={theme.colors.mutedForeground} />
          </Pressable>
          {open && (
            <View style={styles.pageSizeDropdown}>
              {PAGE_SIZE_OPTIONS.map((size) => (
                <Pressable
                  key={size}
                  style={[styles.pageSizeOption, size === limit && styles.pageSizeOptionActive]}
                  onPress={() => { setLimit(size); setOpen(false); }}
                >
                  <Text style={[styles.pageSizeOptionText, size === limit && styles.pageSizeOptionTextActive]}>{size}</Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>
      </View>

      <View style={styles.paginationEnd}>
        <Text style={styles.pageInfo}>{start}-{end} of {total}</Text>
        <Pressable
          style={[styles.pageArrow, page <= 1 && styles.pageArrowDisabled]}
          disabled={page <= 1}
          onPress={() => setPage(page - 1)}
        >
          <Feather name="chevron-left" size={16} color={page <= 1 ? theme.colors.mutedForeground : theme.colors.foreground} />
        </Pressable>
        <Pressable
          style={[styles.pageArrow, page >= totalPages && styles.pageArrowDisabled]}
          disabled={page >= totalPages}
          onPress={() => setPage(page + 1)}
        >
          <Feather name="chevron-right" size={16} color={page >= totalPages ? theme.colors.mutedForeground : theme.colors.foreground} />
        </Pressable>
      </View>
    </View>
  );
}

const createStyles = (theme: Theme) => StyleSheet.create({
  pagination: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: theme.spacing.lg,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  paginationStart: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  paginationEnd: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  pageSizeSelector: {
    position: "relative",
    zIndex: 10,
  },
  pageSizeButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
  },
  pageSizeButtonText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.foreground,
  },
  pageSizeDropdown: {
    position: "absolute",
    bottom: "100%",
    right: 0,
    marginBottom: 4,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 4,
    minWidth: 60,
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  pageSizeOption: {
    paddingVertical: 4,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
  },
  pageSizeOptionActive: {
    backgroundColor: theme.colors.muted,
  },
  pageSizeOptionText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.foreground,
    textAlign: "center",
  },
  pageSizeOptionTextActive: {
    fontWeight: theme.fontWeight.semibold,
  },
  pageArrow: {
    padding: 6,
    borderRadius: theme.borderRadius.sm,
  },
  pageArrowDisabled: {
    opacity: 0.4,
  },
  pageInfo: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.mutedForeground,
  },
});
