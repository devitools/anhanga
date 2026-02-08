import { useTranslation } from "react-i18next";
import type { FieldRendererProps } from "@anhanga/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function DateField({ domain, name, value, proxy, errors, onChange, onBlur, onFocus }: FieldRendererProps) {
  const { t } = useTranslation();
  if (proxy.hidden) return null;

  const fieldLabel = t(`${domain}.fields.${name}`, { defaultValue: name });
  const hasError = errors.length > 0;

  return (
    <div className="mb-2 space-y-1.5">
      <Label className={cn(hasError && "text-destructive")}>{fieldLabel}</Label>
      <Input
        type="date"
        value={String(value ?? "")}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        onFocus={onFocus}
        disabled={proxy.disabled}
        className={cn(hasError && "border-destructive focus-visible:ring-destructive")}
      />
      {errors.map((error, i) => (
        <p key={i} className="text-xs text-destructive">{error}</p>
      ))}
    </div>
  );
}
