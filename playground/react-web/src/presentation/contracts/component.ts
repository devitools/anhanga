import type { ComponentContract, DialogContract, ScopeValue, ScopeRoute } from "@anhanga/core";
import { toast } from "@/components/ui/sonner";
import i18n from "i18next";

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

let navigateFn: (path: string) => void = () => {};

export function setNavigate(fn: (path: string) => void) {
  navigateFn = fn;
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
        navigateFn(resolvePath(path, params));
      },
      back() {
        window.history.back();
      },
      replace(path: string, params?: Record<string, unknown>) {
        navigateFn(resolvePath(path, params));
      },
    },
    dialog,
    toast: {
      success(message: string) {
        toast.success(t(message));
      },
      error(message: string) {
        toast.error(t(message));
      },
      warning(message: string) {
        toast.warning(t(message));
      },
      info(message: string) {
        toast.info(t(message));
      },
    },
    loading: {
      show() {},
      hide() {},
    },
  };
}
