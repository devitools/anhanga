import type { ReactNode } from 'react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { ScopeValue } from '@ybyra/core'
import { isScopePermitted } from '@ybyra/core'
import { useTheme } from '../theme/context'
import type { Theme } from '../theme/default'
import { Icon } from '../support/Icon'
import { PageActionsContext, usePageActionsState } from './PageActionsContext'

interface PageProps {
  domain: string;
  scope: ScopeValue;
  maxWidth?: number;
  loading?: boolean;
  permissions?: string[];
  forbidden?: ReactNode;
  children: ReactNode;
  /** @deprecated use layout="flat" instead */
  bare?: boolean;
  layout?: 'card' | 'flat';
  title?: string;
  subtitle?: string;
  headerEnd?: ReactNode;
  className?: string;
}

export function DataPage (props: PageProps) {
  const {
    domain,
    scope,
    maxWidth = 960,
    loading,
    permissions,
    forbidden,
    bare,
    layout = 'card',
    title,
    subtitle,
    headerEnd,
    className,
    children
  } = props
  const { t } = useTranslation()
  const theme = useTheme()
  const styles = createStyles(theme)
  const permitted = !permissions || isScopePermitted(domain, scope, permissions)
  const { node: registeredActions, register } = usePageActionsState()
  const contextValue = useMemo(() => ({ register }), [register])

  if (loading) {
    return (
      <div style={styles.loading}>Loading...</div>
    )
  }

  if (!permitted) {
    if (forbidden) return <>{forbidden}</>
    return (
      <div style={styles.forbidden}>
        <Icon
          name="shield-off"
          size={32}
          color={theme.colors.mutedForeground}
        />
        <div style={styles.forbiddenText}>{t('common.forbidden')}</div>
      </div>
    )
  }

  if (bare || layout === 'flat') {
    const resolvedTitle = title ?? t(`${domain}.title`)
    if (layout !== 'flat' && bare) {
      return <>{children}</>
    }
    const resolvedHeaderEnd = headerEnd ?? registeredActions
    return (
      <PageActionsContext.Provider value={contextValue}>
        <div style={styles.flatScroll} className={className}>
          <div>
            <div style={styles.flatHeader}>
              <div>
                <div style={styles.flatTitle}>{resolvedTitle}</div>
                {subtitle && <div style={styles.flatSubtitle}>{subtitle}</div>}
              </div>
              {resolvedHeaderEnd && <div style={styles.flatHeaderEnd}>{resolvedHeaderEnd}</div>}
            </div>
            {children}
          </div>
        </div>
      </PageActionsContext.Provider>
    )
  }

  return (
    <div style={styles.scroll} className={className}>
      <div style={{ ...styles.container, maxWidth }}>
        <div style={styles.title}>{t(`${domain}.title`)} / {t(`common.scopes.${scope}`)}</div>
        {children}
      </div>
    </div>
  )
}

const createStyles = (theme: Theme) => ({
  scroll: {
    minHeight: '100vh',
    backgroundColor: theme.colors.background,
    padding: theme.spacing.xl,
    paddingTop: 60,
  },
  container: {
    width: '100%',
    margin: '0 auto',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xxl,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    marginBottom: theme.spacing.xxl,
    color: theme.colors.foreground,
  },
  flatScroll: {
    // No minHeight/backgroundColor/padding — host app controls layout
  },
  flatContainer: {},
  flatHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xxl,
    gap: theme.spacing.md,
  },
  flatTitle: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.foreground,
    lineHeight: '1.2',
  },
  flatSubtitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.mutedForeground,
    marginTop: theme.spacing.xs,
  },
  flatHeaderEnd: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.md,
    flexShrink: 0,
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    color: theme.colors.mutedForeground,
  },
  forbidden: {
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    gap: 8,
  },
  forbiddenText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.mutedForeground,
  },
})
