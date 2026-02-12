import { useMemo } from "react";
import { router } from "expo-router";
import type { ComponentContract, DialogContract, ScopeValue, ScopeRoute } from "@ybyra/core";
import i18n from "i18next";
import { useDialog } from "../components/Dialog";

const t = (key: string) => {
  return i18n.exists(key) ? i18n.t(key) : key;
};

function resolvePath(path: string, params?: Record<string, unknown>): string {
  if (!params) return path;
  return Object.entries(params).reduce(
    (result, [key, value]) => result.replace(`:${key}`, String(value)),
    path,
  );
}

export function createComponent(
  scope: ScopeValue,
  scopes: Record<ScopeValue, ScopeRoute>,
  dialog: DialogContract,
): ComponentContract {
  return {
    scope,
    scopes,
    reload() {},
    navigator: {
      push(path: string, params?: Record<string, unknown>) {
        router.push(resolvePath(path, params) as any);
      },
      back() {
        router.back();
      },
      replace(path: string, params?: Record<string, unknown>) {
        router.replace(resolvePath(path, params) as any);
      },
    },
    dialog,
    toast: {
      success(message: string) {
        console.log("[toast.success]", t(message));
      },
      error(message: string) {
        console.log("[toast.error]", t(message));
      },
      warning(message: string) {
        console.log("[toast.warning]", t(message));
      },
      info(message: string) {
        console.log("[toast.info]", t(message));
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

export function useComponent(
  scope: ScopeValue,
  scopes: Record<ScopeValue, ScopeRoute>,
): ComponentContract {
  const dialog = useDialog();
  return useMemo(
    () => createComponent(scope, scopes, dialog),
    [scope, scopes, dialog],
  );
}
