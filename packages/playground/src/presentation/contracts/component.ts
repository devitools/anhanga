import { Alert } from "react-native";
import { router } from "expo-router";
import type { ComponentContract, ScopeValue, ScopeRoute } from "@anhanga/core";
import i18n from "../../../settings/i18n";

const t = (key: string) => {
  return i18n.exists(key) ? i18n.t(key) : key;
};

function resolvePath (path: string, params?: Record<string, unknown>): string {
  if (!params) return path;
  return Object.entries(params).reduce(
    (result, [key, value]) => result.replace(`:${key}`, String(value)),
    path,
  );
}

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
      push (path: string, params?: Record<string, unknown>) {
        router.push(resolvePath(path, params) as any);
      },
      back () {
        router.back();
      },
      replace (path: string, params?: Record<string, unknown>) {
        router.replace(resolvePath(path, params) as any);
      },
    },
    dialog: {
      async confirm (message: string) {
        return new Promise((resolve) => {
          Alert.alert(t("common.dialog.confirm"), t(message), [
            { text: t("common.dialog.cancel"), onPress: () => resolve(false) },
            { text: t("common.dialog.ok"), onPress: () => resolve(true) },
          ]);
        });
      },
      async alert (message: string) {
        Alert.alert(t("common.dialog.alert"), t(message));
      },
    },
    toast: {
      success (message: string) {
        console.log("[toast.success]", t(message));
      },
      error (message: string) {
        console.log("[toast.error]", t(message));
      },
      warning (message: string) {
        console.log("[toast.warning]", t(message));
      },
      info (message: string) {
        console.log("[toast.info]", t(message));
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
