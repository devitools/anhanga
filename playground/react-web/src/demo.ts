import { createWebDriver } from '@ybyra/persistence/web'
import { createPersonService, createPersonHandlers, createPersonHooks } from '@ybyra/demo'

const driver = createWebDriver()
export const personService = createPersonService(driver)
export const personHandlers = createPersonHandlers(personService)
export const personHooks = createPersonHooks(personService)
