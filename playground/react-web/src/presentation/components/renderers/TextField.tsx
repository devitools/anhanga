import { useTranslation } from "react-i18next";
import type { FieldRendererProps } from "@anhanga/react";

export function TextField({ domain, name, value, proxy, errors, onChange, onBlur, onFocus }: FieldRendererProps) {
  const { t, i18n } = useTranslation();
  if (proxy.hidden) return null;

  const fieldLabel = t(`${domain}.fields.${name}`, { defaultValue: name });
  const placeholderKey = `${domain}.fields.${name}.placeholder`;
  const placeholder = i18n.exists(placeholderKey) ? t(placeholderKey) : undefined;

  return (
    <div style={{ marginBottom: "0.5rem" }}>
      <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.25rem" }}>
        {fieldLabel}
      </label>
      <input
        type="text"
        value={String(value ?? "")}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        onFocus={onFocus}
        disabled={proxy.disabled}
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: "0.5rem 0.75rem",
          border: `1px solid ${errors.length > 0 ? "#ef4444" : "#d1d5db"}`,
          borderRadius: 6,
          fontSize: "0.875rem",
          boxSizing: "border-box",
          backgroundColor: proxy.disabled ? "#f3f4f6" : "#fff",
        }}
      />
      {errors.map((error, i) => (
        <div key={i} style={{ fontSize: "0.75rem", color: "#ef4444", marginTop: 2 }}>{error}</div>
      ))}
    </div>
  );
}
