import type { ServiceContract, BootstrapHookContext, FetchHookContext } from "@anhanga/core";
import { Scope } from "@anhanga/core";

export function createDefault (service: ServiceContract) {
  return {
    bootstrap: {
      async [Scope.view] ({ context, schema, hydrate }: BootstrapHookContext) {
        if (!context.id) return;
        const data = await service.read(context.id as string);
        hydrate(data);
        for (const field of Object.values(schema)) {
          field.disabled = true;
        }
      },
      async [Scope.edit] ({ context, hydrate }: BootstrapHookContext) {
        if (!context.id) return;
        const data = await service.read(context.id as string);
        hydrate(data);
      },
    },
    fetch: {
      async [Scope.index] ({ params }: FetchHookContext) {
        return service.paginate(params);
      },
    },
  };
}