<template lang="pug">
.industry.pa4.lh-copy(v-if="reportList.length" :class="{ 'industry--wide': isDetailMode }")
  .pb3
    h1.tc.f2.fw6.mb2 {{ industryName }}
    p.tc.f3.mv2 {{ industryStats.total }} 本
    .w5.center
      profession-field-progress(:progress="industryStats")
  .pv3.mb4.bt.bb.b--moon-gray.flex.justify-between
    div(v-if="isDetailMode")
      button.industry__filter.bg-white.pv2.ph3.ba.b--light-gray.br2.dim.pointer(
        v-for="year in yearList"
        :key="year"
        :class="{ 'bg-green': curYear === year }"
        @click="setYear(year)"
      ) {{ year }}
    div(v-else)
      button.industry__filter.bg-white.pv2.ph3.ba.b--light-gray.br2.dim.pointer(
        v-for="theType in Object.values(FilterType)"
        :key="theType"
        :class="{ 'bg-green': filter === theType }"
        @click="changeFilter(theType)"
      ) {{ theType }}
    .industry__modeList
      button.industry__mode.bg-white.pv2.ph3.ba.b--light-gray.br2.dim.pointer(
        v-for="theMode in Object.values(PageMode)"
        :key="theMode"
        :class="{ 'industry__mode--active': pageMode === theMode }"
        @click="pageMode = theMode"
      ) {{ theMode }}
  div(v-if="isDetailMode")
    ProfessionIndustryDetail(:report-list="reportsOfYear" :industry="industryName" :year="curYear")
  .pa4(v-else)
    ProfessionReportList(:report-list="reportList" :filter="filter")
</template>
<script lang="ts">
import _ from 'lodash'
import { reportSchema } from '~/libs/feathers/services/report/report.schema'
import type { IndustryStatsMap } from '~/utils/industryStats'

export enum FilterType {
  all = '全部',
  verified = '已驗證',
  isAnswered = '判讀完成',
  pending = '待判讀'
}

enum PageMode {
  list = '報告書列表',
  detail = '所有欄位資料'
}

</script>
<script lang="ts" setup>
const route = useRoute()
const industryName = route.params.industry as string
const { feathers } = useProfessionApi()

const reportList = ref<typeof reportSchema[]>([])
const filter = ref(FilterType.all)

const curYear = ref(0)
const yearList = computed(() => {
  return _.uniq(
    reportList.value.map((report: typeof reportSchema) => report.year)
  )
})
function setYear (year: number) {
  curYear.value = year
}

const reportsOfYear = computed(() => {
  return reportList.value.filter(
    (report: typeof reportSchema) => report.year === curYear.value
  )
})

const pageMode = ref(PageMode.list)

const isDetailMode = computed(() => pageMode.value === PageMode.detail)

function changeFilter (type: FilterType) {
  filter.value = type
}

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
        $limit: 500,
        $sort: {
          year: -1
        }
      }
    })
    .then((res: any) => {
      reportList.value = res.data
      if (res.data.length) {
        curYear.value = res.data[0].year
      }
    })
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

  &--wide {
    width: 100vw;
  }

  &__filter {
    &:not(:last-child) {
      margin-right: 1rem;
    }
  }

  &__mode {
    &:first-child {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
    &:last-child {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }

    &--active {
      background: #137752;
      color: white;
    }
  }
}
</style>
