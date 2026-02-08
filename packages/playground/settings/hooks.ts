import { Scope, ServiceContract } from "@anhanga/core";
import { BootstrapContext, FetchContext } from "../src/domain/support/types";

export function createDefault (service: ServiceContract) {
  return {
    bootstrap: {
      async [Scope.view] ({ context, schema, hydrate }: BootstrapContext) {
        if (!context.id) return;
        const data = await service.read(context.id as string);
        hydrate(data);
        for (const field of Object.values(schema)) {
          field.disabled = true;
        }
      },
      async [Scope.edit] ({ context, hydrate }: BootstrapContext) {
        if (!context.id) return;
        const data = await service.read(context.id as string);
        hydrate(data);
      },
    },
    fetch: {
      async [Scope.index] ({ params }: FetchContext) {
        return service.paginate(params);
      },
    },
  };
}