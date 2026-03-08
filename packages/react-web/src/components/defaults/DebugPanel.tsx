import { useState } from "react";
import { useTheme } from "../../theme/context";
import type { Theme } from "../../theme/default";
import { Icon } from "../../support/Icon";
import { ds } from "../../support/ds";

interface DebugAction {
  icon: string;
  color: string;
  onPress: () => void;
}

interface DebugEntry {
  title: string;
  content: string;
  collapsed?: boolean;
}

interface DebugPanelProps {
  actions: DebugAction[];
  entries: DebugEntry[];
  meta?: string;
}

function CollapsibleEntry({ entry, styles, theme }: { entry: DebugEntry; styles: ReturnType<typeof createStyles>; theme: Theme }) {
  const [open, setOpen] = useState(!entry.collapsed);
  return (
    <div>
      <div
        style={{ ...styles.debugTitle, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
        onClick={() => setOpen((v) => !v)}
      >
        <Icon name={open ? "chevron-down" : "chevron-right"} size={10} color={theme.colors.mutedForeground} />
        {entry.title}
      </div>
      {open && <pre style={styles.debugText}>{entry.content}</pre>}
    </div>
  );
}

export function DebugPanel({ actions, entries, meta }: DebugPanelProps) {
  const theme = useTheme();
  const styles = createStyles(theme);
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={styles.debugSection} {...ds("debug")}>
      <div style={styles.debugToolbar}>
        <div style={styles.debugActions}>
          {actions.map((action, i) => (
            <button type="button" key={i} style={styles.debugButton} onClick={action.onPress}>
              <Icon name={action.icon} size={12} color={action.color} />
            </button>
          ))}
          <button type="button" style={styles.debugButton} onClick={() => setExpanded((v) => !v)}>
            <Icon name={expanded ? "minus" : "plus"} size={12} color={theme.colors.warning} />
          </button>
        </div>
      </div>

      {expanded && (
        <>
          {entries.map((entry, i) => (
            <CollapsibleEntry key={i} entry={entry} styles={styles} theme={theme} />
          ))}
          {meta && <div style={styles.debugMeta}>{meta}</div>}
        </>
      )}
    </div>
  );
}

const createStyles = (theme: Theme) => ({
  debugSection: {
    marginTop: theme.spacing.xxl,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.foreground,
    borderRadius: theme.borderRadius.md,
  },
  debugToolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap" as const,
    gap: theme.spacing.sm,
  },
  debugActions: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: 6,
  },
  debugButton: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    padding: "5px 10px",
    borderRadius: theme.borderRadius.sm,
    backgroundColor: "#374151",
    border: "none",
    cursor: "pointer",
  },
  debugTitle: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.mutedForeground,
    marginBottom: 2,
    marginTop: 10,
  },
  debugText: {
    fontSize: theme.fontSize.xs,
    fontFamily: "monospace",
    color: theme.colors.border,
    whiteSpace: "pre-wrap" as const,
    margin: 0,
  },
  debugMeta: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.mutedForeground,
    marginTop: 10,
  },
});
