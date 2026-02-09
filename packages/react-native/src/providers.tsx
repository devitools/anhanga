import type { ComponentType } from 'react'
import { ThemeProvider } from './theme/context'
import { defaultTheme, type Theme } from './theme/default'
import { DialogProvider } from './components/Dialog'

interface ProviderOptions {
  theme?: Theme
}

export function withProviders<P extends object>(
  Component: ComponentType<P>,
  options: ProviderOptions = {},
) {
  const { theme = defaultTheme } = options
  function WithProviders(props: P) {
    return (
      <ThemeProvider theme={theme}>
        <DialogProvider>
          <Component {...props} />
        </DialogProvider>
      </ThemeProvider>
    )
  }
  WithProviders.displayName = `withProviders(${Component.displayName || Component.name || 'Component'})`
  return WithProviders
}
