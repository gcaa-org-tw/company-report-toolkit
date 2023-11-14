<template>
  <div class="cellValue">
    <div v-if="isEmpty" class="moon-gray">尚未判讀</div>
    <template v-else>
      <div v-if="reportField.value" class="cellValue__value">
        {{ reportField.value }} {{ reportField.unit }}
      </div>
      <div v-if="reportField.notes" class="f6 gray">
        {{ reportField.notes }}
      </div>
    </template>
  </div>
</template>
<script lang="ts" setup>
import { reportFieldSchema } from '~/libs/feathers/services/report-field/report-field.schema'
import { fieldMetaSchema } from '~/libs/feathers/services/field-meta/field-meta.schema'

const props = defineProps<{
  reportField: typeof reportFieldSchema | undefined
  filedMeta: typeof fieldMetaSchema
}>()

const isEmpty = computed(() => {
  return !props.reportField || (!props.reportField.value && !props.reportField.notes)
})

</script>
<style lang="scss" scoped>
</style>
