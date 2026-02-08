import { useTranslation } from "react-i18next";
import type { FieldRendererProps } from "@anhanga/react";

export function ToggleField({ domain, name, value, proxy, onChange }: FieldRendererProps) {
  const { t } = useTranslation();
  if (proxy.hidden) return null;

  const isOn = Boolean(value);

  return (
    <div style={{ marginBottom: "0.5rem" }}>
      <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.25rem" }}>
        {t(`${domain}.fields.${name}`, { defaultValue: name })}
      </label>
      <label style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", cursor: proxy.disabled ? "not-allowed" : "pointer" }}>
        <input
          type="checkbox"
          checked={isOn}
          onChange={() => !proxy.disabled && onChange(!isOn)}
          disabled={proxy.disabled}
          style={{ width: 18, height: 18 }}
        />
        <span style={{ fontSize: "0.875rem", color: proxy.disabled ? "#9ca3af" : "#111827" }}>
          {isOn ? "Sim" : "Não"}
        </span>
      </label>
    </div>
  );
}
