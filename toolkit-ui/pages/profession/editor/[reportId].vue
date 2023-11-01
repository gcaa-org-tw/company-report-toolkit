<template lang="pug">
.editor(v-if="isDataReady")
  profession-editor-control.editor__control.br.b--moon-gray(
    :report="report"
    :report-field="reportField"
    :field-meta="fieldMeta"
    :focused-page="lastFocusPageIndex"
    @page="changePage"
    @matched-pages="updateMatchedPages"
    @next="gotoNextField"
    @prev="gotoPrevField"
    @report-field="updateReportField"
  )
  // .mv3
    .f4.mb3 最後瀏覽頁次
    .ba.b--moon-gray.pv2.ph4 {{ lastFocusPageIndex }}
  .editor__viewer
    profession-pdf-viewer(
      v-if="reportPage"
      :year="report.year"
      :report="report"
      :page="reportPage.page"
      :highlight="reportPage.highlight"
      :matched-pages="matchedPages"
      @view-page="handleViewPage"
      @reload="reloadPage"
    )
</template>
<script lang="ts" setup>
import { reportFieldSchema } from '~/libs/feathers/services/report-field/report-field.schema'

const route = useRoute()
const reportId = computed(() => {
  return Number.parseInt(route.params.reportId as string)
})

const { report, reportFieldList, isDataReady, meta } = useReport(reportId.value)

const reportFieldId = computed(() => {
  return Number.parseInt(route.query.fieldId as string)
})

const reportField = computed(() => {
  const target = reportFieldList.value.find((field: typeof reportFieldSchema) => {
    return field.id === reportFieldId.value
  })

  return target || reportFieldList.value[0]
})

const snackbar = useSnackbar()
const COMPLETED_MESSAGE = '看完收工！ 🎉 找找頁面左上角，就能回上一層'

function updateReportField (newValue: typeof reportFieldSchema) {
  Object.keys(newValue).forEach((key) => {
    reportField.value[key] = newValue[key]
  })
  const duration = progressMessage.value === COMPLETED_MESSAGE ? 8000 : 4000
  snackbar.add({
    type: 'success',
    duration,
    text: progressMessage.value
  })
}

const fieldMeta = computed(() => {
  return meta(reportField.value)
})

const LAST_N_FIELDS = 5
const progressMessage = computed(() => {
  const completedField = reportFieldList.value
    .filter((field: typeof reportFieldSchema) => {
      return !!field.value
    }).length

  const totalField = reportFieldList.value.length
  const remainedField = totalField - completedField

  if (!remainedField || remainedField) {
    return COMPLETED_MESSAGE
  } else if (remainedField <= LAST_N_FIELDS) {
    return `最後 ${remainedField} 個欄位！ 🧙`
  } else {
    return `已完成 ${completedField} / ${totalField} 個欄位 🤖`
  }
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

const router = useRouter()
const curFieldIndex = computed(() => {
  return reportFieldList.value.findIndex((field: typeof reportFieldSchema) => {
    return field.id === reportFieldId.value
  })
})

function gotoNextField () {
  let nextIndex = curFieldIndex.value + 1
  if (nextIndex === reportFieldList.value.length) {
    nextIndex = 0
  }

  router.push({
    name: 'profession-editor-reportId',
    params: {
      reportId: reportId.value
    },
    query: {
      fieldId: reportFieldList.value[nextIndex].id
    }
  })
}

function gotoPrevField () {
  let prevIndex = curFieldIndex.value - 1
  if (prevIndex < 0) {
    prevIndex = reportFieldList.value.length - 1
  }

  router.push({
    name: 'profession-editor-reportId',
    params: {
      reportId: reportId.value
    },
    query: {
      fieldId: reportFieldList.value[prevIndex].id
    }
  })
}

function reloadPage () {
  // force reload to trigger init hook
  window.location.reload()
}

</script>
<style lang="scss">
.editor {
  display: grid;
  grid-template-columns: 20rem 1fr;

  &__control {
    height: calc(100vh - #{$bannerHeight});
    overflow-y: auto;
  }
}
</style>
