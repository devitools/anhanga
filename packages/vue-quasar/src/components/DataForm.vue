<template>
  <div
      v-if="form.loading"
      class="text-center q-pa-lg text-grey"
  >
    <q-spinner
        size="2em"
        class="q-mr-sm"
    />
    Loading...
  </div>

  <div v-else>
    <ActionBar
        :actions="form.actions"
        position="top"
        :domain="props.schema.domain"
    />

    <div
        v-for="(section, index) in form.sections"
        :key="section.kind === 'group' ? section.name : `ungrouped-${index}`"
        class="q-mb-lg"
    >
      <div
          v-if="section.kind === 'group'"
          class="q-mb-sm text-subtitle2 text-grey-7"
      >
        {{ resolveGroup(section.name) }}
      </div>
      <div class="row q-col-gutter-md">
        <template
            v-for="field in section.fields"
            :key="field.name"
        >
          <div
              v-if="!field.proxy.hidden"
              :class="`col-${Math.round(field.proxy.width * 12 / 100)}`"
          >
            <component
                :is="getRenderer(field.config.component)"
                v-if="getRenderer(field.config.component)"
                v-bind="form.getFieldProps(field.name)"
            />
          </div>
        </template>
      </div>
    </div>

    <q-separator class="q-my-lg" />

    <ActionBar
        :actions="form.actions"
        position="footer"
        :domain="props.schema.domain"
    />

    <div
        v-if="debug"
        class="q-mt-lg q-pa-md bg-dark rounded-borders"
    >
      <div class="row q-gutter-xs q-mb-sm">
        <q-btn
            dense
            flat
            icon="flash_on"
            size="sm"
            color="amber"
            @click="handleFill"
        />
        <q-btn
            dense
            flat
            icon="restart_alt"
            size="sm"
            color="grey"
            @click="form.reset()"
        />
        <q-btn
            dense
            flat
            icon="check"
            size="sm"
            color="green"
            @click="form.validate()"
        />
        <q-btn
            dense
            flat
            icon="refresh"
            size="sm"
            color="blue"
            @click="handleReload"
        />
        <q-btn
            dense
            flat
            :icon="debugExpanded ? 'remove' : 'add'"
            size="sm"
            color="amber"
            @click="debugExpanded = !debugExpanded"
        />
      </div>

      <template v-if="debugExpanded">
        <div class="text-caption text-grey-5 q-mt-sm">State</div>
        <pre
            class="text-caption text-grey-3"
            style="white-space: pre-wrap"
        >{{ JSON.stringify(form.state, null, 2) }}</pre>
        <div class="text-caption text-grey-5 q-mt-sm">Errors</div>
        <pre
            class="text-caption text-grey-3"
            style="white-space: pre-wrap"
        >{{ JSON.stringify(form.errors, null, 2) }}</pre>
        <div class="text-caption text-grey-5 q-mt-sm">
          dirty: {{ form.dirty }} | valid: {{ form.valid }}
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { QSpinner, QSeparator, QBtn } from 'quasar'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDataForm, getRenderer } from '@anhanga/vue'
import type { UseDataFormOptions } from '@anhanga/vue'
import { fill } from '@anhanga/core'
import ActionBar from './ActionBar.vue'

interface DataFormProps extends UseDataFormOptions {
  debug?: boolean
}

const props = withDefaults(defineProps<DataFormProps>(), {
  debug: true,
})

const { t, te } = useI18n()
const translateFn = (key: string, params?: Record<string, unknown>) => {
  if (!te(key)) return key
  return t(key, params ?? {})
}

const form = useDataForm({ ...props, translate: props.translate ?? translateFn })
const debugExpanded = ref(false)

function resolveGroup (name: string) {
  const key = `${props.schema.domain}.groups.${name}`
  return te(key) ? t(key) : name
}

function handleFill () {
  form.setValues(fill(props.schema.fields, props.schema.identity))
}

function handleReload () {
  window.location.reload()
}
</script>
