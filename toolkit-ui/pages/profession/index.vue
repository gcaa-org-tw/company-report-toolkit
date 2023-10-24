<template lang="pug">
.profession.pa4.lh-copy
  .profession__header.mb5.pb3.bb.b--moon-gray.tc
    h1.f2.fw6 企業永續報告書列表
    p.f4 快速查找近兩年產業報告書，個別報告書驗證進度
  .profession__industryList.justify-center
    profession-industry-card(
      v-for="industry in industryList"
      :key="industry.name"
      :industry-stats="industry"
    )
</template>
<script lang="ts" setup>
import { reportSchema } from '~/libs/feathers/services/report/report.schema'
import { mergeReportStats } from '~/utils/industryStats'
import type { IndustryStatsMap } from '~/utils/industryStats'

const { feathers } = useProfessionApi()

const reportList = ref([])
const industryList = computed(() => {
  const industryMap: IndustryStatsMap = {}
  reportList.value.forEach((report: typeof reportSchema) => {
    mergeReportStats(industryMap, report)
  })
  return Object
    .values(industryMap)
    .sort((a, b) => b.total - a.total)
})

function getReportList () {
  feathers.app
    .service('report')
    .find({
      query: {
        $limit: 500
      }
    })
    .then((res: any) => {
      reportList.value = res.data
    })
}

watchEffect(() => {
  if (feathers.isReady.value) {
    getReportList()
  }
})

</script>
<style lang="scss">
.profession {
  width: 74rem;
  max-width: 100vw;
  margin: 0 auto;

  &__industryList {
    display: grid;
    grid-template-columns: repeat(auto-fit, 16rem);
    grid-gap: 1rem;
  }
}
</style>
