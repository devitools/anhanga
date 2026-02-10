import { Scope, type ScopeRoute, type ScopeValue } from "@anhanga/core";

export const scopes: Record<ScopeValue, ScopeRoute> = {
  [Scope.index]: { path: "/person" },
  [Scope.add]: { path: "/person/add" },
  [Scope.view]: { path: "/person/:id" },
  [Scope.edit]: { path: "/person/:id/edit" },
};
