import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../theme/context";
import type { Theme } from "../../theme/default";
import { Icon } from "../../support/Icon";
import type { ColumnSelectorProps } from "../../types";

export function ColumnSelector({ availableColumns, visibleColumns, toggleColumn, domain }: ColumnSelectorProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = createStyles(theme);
  const [open, setOpen] = useState(false);

  const handleClickOutside = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (open) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [open, handleClickOutside]);

  return (
    <div style={styles.container}>
      <button
        type="button"
        style={styles.toolbarButton}
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
      >
        <Icon name="columns" size={14} color={theme.colors.mutedForeground} />
        <span style={styles.toolbarButtonText}>{t("common.table.columns")}</span>
      </button>
      {open && (
        <div style={styles.dropdown} onClick={(e) => e.stopPropagation()}>
          {availableColumns.map((col) => {
            const checked = visibleColumns.includes(col.name);
            return (
              <button
                type="button"
                key={col.name}
                style={styles.option}
                onClick={() => toggleColumn(col.name)}
              >
                <Icon name={checked ? "check-square" : "square"} size={14} color={theme.colors.foreground} />
                <span style={styles.optionText}>{t(`${domain}.fields.${col.name}`, { defaultValue: col.name })}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

const createStyles = (theme: Theme) => ({
  container: {
    position: "relative" as const,
    zIndex: 10,
  },
  toolbarButton: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: `${theme.spacing.sm}px ${theme.spacing.md}px`,
    borderRadius: theme.borderRadius.sm,
    border: `1px solid ${theme.colors.border}`,
    backgroundColor: theme.colors.card,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  toolbarButtonText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.mutedForeground,
  },
  dropdown: {
    position: "absolute" as const,
    top: "100%",
    left: 0,
    marginTop: 4,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    border: `1px solid ${theme.colors.border}`,
    padding: theme.spacing.sm,
    minWidth: 160,
    zIndex: 10,
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  option: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    width: "100%",
    padding: "6px 8px",
    border: "none",
    background: "none",
    cursor: "pointer",
    fontFamily: "inherit",
  } as const,
  optionText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.foreground,
  },
});
