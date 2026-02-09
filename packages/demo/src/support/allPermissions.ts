import type { SchemaProvide } from "@anhanga/core";

export function allPermissions (schema: SchemaProvide): string[] {
  return schema.scopes.map((scope) => `${schema.domain}.${scope}`);
}
