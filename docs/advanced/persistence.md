# Persistence

Anhanga provides a persistence abstraction that connects schemas to storage backends. The `PersistenceContract` defines the storage interface, and `createService()` builds a `ServiceContract` from a schema and persistence driver.

## PersistenceContract

The persistence contract is a low-level interface for CRUD and search operations:

```typescript
interface PersistenceContract {
  initialize(meta: PersistenceMeta): Promise<void>
  create(meta: PersistenceMeta, data: Record<string, unknown>): Promise<Record<string, unknown>>
  read(meta: PersistenceMeta, id: string | number): Promise<Record<string, unknown> | null>
  update(meta: PersistenceMeta, id: string | number, data: Record<string, unknown>): Promise<Record<string, unknown>>
  destroy(meta: PersistenceMeta, id: string | number): Promise<void>
  search(meta: PersistenceMeta, params: PaginateParams): Promise<PaginatedResult<Record<string, unknown>>>
}
```

### PersistenceMeta

Metadata extracted from the schema, passed to every persistence operation:

```typescript
interface PersistenceMeta {
  resource: string
  identity: string
  fields: Record<string, { dataType: string }>
}
```

## createService()

Factory function that wraps a persistence driver into a `ServiceContract`:

```typescript
import { createService } from '@anhanga/core'

const personService = createService(PersonSchema, localStorageDriver)
```

The returned service implements:

```typescript
interface ServiceContract<T = Record<string, unknown>> {
  paginate(params: PaginateParams): Promise<PaginatedResult<T>>
  read(id: string | number | Record<string, unknown>): Promise<T>
  create(data: Partial<T>): Promise<T>
  update(id: string | number | Record<string, unknown>, data: Partial<T>): Promise<T>
  destroy(id: string | number | Record<string, unknown>): Promise<void>
}
```

## Extending Services

Spread the base service and add custom methods:

```typescript
export const personService = {
  ...createService(PersonSchema, localDriver),
  async custom(name: string) {
    console.log('[personService.custom]', name)
  },
}
```

## extractPersistenceMeta()

Extracts persistence metadata from a schema for use in custom drivers:

```typescript
import { extractPersistenceMeta } from '@anhanga/core'

const meta = extractPersistenceMeta(PersonSchema)
// { resource: 'person', identity: 'id', fields: { name: { dataType: 'string' }, ... } }
```

## Implementing a Persistence Driver

```typescript
const apiDriver: PersistenceContract = {
  async initialize(meta) {
    // Set up connections, create tables, etc.
  },

  async create(meta, data) {
    const response = await fetch(`/api/${meta.resource}`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
    return response.json()
  },

  async read(meta, id) {
    const response = await fetch(`/api/${meta.resource}/${id}`)
    return response.json()
  },

  async update(meta, id, data) {
    const response = await fetch(`/api/${meta.resource}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
    return response.json()
  },

  async destroy(meta, id) {
    await fetch(`/api/${meta.resource}/${id}`, { method: 'DELETE' })
  },

  async search(meta, params) {
    const query = new URLSearchParams({
      page: String(params.page),
      limit: String(params.limit),
      ...(params.sort ? { sort: params.sort, order: params.order ?? 'asc' } : {}),
    })
    const response = await fetch(`/api/${meta.resource}?${query}`)
    return response.json()
  },
}
```
