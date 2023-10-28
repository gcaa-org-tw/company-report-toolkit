<template lang="pug">
.editor(v-if="isDataReady")
  profession-editor-control.editor__control.br.b--moon-gray(
    :report="report"
    :report-field="reportField"
    :field-meta="fieldMeta"
    @page="changePage"
    @matched-pages="updateMatchedPages"
    @next="gotoNextField"
    @prev="gotoPrevField"
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
