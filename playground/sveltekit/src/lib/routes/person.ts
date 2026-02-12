import { Scope } from '@ybyra/core'

export const scopes = {
  [Scope.index]: { path: '/person' },
  [Scope.add]: { path: '/person/add' },
  [Scope.view]: { path: '/person/:id' },
  [Scope.edit]: { path: '/person/:id/edit' },
}
