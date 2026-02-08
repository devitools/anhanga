import type { ServiceContract } from "@anhanga/core";
import { Scope } from "@anhanga/core";
import { HandlerContext } from "../src/domain/support/types";

export function createDefault (service: ServiceContract) {
  return {
    add ({ component }: HandlerContext) {
      component.navigator.push(component.scopes[Scope.add].path);
    },
    view ({ state, component }: HandlerContext) {
      component.navigator.push(component.scopes[Scope.view].path, { id: state.id });
    },
    edit ({ state, component }: HandlerContext) {
      component.navigator.push(component.scopes[Scope.edit].path, { id: state.id });
    },
    cancel ({ component }: HandlerContext) {
      component.navigator.push(component.scopes[Scope.index].path);
    },
    create ({ state, component, form }: HandlerContext) {
      if (!form?.validate()) {
        component.toast.error("common.actions.create.invalid");
        return;
      }
      service.create(state);
      component.toast.success("common.actions.create.success");
      component.navigator.push(component.scopes[Scope.index].path);
    },
    update ({ state, component, form }: HandlerContext) {
      if (!form?.validate()) {
        component.toast.error("common.actions.update.invalid");
        return;
      }
      service.update(state?.id as string, state);
      component.toast.success("common.actions.update.success");
      component.navigator.push(component.scopes[Scope.index].path);
    },
    async destroy ({ state, component, table }: HandlerContext) {
      const confirmed = await component.dialog.confirm("common.actions.destroy.confirm");
      if (!confirmed) {
        return;
      }
      await service.destroy(state?.id as string);
      component.toast.success("common.actions.destroy.success");
      if (component.scope !== Scope.index) {
        component.navigator.push(component.scopes[Scope.index].path);
        return;
      }
      table?.reload();
    },
  };
}
