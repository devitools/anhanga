import { Platform } from 'react-native'
import { createLocalDriver } from '@anhanga/persistence'
import { createWebDriver } from '@anhanga/persistence/web'
import { createPersonService, createPersonHandlers, createPersonHooks } from '@anhanga/demo'

const driver = Platform.OS === 'web' ? createWebDriver() : createLocalDriver()
export const personService = createPersonService(driver)
export const personHandlers = createPersonHandlers(personService)
export const personHooks = createPersonHooks(personService)
