import { configureIcons } from '@ybyra/react-native'
import { describe, it, expect } from 'vitest'

describe('icons', () => {
  it('configures common action icons', async () => {
    await import('../../../src/settings/icons')

    expect(configureIcons).toHaveBeenCalledWith(
      expect.objectContaining({
        common: expect.objectContaining({
          actions: expect.objectContaining({
            add: 'plus',
            view: 'eye',
            edit: 'edit-2',
            create: 'save',
            update: 'save',
            cancel: 'x',
            destroy: 'trash-2',
          }),
        }),
      }),
    )
  })
})
