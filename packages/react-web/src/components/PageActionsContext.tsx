import { createContext, useContext, useState, useRef, useCallback } from "react";
import type { ReactNode } from "react";

interface PageActionsContextValue {
  register: (node: ReactNode) => void;
}

export const PageActionsContext = createContext<PageActionsContextValue | null>(null);

export function usePageActions() {
  return useContext(PageActionsContext);
}

export function usePageActionsState() {
  const [node, setNode] = useState<ReactNode>(null);
  const registeredRef = useRef(false);

  const register = useCallback((newNode: ReactNode) => {
    if (registeredRef.current) return;
    registeredRef.current = true;
    setNode(newNode);
  }, []);

  return { node, register };
}
