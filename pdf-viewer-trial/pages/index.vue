<template lang="pug">
.mw8.center.mv4
  h1.f1 企業永續報告書閱讀器
  .mv3.bt.bb.pv3
    .mb3(v-for="meta in reportMap" :key="meta.year")
      h2.f3 {{ meta.year }}
      .flex.mt2.items-center
        button.ph3.pv2.bg-white.mr3.ba.b--black.pointer(
          v-for="company in meta.reports"
          :key="company.id"
          @click="selectReport(meta.year, company)"
        ) {{ company.name }}
  interpellation-src-viewer(
    ref="pdfViewer"
    :start-page="1"
    :year="year"
    :company-id="companyId"
  )
</template>
<script setup lang="ts">
import { ref, nextTick } from 'vue'

const reportMap = [
  {
    year: 2020,
    reports: [
      { id: '03707901', name: '中油' },
      { id: '30414175', name: '中鋼' },
      { id: '68919301', name: '南紡' },
      { id: '69651695', name: '世紀風電' }
    ]
  },
  {
    year: 2021,
    reports: [
      { id: '07838854', name: '中鴻' },
      { id: '11913502', name: '台泥' },
      { id: '89406518', name: '台塑' }
    ]
  }
]

const year = ref(2021)
const companyId = ref('07838854')
const pdfViewer = ref(null)

async function selectReport (targetYead: number, report: any) {
  year.value = targetYead
  companyId.value = report.id
  await nextTick()
  console.warn('??', pdfViewer.value)
  pdfViewer.value?.show()
}

</script>
