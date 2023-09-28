<template lang="pug">
.profession.flex.items-center.ph3.mv5.mv6-l
  .center.mw8.lh-copy
    h1 先擺個測試頁
    .mv3.bt.b--light-gray.pv3.flex.flex-wrap
      nuxt-link.pv2.ph4.ba.b--moon-gray.br2.mr3.mb3.black.no-underline.dim(
        v-for="report in reportList"
        :key="report.id"
        :to="`/profession/editor/${report.year}/${report.id}`"
      ) {{ report.name }} - {{ report.year }}
</template>
<script lang="ts" setup>
import reportMap from '~/assets/report-list.yml'

const reportList = reportMap[0].reports.map((report) => {
  return {
    ...report,
    year: 2021
  }
})
</script>
