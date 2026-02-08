export const Icon = {
  Save: 'save',
  Close: 'close',
  Trash: 'trash',
  Send: 'send',
  Edit: 'edit',
  Add: 'add',
  Search: 'search',
  View: 'view',
  List: 'list',
  Person: 'person',
  Map: 'map',
} as const

export type IconValue = typeof Icon[keyof typeof Icon]
