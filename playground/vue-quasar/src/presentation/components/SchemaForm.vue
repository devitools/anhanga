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
            @click="() => globalThis.location.reload()"
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

<script
    setup
    lang="ts"
>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { QBtn } from "quasar";
import { useSchemaForm, getRenderer } from "@anhanga/vue";
import type { UseSchemaFormOptions, ResolvedAction } from "@anhanga/vue";
import type { PositionValue } from "@anhanga/core";
import { fakeAll } from "@anhanga/demo";
import { h, defineComponent } from "vue";
import { iconMap } from "@/presentation/contracts/icons";

interface SchemaFormProps extends UseSchemaFormOptions {
  debug?: boolean;
}

const props = withDefaults(defineProps<SchemaFormProps>(), {
  debug: true,
});

const { t, te } = useI18n();
const translateFn = (key: string, params?: Record<string, unknown>) => {
  if (!te(key)) return key;
  return t(key, params ?? {});
};

const form = useSchemaForm({ ...props, translate: props.translate ?? translateFn });
const debugExpanded = ref(false);

function resolveGroup (name: string) {
  const key = `${props.schema.domain}.groups.${name}`;
  return te(key) ? t(key) : name;
}

function handleFill () {
  const fakeData = fakeAll(props.schema.fields, props.schema.identity);
  form.setValues(fakeData);
}

const ActionBar = defineComponent({
  props: {
    actions: { type: Array as () => ResolvedAction[], required: true },
    position: { type: String as () => PositionValue, required: true },
    domain: { type: String, required: true },
  },
  setup (innerProps) {
    const { t: innerT, te: innerTe } = useI18n();

    function resolveAction (name: string) {
      const commonKey = `common.actions.${name}`;
      if (innerTe(commonKey)) return innerT(commonKey);
      const domainKey = `${innerProps.domain}.actions.${name}`;
      if (innerTe(domainKey)) return innerT(domainKey);
      return name;
    }

    return () => {
      const filtered = innerProps.actions.filter(
          (a) => a.config.positions?.includes(innerProps.position),
      );
      if (filtered.length === 0) return null;

      const startActions = filtered.filter((a) => a.config.align === "start");
      const endActions = filtered.filter((a) => a.config.align === "end");
      const isDefault = (v: string) => v === "default";

      function renderBtn (action: ResolvedAction) {
        const icon = action.config.icon ? iconMap[action.config.icon] ?? action.config.icon : undefined;
        return h(QBtn, {
          key: action.name,
          label: resolveAction(action.name),
          icon,
          color: isDefault(action.config.variant) ? undefined : action.config.variant,
          outline: isDefault(action.config.variant),
          unelevated: !isDefault(action.config.variant),
          noCaps: true,
          rounded: true,
          onClick: () => action.execute(),
        });
      }

      return h("div", { class: "row justify-between items-center q-mb-md" }, [
        h("div", { class: "row q-gutter-sm" }, startActions.map(renderBtn)),
        h("div", { class: "row q-gutter-sm" }, endActions.map(renderBtn)),
      ]);
    };
  },
});
</script>
