---
applyTo: "**/{pages,presentation}/**/*.{tsx,jsx}"
---

# Ybyra React Web Page Conventions

When editing React Web pages for Ybyra:

## Page Pattern

```
import { Scope } from "@ybyra/core";
import { allPermissions, {Domain}Schema } from "@ybyra/demo";
import { DataForm, DataPage, useComponent } from "@ybyra/react-web";
import { useNavigate } from "react-router-dom";

export function {Domain}Page() {
  const navigate = useNavigate();
  const component = useComponent(scope, scopes, navigate);
  const schema = {Domain}Schema.provide();

  return (
    <DataPage domain={schema.domain} scope={scope} permissions={allPermissions(schema)}>
      <DataForm schema={schema} scope={scope} ... />
    </DataPage>
  );
}
```

## Key Rules

- List pages use `DataTable`, form pages use `DataForm`
- View/Edit pages need `context={{ id }}` from `useParams()`
- Always wrap in `DataPage` with domain, scope, permissions
- Import `useComponent` from `@ybyra/react-web`
- Routes file at `@routes.ts` defines scope→path mapping

## Reference

See `ai-friendly/frameworks/react-web.md` for complete guide.
