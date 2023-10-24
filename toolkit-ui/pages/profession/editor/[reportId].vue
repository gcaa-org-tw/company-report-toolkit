<template lang="pug">
.editor(v-if="report")
  .editor__control.pa3.br.b--moon-gray
    .f4.mb3 跳到以下頁次
    .flex.flex-wrap
      .mr3.mb3
        button.pv2.ph4.ba.b--moon-gray.br2.mr3.mb3.black.dim(
          v-for="pageIndex in samplePageIndex"
          :key="pageIndex"
          @click="gotoPage(pageIndex)"
        ) {{ pageIndex }}
    .mv3
      .f4.mb3 最後瀏覽頁次
      .ba.b--moon-gray.pv2.ph4 {{ lastFocusPageIndex }}
  .editor__viewer
    pdf-viewer(
      v-if="reportPage"
      :year="report.year"
      :company="report.company"
      :page="reportPage.page"
      :highlight="reportPage.highlight"
      :matched-pages="matchedPages"
      @view-page="handleViewPage"
    )
</template>
<script lang="ts" setup>
import type { reportSchema } from '~/libs/feathers/services/report/report.schema'

const route = useRoute()
const reportId = route.params.reportId as string
const { feathers } = useProfessionApi()

const report = ref<typeof reportSchema>()

function getReport () {
  feathers.app.service('report').get(reportId).then((res: typeof reportSchema) => {
    report.value = res
  })
}

watchEffect(() => {
  if (feathers.isReady.value) {
    getReport()
  }
})

// const { params: { year, companyId } } = useRoute()
// const company = reportMap[0].reports.find(report => report.id === companyId)
// const report = { year, company }

const reportPage = ref({ page: 1, highlight: '' })
const matchedPages = ref([])

const samplePageIndex = [10, 30, 70, 88, 89, 90, 100]

function gotoPage (page: number) {
  page = page - (report.value.pageOffset || 0)
  reportPage.value = { page, highlight: '' }
}

const lastFocusPageIndex = ref(0)

function handleViewPage (pageIndex: number) {
  lastFocusPageIndex.value = pageIndex
}

</script>
<style lang="scss">
.editor {
  display: grid;
  grid-template-columns: 16rem 1fr;
}
</style>
