import { createWebDriver } from '@anhanga/persistence/web'
import { createPersonService, createPersonHandlers, createPersonHooks } from '@anhanga/demo'

const driver = createWebDriver()
export const personService = createPersonService(driver)
export const personHandlers = createPersonHandlers(personService)
export const personHooks = createPersonHooks(personService)
