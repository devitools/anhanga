import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../theme/context";
import type { Theme } from "../../theme/default";
import { Icon } from "../../support/Icon";
import type { PaginationProps } from "../../types";

const PAGE_SIZE_OPTIONS = [3, 5, 10, 25, 50];

export function Pagination({ page, limit, total, totalPages, setPage, setLimit }: PaginationProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = createStyles(theme);
  const [open, setOpen] = useState(false);
  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  const handleClickOutside = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (open) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [open, handleClickOutside]);

  return (
    <div style={styles.pagination}>
      <div style={styles.paginationStart}>
        <span style={styles.pageInfo}>{t("common.table.recordsPerPage")}</span>
        <div style={styles.pageSizeSelector}>
          <button
            type="button"
            style={styles.pageSizeButton}
            onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
          >
            <span style={styles.pageSizeButtonText}>{limit}</span>
            <Icon name="chevron-down" size={12} color={theme.colors.mutedForeground} />
          </button>
          {open && (
            <div style={styles.pageSizeDropdown} onClick={(e) => e.stopPropagation()}>
              {PAGE_SIZE_OPTIONS.map((size) => (
                <button
                  type="button"
                  key={size}
                  style={{ ...styles.pageSizeOption, ...(size === limit ? styles.pageSizeOptionActive : {}) }}
                  onClick={() => { setLimit(size); setOpen(false); }}
                >
                  <span style={{ ...styles.pageSizeOptionText, ...(size === limit ? styles.pageSizeOptionTextActive : {}) }}>
                    {size}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={styles.paginationEnd}>
        <span style={styles.pageInfo}>{start}-{end} of {total}</span>
        <button
          type="button"
          style={{ ...styles.pageArrow, ...(page <= 1 ? styles.pageArrowDisabled : {}) }}
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
        >
          <Icon name="chevron-left" size={16} color={page <= 1 ? theme.colors.mutedForeground : theme.colors.foreground} />
        </button>
        <button
          type="button"
          style={{ ...styles.pageArrow, ...(page >= totalPages ? styles.pageArrowDisabled : {}) }}
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
        >
          <Icon name="chevron-right" size={16} color={page >= totalPages ? theme.colors.mutedForeground : theme.colors.foreground} />
        </button>
      </div>
    </div>
  );
}

const createStyles = (theme: Theme) => ({
  pagination: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: theme.spacing.lg,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  paginationStart: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  paginationEnd: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  pageSizeSelector: {
    position: "relative" as const,
    zIndex: 10,
  },
  pageSizeButton: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    padding: `4px ${theme.spacing.sm}px`,
    borderRadius: theme.borderRadius.sm,
    border: `1px solid ${theme.colors.border}`,
    backgroundColor: theme.colors.card,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  pageSizeButtonText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.foreground,
  },
  pageSizeDropdown: {
    position: "absolute" as const,
    bottom: "100%",
    right: 0,
    marginBottom: 4,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.sm,
    border: `1px solid ${theme.colors.border}`,
    padding: 4,
    minWidth: 60,
    zIndex: 10,
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  pageSizeOption: {
    display: "block",
    width: "100%",
    padding: `4px ${theme.spacing.sm}px`,
    borderRadius: theme.borderRadius.sm,
    border: "none",
    background: "none",
    cursor: "pointer",
    fontFamily: "inherit",
  } as const,
  pageSizeOptionActive: {
    backgroundColor: theme.colors.muted,
  },
  pageSizeOptionText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.foreground,
    textAlign: "center" as const,
  },
  pageSizeOptionTextActive: {
    fontWeight: theme.fontWeight.semibold,
  },
  pageArrow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 6,
    borderRadius: theme.borderRadius.sm,
    border: "none",
    background: "none",
    cursor: "pointer",
  },
  pageArrowDisabled: {
    opacity: 0.4,
    cursor: "default",
  },
  pageInfo: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.mutedForeground,
  },
});
