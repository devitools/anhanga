import { type BootstrapHookContext, type FetchHookContext, FetchType, Scope, type ServiceContract } from '@ybyra/core'

export function createDefault (service: ServiceContract) {
  return {
    bootstrap: {
      async [Scope.view] ({ schema }: BootstrapHookContext) {
        for (const field of Object.values(schema)) {
          field.disabled = true
        }
      },
    },
    fetch: {
      async [Scope.view] (context: FetchHookContext) {
        if (context.type !== FetchType.record || !context.context.id) {
          return
        }
        const data = await service.read(context.context.id as string)
        context.hydrate(data)
      },
      async [Scope.edit] (context: FetchHookContext) {
        if (context.type !== FetchType.record || !context.context.id) {
          return
        }
        const data = await service.read(context.context.id as string)
        context.hydrate(data)
      },
      async [Scope.index] (context: FetchHookContext) {
        if (context.type !== FetchType.collection) {
          return
        }
        const result = await service.paginate(context.params)
        context.hydrate(result)
      },
    },
  }
}