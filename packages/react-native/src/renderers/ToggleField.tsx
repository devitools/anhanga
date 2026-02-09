import { useRef, useEffect } from "react";
import { View, Text, Pressable, Animated, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import type { FieldRendererProps } from "@anhanga/react";
import { useTheme } from "../theme/context";
import type { Theme } from "../theme/default";
import { ds } from "../support/ds";

const TRACK_WIDTH = 44;
const TRACK_HEIGHT = 22;
const THUMB_SIZE = 28;
const THUMB_OFFSET = (THUMB_SIZE - TRACK_HEIGHT) / 2;
const THUMB_OFF = -THUMB_OFFSET;
const THUMB_ON = TRACK_WIDTH - THUMB_SIZE + THUMB_OFFSET;

export function ToggleField({ domain, name, value, proxy, onChange }: FieldRendererProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = createStyles(theme);
  const isOn = Boolean(value);
  const offset = useRef(new Animated.Value(isOn ? THUMB_ON : THUMB_OFF)).current;

  useEffect(() => {
    Animated.spring(offset, {
      toValue: isOn ? THUMB_ON : THUMB_OFF,
      useNativeDriver: false,
      bounciness: 4,
      speed: 16,
    }).start();
  }, [isOn, offset]);

  if (proxy.hidden) return null;

  return (
    <View style={styles.container} {...ds(`ToggleField:${name}`)}>
      <Text style={styles.label}>{t(`${domain}.fields.${name}`, { defaultValue: name })}</Text>
      <View style={styles.row}>
        <Pressable
          onPress={() => !proxy.disabled && onChange?.(!isOn)}
          style={[
            styles.track,
            isOn ? styles.trackOn : styles.trackOff,
            proxy.disabled && styles.trackDisabled,
          ]}
        >
          <Animated.View
            style={[
              styles.thumb,
              isOn ? styles.thumbOn : styles.thumbOff,
              { transform: [{ translateX: offset }] },
            ]}
          />
        </Pressable>
      </View>
    </View>
  );
}

const createStyles = (theme: Theme) => StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.xs,
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    marginBottom: theme.spacing.xs,
    color: theme.colors.foreground,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
  },
  track: {
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    justifyContent: "center",
  },
  trackOn: {
    backgroundColor: theme.colors.primary + "4D",
  },
  trackOff: {
    backgroundColor: theme.colors.border,
  },
  trackDisabled: {
    opacity: 0.5,
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
  },
  thumbOn: {
    backgroundColor: theme.colors.primary,
  },
  thumbOff: {
    backgroundColor: theme.colors.mutedForeground,
  },
});
