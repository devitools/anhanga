import type { FieldConfig, ScopeValue } from "./types";

export function buildInitialState (
  fields: Record<string, FieldConfig>,
  initialValues?: Record<string, unknown>,
): Record<string, unknown> {
  const state: Record<string, unknown> = {};
  for (const [name, config] of Object.entries(fields)) {
    state[name] = initialValues?.[name] ?? config.defaultValue ?? undefined;
  }
  return state;
}

export function isInScope (config: { scopes: ScopeValue[] | null }, scope: ScopeValue): boolean {
  if (config.scopes === null) return true;
  return config.scopes.includes(scope);
}
