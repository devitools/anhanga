import { writable, derived, get } from 'svelte/store'
import type { Readable } from 'svelte/store'
import type { FieldConfig, FieldProxy, ScopeValue, TranslateContract } from '@ybyra/core'
import { buildInitialState, isInScope, isScopePermitted, isActionPermitted } from '@ybyra/core'
import { createStateProxy, createSchemaProxy } from './proxy'
import { validateField, validateAllFields } from './validation'
import type {
  UseDataFormOptions,
  UseDataFormReturn,
  ResolvedField,
  FieldGroup,
  FormSection,
  ResolvedAction,
  FieldRendererProps,
} from './types'

export type UseDataFormStore = Readable<UseDataFormReturn> & {
  setValue(field: string, value: unknown): void
  setValues(values: Record<string, unknown>): void
  reset(values?: Record<string, unknown>): void
  validate(): boolean
  getFieldProps(name: string): FieldRendererProps
}

export function useDataForm (options: UseDataFormOptions): UseDataFormStore {
  const { schema, scope, events, handlers, hooks, context, component, initialValues, translate, permissions } = options
  const t: TranslateContract = translate ?? ((key) => key)

  const state = writable<Record<string, unknown>>(buildInitialState(schema.fields, initialValues))
  const fieldOverrides = writable<Record<string, Partial<FieldProxy>>>({})
  const errors = writable<Record<string, string[]>>({})
  const initialState = buildInitialState(schema.fields, initialValues)
  const loading = writable(!!hooks?.bootstrap?.[scope])

  const hook = hooks?.bootstrap?.[scope]
  if (hook) {
    const run = async () => {
      let hydratedData: Record<string, unknown> | undefined
      const schemaResult = createSchemaProxy(schema.fields, {})
      const hydrate = (data: Record<string, unknown>) => { hydratedData = data }

      await hook({ context: context ?? {}, hydrate, schema: schemaResult.proxy, component })

      if (hydratedData) {
        const newState = buildInitialState(schema.fields, hydratedData)
        state.set(newState)
        Object.assign(initialState, newState)
      }

      const overrides = schemaResult.getOverrides()
      if (Object.keys(overrides).length > 0) {
        fieldOverrides.set(overrides)
      }

      loading.set(false)
    }

    run()
  }

  const scopedFields = derived(state, () => {
    const result: Record<string, FieldConfig> = {}
    for (const [name, config] of Object.entries(schema.fields)) {
      if (isInScope(config, scope)) {
        result[name] = config
      }
    }
    return result
  })

  function getProxy (name: string): FieldProxy {
    const config = schema.fields[name]
    if (!config) {
      return { width: 100, height: 1, hidden: false, disabled: false, state: '' }
    }
    const override = get(fieldOverrides)[name]
    return {
      width: override?.width ?? config.form.width,
      height: override?.height ?? config.form.height,
      hidden: override?.hidden ?? config.form.hidden,
      disabled: override?.disabled ?? config.form.disabled,
      state: override?.state ?? '',
    }
  }

  const resolvedFields = derived([scopedFields, fieldOverrides], ([$scopedFields]) => {
    return Object.entries($scopedFields)
      .map(([name, config]) => ({
        name,
        config,
        proxy: getProxy(name),
      }))
      .sort((a, b) => a.config.form.order - b.config.form.order)
  })

  const groups = derived(resolvedFields, ($resolvedFields): FieldGroup[] => {
    const groupMap: Record<string, ResolvedField[]> = {}
    for (const field of $resolvedFields) {
      const groupName = field.config.group
      if (groupName && schema.groups[groupName]) {
        if (!groupMap[groupName]) groupMap[groupName] = []
        groupMap[groupName].push(field)
      }
    }
    return Object.entries(schema.groups)
      .filter(([name]) => groupMap[name]?.length)
      .map(([name, config]) => ({
        name,
        config,
        fields: groupMap[name],
      }))
  })

  const ungrouped = derived(resolvedFields, ($resolvedFields): ResolvedField[] => {
    return $resolvedFields.filter((f) => !f.config.group)
  })

  const sections = derived([resolvedFields, groups], ([$resolvedFields, $groups]): FormSection[] => {
    const result: FormSection[] = []
    const emittedGroups = new Set<string>()
    let currentUngrouped: ResolvedField[] = []

    for (const field of $resolvedFields) {
      const groupName = field.config.group
      if (groupName && schema.groups[groupName]) {
        if (currentUngrouped.length > 0) {
          result.push({ kind: 'ungrouped', fields: currentUngrouped })
          currentUngrouped = []
        }
        if (!emittedGroups.has(groupName)) {
          emittedGroups.add(groupName)
          const group = $groups.find((g) => g.name === groupName)
          if (group) {
            result.push({ kind: 'group', name: group.name, config: group.config, fields: group.fields })
          }
        }
      } else {
        currentUngrouped.push(field)
      }
    }

    if (currentUngrouped.length > 0) {
      result.push({ kind: 'ungrouped', fields: currentUngrouped })
    }

    return result
  })

  function fireEvent (fieldName: string, eventName: string, nextState: Record<string, unknown>) {
    const handler = events?.[fieldName]?.[eventName]
    if (!handler) return nextState

    const stateResult = createStateProxy(nextState)
    const schemaResult = createSchemaProxy(schema.fields, get(fieldOverrides))

    handler({ state: stateResult.proxy, schema: schemaResult.proxy })

    const stateChanges = stateResult.getChanges()
    const schemaOverrides = schemaResult.getOverrides()

    const mergedState = { ...nextState, ...stateChanges }

    if (Object.keys(stateChanges).length > 0) {
      state.set(mergedState)
    }

    if (Object.keys(schemaOverrides).length > 0) {
      const prev = { ...get(fieldOverrides) }
      for (const [name, overrides] of Object.entries(schemaOverrides)) {
        prev[name] = { ...prev[name], ...overrides }
      }
      fieldOverrides.set(prev)
    }

    return mergedState
  }

  function setValue (field: string, value: unknown) {
    const nextState = { ...get(state), [field]: value }
    state.set(nextState)

    const config = schema.fields[field]
    if (config) {
      const fieldErrors = validateField(value, config.validations, t)
      const next = { ...get(errors) }
      if (fieldErrors.length > 0) {
        next[field] = fieldErrors
      } else {
        delete next[field]
      }
      errors.set(next)
    }

    fireEvent(field, 'change', nextState)
  }

  function setValues (values: Record<string, unknown>) {
    state.set({ ...get(state), ...values })
  }

  function reset (values?: Record<string, unknown>) {
    state.set(values ?? { ...initialState })
    errors.set({})
    fieldOverrides.set({})
  }

  function validate (): boolean {
    const allErrors = validateAllFields(get(state), get(scopedFields), t)
    errors.set(allErrors)
    return Object.keys(allErrors).length === 0
  }

  const dirty = derived(state, ($state) => {
    for (const key of Object.keys($state)) {
      if ($state[key] !== initialState[key]) return true
    }
    return false
  })

  const valid = derived(errors, ($errors) => Object.keys($errors).length === 0)

  const actions = derived([errors, dirty, valid], ([$errors, $dirty, $valid]): ResolvedAction[] => {
    return Object.entries(schema.actions)
      .filter(([, config]) => !config.hidden && isInScope(config, scope))
      .filter(([name, config]) => isActionPermitted(schema.domain, name, config, permissions))
      .sort(([, a], [, b]) => a.order - b.order)
      .map(([name, config]) => ({
        name,
        config,
        execute: async () => {
          const handler = handlers?.[name]
          if (!handler) return
          await handler({
            state: { ...get(state) },
            component,
            form: {
              errors: $errors,
              dirty: $dirty,
              valid: $valid,
              reset,
              validate,
            },
          })
        },
      }))
  })

  function getFieldProps (name: string): FieldRendererProps {
    const config = schema.fields[name]
    const proxy = getProxy(name)
    return {
      domain: schema.domain,
      name,
      value: get(state)[name],
      config,
      proxy,
      errors: get(errors)[name] ?? [],
      scope,
      onChange (value: unknown) {
        setValue(name, value)
      },
      onBlur () {
        fireEvent(name, 'blur', get(state))
      },
      onFocus () {
        fireEvent(name, 'focus', get(state))
      },
    }
  }

  const permitted = isScopePermitted(schema.domain, scope, permissions)

  const store = derived(
    [loading, state, resolvedFields, groups, ungrouped, sections, actions, errors, dirty, valid],
    ([$loading, $state, $fields, $groups, $ungrouped, $sections, $actions, $errors, $dirty, $valid]): UseDataFormReturn => ({
      loading: $loading,
      state: $state,
      fields: $fields,
      groups: $groups,
      ungrouped: $ungrouped,
      sections: $sections,
      actions: $actions,
      errors: $errors,
      dirty: $dirty,
      valid: $valid,
      permitted,
      setValue,
      setValues,
      reset,
      validate,
      getFieldProps,
    }),
  )

  return {
    subscribe: store.subscribe,
    setValue,
    setValues,
    reset,
    validate,
    getFieldProps,
  }
}
