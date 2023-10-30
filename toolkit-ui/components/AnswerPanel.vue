<template>
  <div class="answerPanel">
    <form class="answerPanel__form pb2 bb b--moon-gray" @submit.prevent="submitFieldData">
      <div class="fw5 mb2">填寫判讀結果</div>
      <div class="flex items-center mb2">
        <div class="answerPanel__value flex-auto mr3">
          數值
          <template v-if="valueInputType !== 'radio'">
            <input
              v-model.trim="fieldData.value"
              :type="valueInputType"
              class="answerPanel__input"
              placeholder="數值"
            />
          </template>
          <div v-else class="answerPanel__input pv2">
            <label class="mr2">
              <input
                v-model="fieldData.value"
                type="radio"
                name="answerValue"
                value="是"
              />
              是
            </label>
            <label>
              <input
                v-model="fieldData.value"
                type="radio"
                name="answerValue"
                value="否"
              />
              否
            </label>
          </div>
        </div>
        <label v-show="shouldShowUnit" class="answerPanel__unit flex-none">
          單位
          <select v-model="fieldData.unit" name="answerUnit" class="answerPanel__input">
            <option v-for="unit in fieldMeta.units" :key="unit" :value="unit">{{ unit }}</option>
          </select>
        </label>
      </div>
      <div class="tr">
        <button
          :disabled="!canSubmitData"
          class="answerPanel__submit pv2 ph3 bw0 bg--green tc w4 pointer"
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
  return fieldData.value.value && (fieldData.value.unit || !shouldShowUnit.value)
})

const NULL_UNIT = new Set(['無', 'NA'])

const shouldShowUnit = computed(() => {
  if (!props.fieldMeta.units) {
    return false
  } else {
    return props.fieldMeta.units.some((unit: string) => !NULL_UNIT.has(unit))
  }
})

const TYPE_MAP: { [key: string]: string } = {
  number: 'number',
  string: 'text',
  boolean: 'radio'
}

const valueInputType = computed(() => {
  return TYPE_MAP[props.fieldMeta.dataType] || 'text'
})

watchEffect(() => {
  if (props.reportField) {
    fieldData.value.value = props.reportField.value || ''
    fieldData.value.unit = props.reportField.unit || ''
  }
})

async function submitFieldData () {
  await feathers.app.service('report-field').patch(props.reportField.id, {
    value: fieldData.value.value.toString(),
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
    width: 8rem;
  }
  &__input {
    border: none;
    background: none;
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
