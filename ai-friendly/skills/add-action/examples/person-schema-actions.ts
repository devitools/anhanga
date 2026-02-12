// @ts-nocheck
import { action, Position, Scope } from '@ybyra/core'

// Example: Adding a custom "export" action to person schema
// This shows the action definition pattern.

export const exampleActions = {
  // Custom action with order, variant, position, and scope
  custom: action().order(-1).warning().positions(Position.footer).scopes(Scope.add),

  // Override an inherited action (hide it)
  save: action().hidden(),

  // Remove inherited action completely
  // remove: null,
}
