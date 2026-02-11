<template>
  <q-card>
    <q-card-section>
      <div class="text-h6">{{ title }}</div>
    </q-card-section>

    <q-card-section>
      <slot />
    </q-card-section>
  </q-card>
</template>

<script
  setup
  lang="ts"
>
import type { ScopeValue } from "@anhanga/core";
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const props = defineProps<{
  domain: string
  scope: ScopeValue
}>();

const { t, te } = useI18n();

const title = computed(() => {
  const domainTitle = te(`${props.domain}.title`) ? t(`${props.domain}.title`) : props.domain;
  const scopeLabel = te(`common.scopes.${props.scope}`) ? t(`common.scopes.${props.scope}`) : "";
  if (!scopeLabel) return domainTitle;
  return `${domainTitle} — ${scopeLabel}`;
});
</script>
