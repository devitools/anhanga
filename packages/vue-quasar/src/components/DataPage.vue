<template>
  <q-card v-if="permitted">
    <q-card-section>
      <div class="text-h6">{{ title }}</div>
    </q-card-section>

    <q-card-section>
      <slot />
    </q-card-section>
  </q-card>

  <template v-else>
    <slot name="forbidden">
      <q-card-section class="column items-center justify-center q-pa-xl" style="min-height: 50vh">
        <q-icon name="shield" size="32px" color="grey" />
        <div class="text-grey q-mt-sm">{{ t('common.forbidden') }}</div>
      </q-card-section>
    </slot>
  </template>
</template>

<script
  setup
  lang="ts"
>
import { QCard, QCardSection, QIcon } from "quasar";
import type { ScopeValue } from "@anhanga/core";
import { isScopePermitted } from "@anhanga/core";
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const props = defineProps<{
  domain: string
  scope: ScopeValue
  permissions?: string[]
}>();

const { t, te } = useI18n();

const permitted = computed(() => !props.permissions || isScopePermitted(props.domain, props.scope, props.permissions));

const title = computed(() => {
  const domainTitle = te(`${props.domain}.title`) ? t(`${props.domain}.title`) : props.domain;
  const scopeLabel = te(`common.scopes.${props.scope}`) ? t(`common.scopes.${props.scope}`) : "";
  if (!scopeLabel) return domainTitle;
  return `${domainTitle} — ${scopeLabel}`;
});
</script>
