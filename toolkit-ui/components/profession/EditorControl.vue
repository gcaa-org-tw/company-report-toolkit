<template lang="pug">
.editorControl.pa3
  .f6.gray {{ report.company.abbreviation }} {{ report.year }} 報告書
  .flex.mb3.mt2.pb3.bb.b--moon-gray
    .flex-auto
      h1.fw6.f4.mt0.mb2.black {{ fieldMeta.name }}
      p.gray.f6.mv0.lh-copy {{ fieldMeta.description }}
  .editorControl__keywordSection.pb2.mb3.bb.b--moon-gray
    .fw5.mb1 相關關鍵字
    .f6.gray 點選以下關鍵字，或是自行輸入，就能搜出相關頁面
    search-panel(
      :report="report"
      :field-meta="fieldMeta"
      @matched-pages="updateMatchedPages"
      @page="gotoPage"
    )
  form.fieldForm.pb2.mb3.bb.b--moon-gray(@submit.prevent="submitFieldData")
    .fw5.mb2 填寫判讀結果
    .flex.items-center.mb2
      label.fieldForm__value.flex-auto.mr3 數值
        input.fieldForm__input(
          v-model.trim="fieldData.value"
          type="text"
          placeholder="數值"
        )
      label.fieldForm__unit.flex-none 單位
        input.fieldForm__input(
          v-model.trim="fieldData.unit"
          type="text"
          placeholder="單位"
        )
    .tr
      button.fieldForm__submit.pv2.ph3.bw0.bg--green.tc.w4.pointer(:disabled="!canSubmitData")
        | 儲存
</template>
<script lang="ts" setup>
import { fieldMetaSchema } from '~/libs/feathers/services/field-meta/field-meta.schema'
import { reportFieldSchema } from '~/libs/feathers/services/report-field/report-field.schema'
import { reportSchema } from '~/libs/feathers/services/report/report.schema'

const { feathers } = useProfessionApi()

const props = defineProps<{
  report: typeof reportSchema
  reportField: typeof reportFieldSchema
  fieldMeta: typeof fieldMetaSchema
}>()

const emit = defineEmits(['page', 'matched-pages', 'complete'])

function updateMatchedPages (matchedPages: number[]): void {
  emit('matched-pages', matchedPages)
}

function gotoPage (payload: any): void {
  emit('page', payload)
}

// submission

const fieldData = ref({ value: '', unit: '' })

const canSubmitData = computed(() => {
  return fieldData.value.value && fieldData.value.unit
})

watch(() => props.reportField, (newField) => {
  fieldData.value.value = newField.value
  fieldData.value.unit = newField.unit
})

async function submitFieldData () {
  await feathers.app.service('report-field').patch(props.reportField.id, {
    value: fieldData.value.value,
    unit: fieldData.value.unit
  })
}

</script>
<style lang="scss" scoped>
.editorControl {

}

.fieldForm {
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
