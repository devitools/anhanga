import { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../../theme/context";
import type { Theme } from "../../theme/default";
import { ds } from "../../support/ds";

interface DebugAction {
  icon: string;
  color: string;
  onPress: () => void;
}

interface DebugEntry {
  title: string;
  content: string;
}

interface DebugPanelProps {
  actions: DebugAction[];
  entries: DebugEntry[];
  meta?: string;
}

export function DebugPanel({ actions, entries, meta }: DebugPanelProps) {
  const theme = useTheme();
  const styles = createStyles(theme);
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.debugSection} {...ds("debug")}>
      <View style={styles.debugToolbar}>
        <View style={styles.debugActions}>
          {actions.map((action, i) => (
            <Pressable key={i} style={styles.debugButton} onPress={action.onPress}>
              <Feather name={action.icon as any} size={12} color={action.color} />
            </Pressable>
          ))}
          <Pressable style={styles.debugButton} onPress={() => setExpanded((v) => !v)}>
            <Feather name={expanded ? "minus" : "plus"} size={12} color={theme.colors.warning} />
          </Pressable>
        </View>
      </View>

      {expanded && (
        <>
          {entries.map((entry, i) => (
            <View key={i}>
              <Text style={styles.debugTitle}>{entry.title}</Text>
              <Text style={styles.debugText}>{entry.content}</Text>
            </View>
          ))}
          {meta && <Text style={styles.debugMeta}>{meta}</Text>}
        </>
      )}
    </View>
  );
}

const createStyles = (theme: Theme) => StyleSheet.create({
  debugSection: {
    marginTop: theme.spacing.xxl,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.foreground,
    borderRadius: theme.borderRadius.md,
  },
  debugToolbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  debugActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  debugButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: "#374151",
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
  },
  debugMeta: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.mutedForeground,
    marginTop: 10,
  },
});
