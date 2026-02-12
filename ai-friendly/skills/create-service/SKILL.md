---
name: create-service
description: Creates a service layer with persistence for a Ybyra domain, implementing ServiceContract with optional custom methods.
---

# Skill: Create Service

Generate the application service for a Ybyra domain entity.

## What This Skill Creates

```
src/application/{domain}/
  {domain}Service.ts   ← ServiceContract implementation
```

## Template

```typescript
import { createService } from "@ybyra/core";
import type { PersistenceContract } from "@ybyra/core";
import { {Domain}Schema } from "../../domain/{domain}";

export function create{Domain}Service(driver: PersistenceContract) {
  return {
    ...createService({Domain}Schema, driver),
    // Custom methods beyond CRUD:
    // async customMethod(param: string) { ... }
  };
}
```

## Rules

- `createService(Schema, driver)` provides standard CRUD: `list`, `find`, `create`, `update`, `remove`
- The `driver` parameter is a `PersistenceContract` — the actual storage backend
- Spread `createService()` to inherit all CRUD, then add custom methods
- Factory pattern: the function receives the driver and returns the service object

## Driver Setup by Platform

### Web (localStorage)
```typescript
import { createWebDriver } from "@ybyra/persistence/web";
const driver = createWebDriver();
```

### React Native (SQLite)
```typescript
import { createLocalDriver } from "@ybyra/persistence";
const driver = createLocalDriver();
```

### API (custom)
```typescript
import type { PersistenceContract } from "@ybyra/core";

const driver: PersistenceContract = {
  async list(domain, options) { /* fetch from API */ },
  async find(domain, id) { /* GET /api/{domain}/{id} */ },
  async create(domain, data) { /* POST /api/{domain} */ },
  async update(domain, id, data) { /* PUT /api/{domain}/{id} */ },
  async remove(domain, id) { /* DELETE /api/{domain}/{id} */ },
};
```

## Setup File Pattern

Each application creates a setup file that wires service → handlers → hooks:

```typescript
// src/setup.ts or src/demo.ts
import { createWebDriver } from "@ybyra/persistence/web";
import { create{Domain}Service } from "./application/{domain}/{domain}Service";
import { create{Domain}Handlers } from "./domain/{domain}";
import { create{Domain}Hooks } from "./domain/{domain}";

const driver = createWebDriver();
export const {domain}Service = create{Domain}Service(driver);
export const {domain}Handlers = create{Domain}Handlers({domain}Service);
export const {domain}Hooks = create{Domain}Hooks({domain}Service);
```
