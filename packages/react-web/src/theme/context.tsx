import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import { defaultTheme } from "./default";
import type { Theme } from "./default";

const ThemeContext = createContext<Theme>(defaultTheme);

interface ThemeProviderProps {
  theme: Theme;
  children: ReactNode;
}

export function ThemeProvider({ theme, children }: ThemeProviderProps) {
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): Theme {
  return useContext(ThemeContext);
}
