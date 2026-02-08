import type { ComponentContract, FieldProxy, FormContract, PaginateParams, TableContract } from "@anhanga/core";

export interface HandlerContext {
  state: Record<string, unknown>
  component: ComponentContract
  form?: FormContract
  table?: TableContract
}

export interface BootstrapContext {
  context: Record<string, unknown>
  hydrate(data: Record<string, unknown>): void
  schema: Record<string, FieldProxy>
  component: ComponentContract
}

export interface FetchContext {
  params: PaginateParams
  component: ComponentContract
}