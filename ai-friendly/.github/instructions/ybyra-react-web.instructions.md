---
applyTo: "**/{pages,presentation}/**/*.{tsx,jsx}"
---

# Ybyra React Web Page Conventions

When editing React Web pages for Ybyra:

## Page Pattern

```tsx-no-check
import { useNavigate } from 'react-router-dom';
import { DataForm, DataPage, useComponent } from '@ybyra/react-web';
import { permissions } from '@src/auth';
import { ExampleSchema } from '@src/domain/example';

export function ExamplePage () {
  const navigate = useNavigate();
  const component = useComponent(scope, scopes, navigate);
  const schema = ExampleSchema.provide();

  return (
    <DataPage
      domain={schema.domain}
      scope={scope}
      permissions={permissions}
    >
      <DataForm
        schema={schema}
        scope={scope}
        permissions={permissions}
        ...
      />
    </DataPage>
  )
}
```

## Key Rules

- List pages use `DataTable`, form pages use `DataForm`
- View/Edit pages need `context={{ id }}` from `useParams()`
- Always wrap in `DataPage` with domain, scope, permissions
- Import `useComponent` from `@ybyra/react-web`
- Routes file at `@routes.ts` defines scope→path mapping

## Reference

See the [React Web guide](https://devitools.github.io/ybyra/react/overview) for complete documentation.
