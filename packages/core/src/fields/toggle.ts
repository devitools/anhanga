import { FieldDefinition } from './base'

export class ToggleFieldDefinition extends FieldDefinition<boolean> {
  constructor(attrs: Record<string, unknown> = {}) {
    super('toggle', 'boolean', attrs)
  }
}

export function toggle(attrs?: Record<string, unknown>): ToggleFieldDefinition {
  return new ToggleFieldDefinition(attrs)
}

export class CheckboxFieldDefinition extends FieldDefinition<boolean> {
  constructor(attrs: Record<string, unknown> = {}) {
    super('checkbox', 'boolean', attrs)
  }
}

export function checkbox(attrs?: Record<string, unknown>): CheckboxFieldDefinition {
  return new CheckboxFieldDefinition(attrs)
}
