import { createLocalDriver } from '@anhanga/persistence'
import { createPersonService, createPersonHandlers, createPersonHooks } from '@anhanga/demo'

const driver = createLocalDriver()
export const personService = createPersonService(driver)
export const personHandlers = createPersonHandlers(personService)
export const personHooks = createPersonHooks(personService)
