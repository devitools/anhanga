import { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../../theme/context";
import type { Theme } from "../../theme/default";
import type { ColumnSelectorProps } from "../../types";

export function ColumnSelector({ availableColumns, visibleColumns, toggleColumn, domain }: ColumnSelectorProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = createStyles(theme);
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.columnSelectorContainer}>
      <Pressable style={styles.toolbarButton} onPress={() => setOpen(!open)}>
        <Feather name="columns" size={14} color={theme.colors.mutedForeground} />
        <Text style={styles.toolbarButtonText}>{t("common.table.columns")}</Text>
      </Pressable>
      {open && (
        <View style={styles.columnDropdown}>
          {availableColumns.map((col) => {
            const checked = visibleColumns.includes(col.name);
            return (
              <Pressable key={col.name} style={styles.columnOption} onPress={() => toggleColumn(col.name)}>
                <Feather name={checked ? "check-square" : "square"} size={14} color={theme.colors.foreground} />
                <Text style={styles.columnOptionText}>{t(`${domain}.fields.${col.name}`, { defaultValue: col.name })}</Text>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}

const createStyles = (theme: Theme) => StyleSheet.create({
  columnSelectorContainer: {
    position: "relative",
    zIndex: 10,
  },
  toolbarButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
  },
  toolbarButtonText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.mutedForeground,
  },
  columnDropdown: {
    position: "absolute",
    top: "100%",
    left: 0,
    marginTop: 4,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.sm,
    minWidth: 160,
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  columnOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  columnOptionText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.foreground,
  },
});
