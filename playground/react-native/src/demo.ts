import { Platform } from 'react-native'
import { createLocalDriver } from '@ybyra/persistence'
import { createWebDriver } from '@ybyra/persistence/web'
import { createPersonService, createPersonHandlers, createPersonHooks } from '@ybyra/demo'

const driver = Platform.OS === 'web' ? createWebDriver() : createLocalDriver()
export const personService = createPersonService(driver)
export const personHandlers = createPersonHandlers(personService)
export const personHooks = createPersonHooks(personService)
