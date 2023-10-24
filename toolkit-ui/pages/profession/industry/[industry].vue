<template lang="pug">
.industry.pa4.lh-copy(v-if="industryStats")
  .pb3
    h1.tc.f2.fw6.mb2 {{ industryName }}產業
    p.tc.f3.mv2 {{ industryStats.total }} 本
    .w5.center
      profession-field-progress(:progress="industryStats")
  .pv3.mb4.bt.bb.b--moon-gray.flex.justify-center
    button.industry__filter.bg-white.pv2.ph3.ba.b--light-gray.br2.dim.pointer(
      v-for="theType in Object.values(filterType)"
      :key="theType"
      :class="{ 'bg-green': filter === theType }"
      @click="changeFilter(theType)"
    ) {{ theType }}
  .pa4
    .industry__report
      .industry__cell 公司名稱
      .industry__cell 年份
      .industry__cell 進度
      .industry__cell 更新時間
    template(v-if="visibleReportList.length")
      .industry__report(
        v-for="report in visibleReportList"
        :key="report.id"
      )
        .industry__cell {{ report.company.name }}
        .industry__cell {{ report.year }}
        .industry__cell
          profession-field-progress(:progress="report" :is-industry="false")
        .industry__cell {{ readableDate(report.updatedAt) }}
    .pa2.tc(v-else) 此分類無 資料
</template>
<script lang="ts" setup>
import dayjs from 'dayjs'
import type { reportSchema } from '~/libs/feathers/services/report/report.schema'
import type { IndustryStatsMap } from '~/utils/industryStats'

const route = useRoute()
const industryName = route.params.industry as string

enum filterType {
  all = '全部',
  verified = '已驗證',
  isAnswered = '判讀完成',
  pending = '待判讀'
}

const { feathers } = useProfessionApi()

const reportList = ref([])
const filter = ref(filterType.all)

function changeFilter (type: filterType) {
  filter.value = type
}

const visibleReportList = computed(() => {
  if (filter.value === filterType.all) {
    return reportList.value
  }
  return reportList.value.filter((report: typeof reportSchema) => {
    if (filter.value === filterType.verified) {
      return report.isVerified
    }
    if (filter.value === filterType.isAnswered) {
      return report.answeredFields === report.totalFields
    }
    return report.answeredFields < report.totalFields
  })
})

const industryStats = computed(() => {
  const industryMap: IndustryStatsMap = {}
  reportList.value.forEach((report: typeof reportSchema) => {
    mergeReportStats(industryMap, report)
  })
  return industryMap[industryName]
})

async function getReportList () {
  const companyInIndustry = await feathers.app.service('company').find({
    query: {
      industry: industryName,
      $select: ['id'],
      // company can be more than 100
      $limit: 500
    }
  })

  const companyIds = companyInIndustry.data.map((item: any) => item.id)

  feathers.app
    .service('report')
    .find({
      query: {
        companyId: {
          $in: companyIds
        },
        $limit: 500
      }
    })
    .then((res: any) => {
      reportList.value = res.data
    })
}

function readableDate (date: string) {
  return dayjs(date).format('YYYY/MM/DD HH:mm')
}

watchEffect(() => {
  if (feathers.isReady.value) {
    getReportList()
  }
})

</script>
<style lang="scss">
.industry {
  width: $professionWidth;
  max-width: 100vw;
  margin: 0 auto;

  &__filter {
    &:not(:last-child) {
      margin-right: 1rem;
    }
  }

  &__report {
    display: grid;
    grid-template-columns: 2fr 0.75fr 1.5fr 1fr;
    grid-gap: 0.5rem;
    padding: 0.5rem 0;
    align-items: center;
    border-bottom: 1px solid #ccc;
  }

  &__cell {
    padding: 0 0.5rem;
  }
}
</style>
