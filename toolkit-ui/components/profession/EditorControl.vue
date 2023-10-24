<template lang="pug">
.editorControl.pa3
  .f6.gray {{ report.company.abbreviation }} {{ report.year }} 報告書
  .flex.mb3.mt2.pb3.bb.b--moon-gray
    .flex-auto
      h1.fw6.f4.mt0.mb2.black {{ fieldMeta.name }}
      p.gray.f6.mv0.lh-copy {{ fieldMeta.description }}
  .editorControl__keywordSection.mv3.pv2.bb.b--moon-gray
    .fw5.mb1 相關關鍵字
    .f6.gray 點選以下關鍵字，或是自行輸入，就能搜出相關頁面
    search-panel(
      :report="report"
      :field-meta="fieldMeta"
      @matched-pages="updateMatchedPages"
      @page="gotoPage"
    )
</template>
<script lang="ts" setup>
import { fieldMetaSchema } from '~/libs/feathers/services/field-meta/field-meta.schema'
import { reportFieldSchema } from '~/libs/feathers/services/report-field/report-field.schema'
import { reportSchema } from '~/libs/feathers/services/report/report.schema'

defineProps<{
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

</script>
<style lang="scss" scoped>
.editorControl {

}
</style>
