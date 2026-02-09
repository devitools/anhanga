import type { CSSProperties } from "react";

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  style?: CSSProperties;
}

const paths: Record<string, string> = {
  "chevron-up": "M18 15l-6-6-6 6",
  "chevron-down": "M6 9l6 6 6-6",
  "chevron-left": "M15 18l-6-6 6-6",
  "chevron-right": "M9 18l6-6-6-6",
  "check-square": "M9 11l3 3L22 4 M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11",
  "square": "M3 3h18v18H3z",
  "columns": "M12 3h7a2 2 0 012 2v14a2 2 0 01-2 2h-7m0-18H5a2 2 0 00-2 2v14a2 2 0 002 2h7m0-18v18",
  "inbox": "M22 12h-6l-2 3h-4l-2-3H2 M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z",
  "plus": "M12 5v14M5 12h14",
  "minus": "M5 12h14",
  "zap": "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  "rotate-ccw": "M1 4v6h6 M3.51 15a9 9 0 102.13-9.36L1 10",
  "check": "M20 6L9 17l-5-5",
  "refresh-cw": "M23 4v6h-6M1 20v-6h6 M3.51 9a9 9 0 0114.85-3.36L23 10 M20.49 15a9 9 0 01-14.85 3.36L1 14",
  "x-square": "M9 9l6 6m0-6l-6 6 M3 3h18v18H3z",
  "filter": "M22 3H2l8 9.46V19l4 2v-8.54L22 3z",
  "eye": "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 100 6 3 3 0 000-6z",
  "save": "M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z M17 21v-8H7v8 M7 3v5h8",
  "x": "M18 6L6 18 M6 6l12 12",
  "trash-2": "M3 6h18 M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2 M10 11v6 M14 11v6",
  "send": "M22 2L11 13 M22 2l-7 20-4-9-9-4 20-7z",
  "edit-2": "M17 3a2.83 2.83 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z",
  "search": "M11 3a8 8 0 100 16 8 8 0 000-16z M21 21l-4.35-4.35",
  "list": "M8 6h13 M8 12h13 M8 18h13 M3 6h.01 M3 12h.01 M3 18h.01",
  "user": "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 3a4 4 0 100 8 4 4 0 000-8z",
  "map-pin": "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z M12 7a3 3 0 100 6 3 3 0 000-6z",
};

export function Icon({ name, size = 16, color = "currentColor", style }: IconProps) {
  const d = paths[name];
  if (!d) return null;

  const needsFill = name === "square" || name === "x-square";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={needsFill ? "none" : "none"}
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
    >
      {d.split(" M").map((segment, i) => (
        <path key={i} d={i === 0 ? segment : `M${segment}`} />
      ))}
    </svg>
  );
}
