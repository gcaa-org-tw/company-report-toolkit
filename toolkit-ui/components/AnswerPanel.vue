<template>
  <div class="answerPanel">
    <form class="answerPanel__form pb2 bb b--moon-gray" @submit.prevent="submitFieldData">
      <div class="fw5 mb2">填寫判讀結果</div>
      <div class="flex items-center mb2">
        <label class="answerPanel__value flex-auto mr3">
          數值
          <input
            v-model.trim="fieldData.value"
            type="text"
            class="answerPanel__input"
            placeholder="數值"
          />
        </label>
        <label class="answerPanel__unit flex-none">
          單位
          <input
          v-model.trim="fieldData.unit"
            type="text"
            class="answerPanel__input"
            placeholder="單位"
          />
        </label>
      </div>
      <div class="tr">
        <button
          :disabled="!canSubmitData"
          class="fieldForm__submit pv2 ph3 bw0 bg--green tc w4 pointer"
        >儲存</button>
      </div>
    </form>
  </div>
</template>
<script lang="ts" setup>
import { reportSchema } from '~/libs/feathers/services/report/report.schema'
import { reportFieldSchema } from '~/libs/feathers/services/report-field/report-field.schema'
import { fieldMetaSchema } from '~/libs/feathers/services/field-meta/field-meta.schema'

const props = defineProps<{
  report: typeof reportSchema
  reportField: typeof reportFieldSchema
  fieldMeta: typeof fieldMetaSchema
}>()

const emit = defineEmits(['next'])

const { feathers } = useProfessionApi()

const fieldData = ref({ value: '', unit: '' })

const canSubmitData = computed(() => {
  return fieldData.value.value && fieldData.value.unit
})

watchEffect(() => {
  if (props.reportField) {
    fieldData.value.value = props.reportField.value || ''
    fieldData.value.unit = props.reportField.unit || ''
  }
})

async function submitFieldData () {
  await feathers.app.service('report-field').patch(props.reportField.id, {
    value: fieldData.value.value,
    unit: fieldData.value.unit
  })
  emit('next')
}

</script>
<style scoped lang="scss">
.answerPanel {
  label {
    font-size: 0.875rem;
    color: #666;
  }
  &__unit {
    width: 6rem;
  }
  &__input {
    border: none;
    border-bottom: 1px solid #ccc;
    outline: none;
    width: 100%;
    font-size: 1rem;
    color: black;
  }
  &__submit {
    &:disabled {
      cursor: not-allowed;
    }
  }
}
</style>
