import { FieldDefinition } from './base'

export class SlotFieldDefinition extends FieldDefinition<unknown> {
  constructor(attrs: Record<string, unknown> = {}) {
    super('slot', 'unknown', attrs)
  }
}

export function slot(attrs?: Record<string, unknown>): SlotFieldDefinition {
  return new SlotFieldDefinition(attrs)
}
