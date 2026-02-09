import { useMemo } from "react";
import type { ComponentContract, DialogContract, ScopeValue, ScopeRoute } from "@anhanga/core";
import i18n from "i18next";
import { useDialog } from "../components/Dialog";

const t = (key: string) => {
  return i18n.exists(key) ? i18n.t(key) as string : key;
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
  navigate?: (path: string) => void,
): ComponentContract {
  const nav = navigate ?? (() => {});
  return {
    scope,
    scopes,
    reload() {},
    navigator: {
      push(path: string, params?: Record<string, unknown>) {
        nav(resolvePath(path, params));
      },
      back() {
        window.history.back();
      },
      replace(path: string, params?: Record<string, unknown>) {
        nav(resolvePath(path, params));
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
      show() {},
      hide() {},
    },
  };
}

export function useComponent(
  scope: ScopeValue,
  scopes: Record<ScopeValue, ScopeRoute>,
  navigate?: (path: string) => void,
): ComponentContract {
  const dialog = useDialog();
  return useMemo(
    () => createComponent(scope, scopes, dialog, navigate),
    [scope, scopes, dialog, navigate],
  );
}
