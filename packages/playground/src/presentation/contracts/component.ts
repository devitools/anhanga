import { Alert } from "react-native";
import { router } from "expo-router";
import type { ComponentContract, ScopeValue, ScopeRoute } from "@anhanga/core";
import { Scope } from "@anhanga/core";

export function createComponent (
  scope: ScopeValue,
  scopes: Record<ScopeValue, ScopeRoute>,
  reload: () => void,
): ComponentContract {

  return {
    scope,
    scopes,
    reload,
    navigator: {
      push (path: string) {
        router.push(path as any);
      },
      back () {
        router.back();
      },
      replace (path: string) {
        router.replace(path as any);
      },
    },
    dialog: {
      async confirm (message: string) {
        return new Promise((resolve) => {
          Alert.alert("Confirm", message, [
            { text: "Cancel", onPress: () => resolve(false) },
            { text: "OK", onPress: () => resolve(true) },
          ]);
        });
      },
      async alert (message: string) {
        Alert.alert("Alert", message);
      },
    },
    toast: {
      success (message: string) {
        console.log("[toast.success]", message);
      },
      error (message: string) {
        console.log("[toast.error]", message);
      },
      warning (message: string) {
        console.log("[toast.warning]", message);
      },
      info (message: string) {
        console.log("[toast.info]", message);
      },
    },
    loading: {
      show () {
        console.log("[loading.show]");
      },
      hide () {
        console.log("[loading.hide]");
      },
    },
  };
}
