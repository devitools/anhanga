import { useTranslation } from "react-i18next";
import type { FieldRendererProps } from "@anhanga/react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function ToggleField({ domain, name, value, proxy, onChange }: FieldRendererProps) {
  const { t } = useTranslation();
  if (proxy.hidden) return null;

  const isOn = Boolean(value);

  return (
    <div className="mb-2 space-y-1.5">
      <Label>{t(`${domain}.fields.${name}`, { defaultValue: name })}</Label>
      <div className="flex items-center gap-2">
        <Switch
          checked={isOn}
          onCheckedChange={(checked) => onChange(checked)}
          disabled={proxy.disabled}
        />
        <span className="text-sm text-muted-foreground">
          {isOn ? "Sim" : "Não"}
        </span>
      </div>
    </div>
  );
}
