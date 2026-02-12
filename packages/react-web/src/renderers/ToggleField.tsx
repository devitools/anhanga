import { useTranslation } from "react-i18next";
import type { FieldRendererProps } from "@ybyra/react";
import { useTheme } from "../theme/context";
import type { Theme } from "../theme/default";
import { ds } from "../support/ds";

const TRACK_WIDTH = 44;
const TRACK_HEIGHT = 22;
const THUMB_SIZE = 18;

export function ToggleField({ domain, name, value, proxy, onChange }: FieldRendererProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = createStyles(theme);
  const isOn = Boolean(value);
  if (proxy.hidden) return null;

  return (
    <div style={styles.container} {...ds(`ToggleField:${name}`)}>
      <label style={styles.label}>{t(`${domain}.fields.${name}`, { defaultValue: name })}</label>
      <div style={styles.row}>
        <button
          type="button"
          style={{
            ...styles.track,
            ...(isOn ? styles.trackOn : styles.trackOff),
            ...(proxy.disabled ? styles.trackDisabled : {}),
          }}
          onClick={() => !proxy.disabled && onChange?.(!isOn)}
        >
          <span
            style={{
              ...styles.thumb,
              ...(isOn ? styles.thumbOn : styles.thumbOff),
            }}
          />
        </button>
      </div>
    </div>
  );
}

const createStyles = (theme: Theme) => ({
  container: {
    padding: `0 ${theme.spacing.xs}px`,
    marginBottom: theme.spacing.md,
  },
  label: {
    display: "block",
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    marginBottom: theme.spacing.xs,
    color: theme.colors.foreground,
  },
  row: {
    display: "flex",
    alignItems: "center",
    padding: `${theme.spacing.sm}px 0`,
  },
  track: {
    position: "relative" as const,
    display: "inline-flex",
    alignItems: "center",
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    border: "none",
    cursor: "pointer",
    padding: 2,
    transition: "background-color 0.2s ease",
  },
  trackOn: {
    backgroundColor: theme.colors.primary,
  },
  trackOff: {
    backgroundColor: theme.colors.border,
  },
  trackDisabled: {
    opacity: 0.5,
    cursor: "default",
  },
  thumb: {
    display: "block",
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: "50%",
    transition: "transform 0.2s ease",
  } as const,
  thumbOn: {
    backgroundColor: theme.colors.primaryForeground,
    transform: `translateX(${TRACK_WIDTH - THUMB_SIZE - 4}px)`,
  },
  thumbOff: {
    backgroundColor: theme.colors.card,
    transform: "translateX(0px)",
  },
});
