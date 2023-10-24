<template lang="pug">
.editor(v-if="isDataReady")
  profession-editor-control.br.b--moon-gray(
    :report="report"
    :report-field="reportField"
    :field-meta="fieldMeta"
    @page="changePage"
    @matched-pages="updateMatchedPages"
  )
  // .mv3
    .f4.mb3 最後瀏覽頁次
    .ba.b--moon-gray.pv2.ph4 {{ lastFocusPageIndex }}
  .editor__viewer
    pdf-viewer(
      v-if="reportPage"
      :year="report.year"
      :report="report"
      :page="reportPage.page"
      :highlight="reportPage.highlight"
      :matched-pages="matchedPages"
      @view-page="handleViewPage"
    )
</template>
<script lang="ts" setup>
import { reportFieldSchema } from '~/libs/feathers/services/report-field/report-field.schema'

// import type { reportSchema } from '~/libs/feathers/services/report/report.schema'

// const { feathers } = useProfessionApi()
const route = useRoute()
const reportId = computed(() => {
  return Number.parseInt(route.params.reportId as string)
})

const { report, reportFieldList, isDataReady, meta } = useReport(reportId.value)

const reportFieldId = computed(() => {
  return Number.parseInt(route.params.fieldId as string)
})

const reportField = computed(() => {
  const target = reportFieldList.value.find((field: typeof reportFieldSchema) => {
    return field.id === reportFieldId
  })

  return target || reportFieldList.value[0]
})

const fieldMeta = computed(() => {
  return meta(reportField.value)
})

// navigation & search

const reportPage = ref({ page: 1, highlight: '' })
const matchedPages = ref([])
const lastFocusPageIndex = ref(0)

function handleViewPage (pageIndex: number) {
  lastFocusPageIndex.value = pageIndex
}

function changePage (newPage) {
  reportPage.value = newPage
}

function updateMatchedPages (matched) {
  matchedPages.value = matched
}

</script>
<style lang="scss">
.editor {
  display: grid;
  grid-template-columns: 20rem 1fr;
}
</style>
