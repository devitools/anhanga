import { describe, it, expect, vi } from 'vitest'

vi.mock('vue-router', () => ({
  createRouter: vi.fn((config: any) => config),
  createWebHistory: vi.fn(() => 'webHistory'),
}))

describe('router', () => {
  it('redirects root to /person', async () => {
    const { router } = await import('../../../src/router') as any
    const rootRoute = router.routes.find((r: any) => r.path === '/')
    expect(rootRoute.redirect).toBe('/person')
  })

  it('defines all person routes', async () => {
    const { router } = await import('../../../src/router') as any
    const paths = router.routes.map((r: any) => r.path)
    expect(paths).toContain('/person')
    expect(paths).toContain('/person/add')
    expect(paths).toContain('/person/edit/:id')
    expect(paths).toContain('/person/view/:id')
  })

  it('uses lazy-loaded components for person routes', async () => {
    const { router } = await import('../../../src/router') as any
    const personRoutes = router.routes.filter((r: any) => r.path?.startsWith('/person'))
    for (const route of personRoutes) {
      expect(route.component).toBeTypeOf('function')
    }
  })
})
