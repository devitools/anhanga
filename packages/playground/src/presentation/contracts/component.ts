import { Alert } from "react-native";
import type { ComponentContract, ScopeValue, ScopeRoute } from "@anhanga/core";
import { Scope } from "@anhanga/core";

export function createComponent(
  scope: ScopeValue,
  reload: () => void,
): ComponentContract {
  const scopes: Record<ScopeValue, ScopeRoute> = {
    [Scope.index]: { path: "/person" },
    [Scope.add]: { path: "/person/create" },
    [Scope.view]: { path: "/person/view" },
    [Scope.edit]: { path: "/person/edit" },
  };

  return {
    scope,
    scopes,
    reload,
    navigator: {
      push(path: string) {
        console.log("[navigator.push]", path);
      },
      back() {
        console.log("[navigator.back]");
      },
      replace(path: string) {
        console.log("[navigator.replace]", path);
      },
    },
    dialog: {
      async confirm(message: string) {
        return new Promise((resolve) => {
          Alert.alert("Confirm", message, [
            { text: "Cancel", onPress: () => resolve(false) },
            { text: "OK", onPress: () => resolve(true) },
          ]);
        });
      },
      async alert(message: string) {
        Alert.alert("Alert", message);
      },
    },
    toast: {
      success(message: string) {
        console.log("[toast.success]", message);
      },
      error(message: string) {
        console.log("[toast.error]", message);
      },
      warning(message: string) {
        console.log("[toast.warning]", message);
      },
      info(message: string) {
        console.log("[toast.info]", message);
      },
    },
    loading: {
      show() {
        console.log("[loading.show]");
      },
      hide() {
        console.log("[loading.hide]");
      },
    },
  };
}
