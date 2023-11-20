<template>
  <div class="stats pa4 lh-copy">
    <div class="pb3">
      <h1 class="f2 fw6">使用狀況統計</h1>
      <p class="f4 mb4">
        這裡只會顯示有判讀過的報告書，若要下載原始資料，請在下拉選單選取「原始資料」。
      </p>
    </div>
    <div class="pv3 flex items-center justify-end mb4 bt bb b--moon-gray">
      <select v-model="curStatsType" class="stats__control">
        <option v-for="statsType in statsTypeList" :key="statsType" :value="statsType">
          {{ statsType }}
        </option>
      </select>
    </div>
    <div v-if="curStatsType === StatsType.report" class="f6">
      <table class="w-100 ba b--moon-gray" cellspacing="0">
        <thead>
          <tr class="bg-light-gray tl">
            <th class="pv2 ph3">公司名稱</th>
            <th class="pv2 ph3">統編</th>
            <th class="pv2 ph3">股票代碼</th>
            <th class="pv2 ph3">報告書年度</th>
            <th class="pv2 ph3">填答完成度</th>
            <th class="pv2 ph3">是否驗證完畢</th>
            <th class="pv2 ph3">目前累計時間（分）</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="report in reportList" :key="report.id">
            <td class="pv2 ph3 bt b--moon-gray">{{ report.company.name }}</td>
            <td class="pv2 ph3 bt b--moon-gray">{{ report.company.id }}</td>
            <td class="pv2 ph3 bt b--moon-gray">{{ report.company.stockCode }}</td>
            <td class="pv2 ph3 bt b--moon-gray">{{ report.year }}</td>
            <td class="pv2 ph3 bt b--moon-gray">{{ report.answeredFields }}/{{ report.totalFields }}</td>
            <td class="pv2 ph3 bt b--moon-gray">{{ report.isVerified ? '✅' : '-' }}</td>
            <td class="pv2 ph3 bt b--moon-gray">{{ timeInMin(report) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else class="f6">
      <ProfessionDetailStats :report-list="reportList" :stats-type="curStatsType" />
    </div>
  </div>
</template>
<script lang="ts">
import { Report } from '~/libs/feathers/services/report/report.shared'
export enum StatsType {
  report = '各報告書',
  fieldMeta = '各欄位',
  reportField = '原始資料'
}
</script>
<script lang="ts" setup>
const { feathers } = useProfessionApi()

const statsTypeList = Object.values(StatsType)
const curStatsType = ref(StatsType.report)

const reportList = ref<Report[]>([])

function timeInMin (report: Report) {
  return Math.round(report.timeSpentInSeconds * 10 / 60) / 10
}

function getAllReport () {
  feathers.app
    .service('report')
    .find({
      query: {
        timeSpentInSeconds: { $gt: 0 },
        $limit: 500
      }
    })
    .then((res: any) => {
      reportList.value = res.data
    })
}

watchImmediate(
  feathers.isReady,
  (isReady) => {
    if (isReady) {
      getAllReport()
    }
  }
)

</script>
<style lang="scss">
.stats {
  width: $professionWidth;
  max-width: 100vw;
  margin: 0 auto;

  &__control {
    height: 2rem;
    padding: 0 0.5rem;
  }
}
</style>
