import { ref, computed, onMounted } from 'vue'
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

export function useDataForm (options: UseDataFormOptions): UseDataFormReturn {
  const { schema, scope, events, handlers, hooks, context, component, initialValues, translate, permissions } = options
  const t: TranslateContract = translate ?? ((key) => key)

  const state = ref<Record<string, unknown>>(buildInitialState(schema.fields, initialValues))
  const fieldOverrides = ref<Record<string, Partial<FieldProxy>>>({})
  const errors = ref<Record<string, string[]>>({})
  const initialState = buildInitialState(schema.fields, initialValues)
  const loading = ref(!!(hooks?.fetch?.[scope] || hooks?.bootstrap?.[scope]))

  onMounted(() => {
    const fetchHook = hooks?.fetch?.[scope]
    const bootstrapHook = hooks?.bootstrap?.[scope]
    if (!fetchHook && !bootstrapHook) return

    const run = async () => {
      let hydratedData: Record<string, unknown> | undefined
      let currentOverrides: Record<string, Partial<FieldProxy>> = {}

      // 1. fetch → hidrata os dados
      if (fetchHook) {
        const hydrate = (data: Record<string, unknown>) => { hydratedData = data }
        await fetchHook({
          type: 'record',
          context: context ?? {},
          params: { page: 1, limit: 1 },
          hydrate,
          component,
        })
      }

      // 2. aplica hydrate e dispara events
      if (hydratedData) {
        let currentState = buildInitialState(schema.fields, hydratedData)

        if (events) {
          for (const [fieldName, fieldEvents] of Object.entries(events)) {
            if (!fieldEvents?.change) continue
            const stateResult = createStateProxy(currentState)
            const schemaProxy = createSchemaProxy(schema.fields, currentOverrides)
            fieldEvents.change({ state: stateResult.proxy, schema: schemaProxy.proxy })
            currentState = { ...currentState, ...stateResult.getChanges() }
            for (const [name, ov] of Object.entries(schemaProxy.getOverrides())) {
              currentOverrides[name] = { ...currentOverrides[name], ...ov }
            }
          }
        }

        state.value = currentState
        Object.assign(initialState, currentState)
      }

      // 3. bootstrap → orquestra estado do schema (roda após hydrate)
      if (bootstrapHook) {
        const schemaResult = createSchemaProxy(schema.fields, currentOverrides)
        await bootstrapHook({ context: context ?? {}, schema: schemaResult.proxy, component })
        for (const [name, ov] of Object.entries(schemaResult.getOverrides())) {
          currentOverrides[name] = { ...currentOverrides[name], ...ov }
        }
      }

      if (Object.keys(currentOverrides).length > 0) {
        fieldOverrides.value = currentOverrides
      }

      loading.value = false
    }

    run()
  })

  const scopedFields = computed(() => {
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
    const override = fieldOverrides.value[name]
    return {
      width: override?.width ?? config.form.width,
      height: override?.height ?? config.form.height,
      hidden: override?.hidden ?? config.form.hidden,
      disabled: override?.disabled ?? config.form.disabled,
      state: override?.state ?? '',
    }
  }

  const resolvedFields = computed((): ResolvedField[] => {
    return Object.entries(scopedFields.value)
      .map(([name, config]) => ({
        name,
        config,
        proxy: getProxy(name),
      }))
      .sort((a, b) => a.config.form.order - b.config.form.order)
  })

  const groups = computed((): FieldGroup[] => {
    const groupMap: Record<string, ResolvedField[]> = {}
    for (const field of resolvedFields.value) {
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

  const ungrouped = computed((): ResolvedField[] => {
    return resolvedFields.value.filter((f) => !f.config.group)
  })

  const sections = computed((): FormSection[] => {
    const result: FormSection[] = []
    const emittedGroups = new Set<string>()
    let currentUngrouped: ResolvedField[] = []

    for (const field of resolvedFields.value) {
      const groupName = field.config.group
      if (groupName && schema.groups[groupName]) {
        if (currentUngrouped.length > 0) {
          result.push({ kind: 'ungrouped', fields: currentUngrouped })
          currentUngrouped = []
        }
        if (!emittedGroups.has(groupName)) {
          emittedGroups.add(groupName)
          const group = groups.value.find((g) => g.name === groupName)
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
    const schemaResult = createSchemaProxy(schema.fields, fieldOverrides.value)

    handler({ state: stateResult.proxy, schema: schemaResult.proxy })

    const stateChanges = stateResult.getChanges()
    const schemaOverrides = schemaResult.getOverrides()

    const mergedState = { ...nextState, ...stateChanges }

    if (Object.keys(stateChanges).length > 0) {
      state.value = mergedState
    }

    if (Object.keys(schemaOverrides).length > 0) {
      const prev = { ...fieldOverrides.value }
      for (const [name, overrides] of Object.entries(schemaOverrides)) {
        prev[name] = { ...prev[name], ...overrides }
      }
      fieldOverrides.value = prev
    }

    return mergedState
  }

  function setValue (field: string, value: unknown) {
    const nextState = { ...state.value, [field]: value }
    state.value = nextState

    const config = schema.fields[field]
    if (config) {
      const fieldErrors = validateField(value, config.validations, t)
      const next = { ...errors.value }
      if (fieldErrors.length > 0) {
        next[field] = fieldErrors
      } else {
        delete next[field]
      }
      errors.value = next
    }

    fireEvent(field, 'change', nextState)
  }

  function setValues (values: Record<string, unknown>) {
    state.value = { ...state.value, ...values }
  }

  function reset (values?: Record<string, unknown>) {
    state.value = values ?? { ...initialState }
    errors.value = {}
    fieldOverrides.value = {}
  }

  function validate (): boolean {
    const allErrors = validateAllFields(state.value, scopedFields.value, t)
    errors.value = allErrors
    return Object.keys(allErrors).length === 0
  }

  const dirty = computed(() => {
    for (const key of Object.keys(state.value)) {
      if (state.value[key] !== initialState[key]) return true
    }
    return false
  })

  const valid = computed(() => Object.keys(errors.value).length === 0)

  const actions = computed((): ResolvedAction[] => {
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
            state: { ...state.value },
            component,
            form: {
              errors: errors.value,
              dirty: dirty.value,
              valid: valid.value,
              reset,
              validate,
              setErrors: (errs: Record<string, string[]>) => { errors.value = errs },
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
      value: state.value[name],
      config,
      proxy,
      errors: errors.value[name] ?? [],
      scope,
      onChange (value: unknown) {
        setValue(name, value)
      },
      onBlur () {
        fireEvent(name, 'blur', state.value)
      },
      onFocus () {
        fireEvent(name, 'focus', state.value)
      },
    }
  }

  const permitted = computed(() => isScopePermitted(schema.domain, scope, permissions))

  return {
    get loading () { return loading.value },
    get state () { return state.value },
    get fields () { return resolvedFields.value },
    get groups () { return groups.value },
    get ungrouped () { return ungrouped.value },
    get sections () { return sections.value },
    get actions () { return actions.value },
    get errors () { return errors.value },
    get dirty () { return dirty.value },
    get valid () { return valid.value },
    get permitted () { return permitted.value },
    setValue,
    setValues,
    reset,
    validate,
    getFieldProps,
  }
}
