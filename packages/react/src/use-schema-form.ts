import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import type { FieldProxy, FieldConfig, ScopeValue, TranslateContract } from "@anhanga/core";
import { createStateProxy, createSchemaProxy } from "./proxy";
import { validateField, validateAllFields } from "./validation";
import type {
  UseSchemaFormOptions,
  UseSchemaFormReturn,
  ResolvedField,
  FieldGroup,
  FormSection,
  ResolvedAction,
  FieldRendererProps,
} from "./types";

function buildInitialState (
  fields: Record<string, FieldConfig>,
  initialValues?: Record<string, unknown>,
): Record<string, unknown> {
  const state: Record<string, unknown> = {};
  for (const [name, config] of Object.entries(fields)) {
    state[name] = initialValues?.[name] ?? config.defaultValue ?? undefined;
  }
  return state;
}

function isFieldInScope (config: FieldConfig, scope: ScopeValue): boolean {
  if (config.scopes === null) return true;
  return config.scopes.includes(scope);
}

function isActionInScope (config: { scopes: ScopeValue[] | null }, scope: ScopeValue): boolean {
  if (config.scopes === null) return true;
  return config.scopes.includes(scope);
}

export function useSchemaForm (options: UseSchemaFormOptions): UseSchemaFormReturn {
  const { schema, scope, events, handlers, hooks, context, component, initialValues, translate } = options;
  const t: TranslateContract = translate ?? ((key) => key);

  const [state, setState] = useState<Record<string, unknown>>(() =>
    buildInitialState(schema.fields, initialValues),
  );
  const [fieldOverrides, setFieldOverrides] = useState<Record<string, Partial<FieldProxy>>>({});
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const initialStateRef = useRef(buildInitialState(schema.fields, initialValues));
  const [loading, setLoading] = useState(() => !!hooks?.bootstrap?.[scope]);

  useEffect(() => {
    const hook = hooks?.bootstrap?.[scope];
    if (!hook) return;

    const run = async () => {
      let hydratedData: Record<string, unknown> | undefined;
      const schemaResult = createSchemaProxy(schema.fields, {});
      const hydrate = (data: Record<string, unknown>) => { hydratedData = data; };

      await hook({ context: context ?? {}, hydrate, schema: schemaResult.proxy, component });

      if (hydratedData) {
        const newState = buildInitialState(schema.fields, hydratedData);
        setState(newState);
        initialStateRef.current = newState;
      }

      const overrides = schemaResult.getOverrides();
      if (Object.keys(overrides).length > 0) {
        setFieldOverrides(overrides);
      }

      setLoading(false);
    };

    run();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scopedFields = useMemo(() => {
    const result: Record<string, FieldConfig> = {};
    for (const [name, config] of Object.entries(schema.fields)) {
      if (isFieldInScope(config, scope)) {
        result[name] = config;
      }
    }
    return result;
  }, [schema.fields, scope]);

  const getProxy = useCallback(
    (name: string): FieldProxy => {
      const config = schema.fields[name];
      if (!config) {
        return { width: 100, height: 1, hidden: false, disabled: false, state: "" };
      }
      const override = fieldOverrides[name];
      return {
        width: override?.width ?? config.form.width,
        height: override?.height ?? config.form.height,
        hidden: override?.hidden ?? config.form.hidden,
        disabled: override?.disabled ?? config.form.disabled,
        state: override?.state ?? "",
      };
    },
    [schema.fields, fieldOverrides],
  );

  const resolvedFields = useMemo((): ResolvedField[] => {
    return Object.entries(scopedFields)
      .map(([name, config]) => ({
        name,
        config,
        proxy: getProxy(name),
      }))
      .sort((a, b) => a.config.form.order - b.config.form.order);
  }, [scopedFields, getProxy]);

  const groups = useMemo((): FieldGroup[] => {
    const groupMap: Record<string, ResolvedField[]> = {};
    for (const field of resolvedFields) {
      const groupName = field.config.group;
      if (groupName && schema.groups[groupName]) {
        if (!groupMap[groupName]) groupMap[groupName] = [];
        groupMap[groupName].push(field);
      }
    }
    return Object.entries(schema.groups)
      .filter(([name]) => groupMap[name]?.length)
      .map(([name, config]) => ({
        name,
        config,
        fields: groupMap[name],
      }));
  }, [resolvedFields, schema.groups]);

  const ungrouped = useMemo((): ResolvedField[] => {
    return resolvedFields.filter((f) => !f.config.group);
  }, [resolvedFields]);

  const sections = useMemo((): FormSection[] => {
    const result: FormSection[] = [];
    const emittedGroups = new Set<string>();
    let currentUngrouped: ResolvedField[] = [];

    for (const field of resolvedFields) {
      const groupName = field.config.group;
      if (groupName && schema.groups[groupName]) {
        if (currentUngrouped.length > 0) {
          result.push({ kind: "ungrouped", fields: currentUngrouped });
          currentUngrouped = [];
        }
        if (!emittedGroups.has(groupName)) {
          emittedGroups.add(groupName);
          const group = groups.find((g) => g.name === groupName);
          if (group) {
            result.push({ kind: "group", name: group.name, config: group.config, fields: group.fields });
          }
        }
      } else {
        currentUngrouped.push(field);
      }
    }

    if (currentUngrouped.length > 0) {
      result.push({ kind: "ungrouped", fields: currentUngrouped });
    }

    return result;
  }, [resolvedFields, groups, schema.groups]);

  const fireEvent = useCallback(
    (fieldName: string, eventName: string, nextState: Record<string, unknown>) => {
      const handler = events?.[fieldName]?.[eventName];
      if (!handler) return nextState;

      const stateResult = createStateProxy(nextState);
      const schemaResult = createSchemaProxy(schema.fields, fieldOverrides);

      handler({ state: stateResult.proxy, schema: schemaResult.proxy });

      const stateChanges = stateResult.getChanges();
      const schemaOverrides = schemaResult.getOverrides();

      const mergedState = { ...nextState, ...stateChanges };

      if (Object.keys(stateChanges).length > 0) {
        setState(mergedState);
      }

      if (Object.keys(schemaOverrides).length > 0) {
        setFieldOverrides((prev) => {
          const next = { ...prev };
          for (const [name, overrides] of Object.entries(schemaOverrides)) {
            next[name] = { ...next[name], ...overrides };
          }
          return next;
        });
      }

      return mergedState;
    },
    [events, schema.fields, fieldOverrides],
  );

  const setValue = useCallback(
    (field: string, value: unknown) => {
      const nextState = { ...state, [field]: value };
      setState(nextState);

      const config = schema.fields[field];
      if (config) {
        const fieldErrors = validateField(value, config.validations, t);
        setErrors((prev) => {
          const next = { ...prev };
          if (fieldErrors.length > 0) {
            next[field] = fieldErrors;
          } else {
            delete next[field];
          }
          return next;
        });
      }

      fireEvent(field, "change", nextState);
    },
    [state, schema.fields, fireEvent, t],
  );

  const setValues = useCallback(
    (values: Record<string, unknown>) => {
      const nextState = { ...state, ...values };
      setState(nextState);
    },
    [state],
  );

  const reset = useCallback(
    (values?: Record<string, unknown>) => {
      const nextState = values ?? initialStateRef.current;
      setState(nextState);
      setErrors({});
      setFieldOverrides({});
    },
    [],
  );

  const validate = useCallback((): boolean => {
    const allErrors = validateAllFields(state, scopedFields, t);
    setErrors(allErrors);
    return Object.keys(allErrors).length === 0;
  }, [state, scopedFields, t]);

  const dirty = useMemo(() => {
    const initial = initialStateRef.current;
    for (const key of Object.keys(state)) {
      if (state[key] !== initial[key]) return true;
    }
    return false;
  }, [state]);

  const valid = useMemo(() => Object.keys(errors).length === 0, [errors]);

  const formRef = useRef({ validate, reset, setValues, errors });
  formRef.current = { validate, reset, setValues, errors };

  const actions = useMemo((): ResolvedAction[] => {
    return Object.entries(schema.actions)
      .filter(([, config]) => !config.hidden && isActionInScope(config, scope))
      .sort(([, a], [, b]) => a.order - b.order)
      .map(([name, config]) => ({
        name,
        config,
        execute: async () => {
          const handler = handlers?.[name];
          if (!handler) return;
          await handler({
            state: { ...state },
            component,
            form: {
              errors,
              dirty,
              valid,
              reset,
              validate
            },
          });
        },
      }));
  }, [schema.actions, scope, handlers, state, component]);

  const getFieldProps = useCallback(
    (name: string): FieldRendererProps => {
      const config = schema.fields[name];
      const proxy = getProxy(name);
      return {
        domain: schema.domain,
        name,
        value: state[name],
        config,
        proxy,
        errors: errors[name] ?? [],
        scope,
        onChange (value: unknown) {
          setValue(name, value);
        },
        onBlur () {
          fireEvent(name, "blur", state);
        },
        onFocus () {
          fireEvent(name, "focus", state);
        },
      };
    },
    [schema.fields, schema.domain, state, errors, scope, getProxy, setValue, fireEvent],
  );

  return {
    loading,
    state,
    fields: resolvedFields,
    groups,
    ungrouped,
    sections,
    actions,
    errors,
    dirty,
    valid,
    setValue,
    setValues,
    reset,
    validate,
    getFieldProps,
  };
}
