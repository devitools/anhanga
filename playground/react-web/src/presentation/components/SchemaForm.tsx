import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Zap, RotateCcw, Check, RefreshCw, Plus, Minus } from "lucide-react";
import { useDataForm, getRenderer } from "@anhanga/react";
import type { UseDataFormOptions, ResolvedField, UseDataFormReturn, ResolvedAction } from "@anhanga/react";
import type { PositionValue } from "@anhanga/core";
import { fakeAll } from "@anhanga/demo";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SchemaFormProps extends UseDataFormOptions {
  debug?: boolean;
}

function ActionBar ({ actions, position, domain }: {
  actions: ResolvedAction[];
  position: PositionValue;
  domain: string
}) {
  const { t } = useTranslation();
  const filtered = actions.filter((a) => a.config.positions?.includes(position));
  if (filtered.length === 0) return null;

  return (
    <div className="flex gap-2 mb-4">
      {filtered.map((action) => (
        <Button
          key={action.name}
          onClick={() => action.execute()}
          variant={action.config.variant === "primary" ? "default" : action.config.variant === "destructive" ? "destructive" : "outline"}
          size="sm"
        >
          {t(`common.actions.${action.name}`, { defaultValue: t(`${domain}.actions.${action.name}`, { defaultValue: action.name }) })}
        </Button>
      ))}
    </div>
  );
}

function FieldsGrid ({ fields, getFieldProps }: {
  fields: ResolvedField[];
  getFieldProps: UseDataFormReturn["getFieldProps"];
}) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(100, 1fr)", gap: "0.5rem" }}>
      {fields.map((field) => {
        if (field.proxy.hidden) return null;
        const Renderer = getRenderer(field.config.component);
        if (!Renderer) return null;
        return (
          <div
            key={field.name}
            style={{ gridColumn: `span ${field.proxy.width}` }}
          >
            <Renderer {...getFieldProps(field.name)} />
          </div>
        );
      })}
    </div>
  );
}

export function SchemaForm ({ debug = true, ...props }: SchemaFormProps) {
  const { t } = useTranslation();
  const form = useDataForm({ ...props, translate: props.translate ?? t });
  const [debugExpanded, setDebugExpanded] = useState(false);

  const handleFill = useCallback(() => {
    const fakeData = fakeAll(props.schema.fields, props.schema.identity);
    form.setValues(fakeData);
  }, [props.schema.fields, props.schema.identity, form]);

  if (form.loading) {
    return <div className="text-center py-8 text-muted-foreground">Loading...</div>;
  }

  return (
    <div>
      <ActionBar
        actions={form.actions}
        position="top"
        domain={props.schema.domain}
      />

      {form.sections.map((section, index) => {
        if (section.kind === "group") {
          return (
            <div key={section.name} className="mb-6">
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                {t(`${props.schema.domain}.groups.${section.name}`, { defaultValue: section.name })}
              </h3>
              <FieldsGrid
                fields={section.fields}
                getFieldProps={form.getFieldProps}
              />
            </div>
          );
        }
        return (
          <div key={`ungrouped-${index}`} className="mb-6">
            <FieldsGrid
              fields={section.fields}
              getFieldProps={form.getFieldProps}
            />
          </div>
        );
      })}

      <Separator className="my-6" />

      <ActionBar
        actions={form.actions}
        position="footer"
        domain={props.schema.domain}
      />

      {debug && (
        <div className="mt-8 p-4 bg-foreground rounded-lg">
          <TooltipProvider>
            <div className="flex gap-1.5 mb-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="secondary" size="icon" className="h-8 w-8 bg-gray-700 hover:bg-gray-600 border-0" onClick={handleFill}>
                    <Zap className="h-3.5 w-3.5 text-amber-400" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Fill with fake data</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="secondary" size="icon" className="h-8 w-8 bg-gray-700 hover:bg-gray-600 border-0" onClick={() => form.reset()}>
                    <RotateCcw className="h-3.5 w-3.5 text-gray-400" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Reset form</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="secondary" size="icon" className="h-8 w-8 bg-gray-700 hover:bg-gray-600 border-0" onClick={() => form.validate()}>
                    <Check className="h-3.5 w-3.5 text-green-500" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Validate</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="secondary" size="icon" className="h-8 w-8 bg-gray-700 hover:bg-gray-600 border-0" onClick={() => window.location.reload()}>
                    <RefreshCw className="h-3.5 w-3.5 text-blue-500" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Reload page</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="secondary" size="icon" className="h-8 w-8 bg-gray-700 hover:bg-gray-600 border-0" onClick={() => setDebugExpanded((v) => !v)}>
                    {debugExpanded
                      ? <Minus className="h-3.5 w-3.5 text-amber-400" />
                      : <Plus className="h-3.5 w-3.5 text-amber-400" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Toggle details</TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>

          {debugExpanded && (
            <>
              <p className="text-[0.675rem] font-bold text-gray-400 mt-2.5 mb-0.5">State</p>
              <pre className="text-[0.675rem] font-mono text-gray-200 whitespace-pre-wrap">
                {JSON.stringify(form.state, null, 2)}
              </pre>
              <p className="text-[0.675rem] font-bold text-gray-400 mt-2.5 mb-0.5">Errors</p>
              <pre className="text-[0.675rem] font-mono text-gray-200 whitespace-pre-wrap">
                {JSON.stringify(form.errors, null, 2)}
              </pre>
              <p className="text-[0.675rem] text-gray-400 mt-2.5">
                dirty: {String(form.dirty)} | valid: {String(form.valid)}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
