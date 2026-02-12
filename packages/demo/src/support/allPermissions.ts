import type { SchemaProvide } from "@ybyra/core";

export function allPermissions (schema: SchemaProvide): string[] {
  const scopePermissions = schema.scopes.map((scope) => `${schema.domain}.scope.${scope}`);
  const actionPermissions = Object.entries(schema.actions)
    .filter(([, config]) => !config.open)
    .map(([name]) => `${schema.domain}.action.${name}`);
  return [...scopePermissions, ...actionPermissions];
}
