<template>
  <div class="detailStats">
    <h1 v-if="loadingProgress < 100" class="mv5 tc f2">
      資料載入中...
      <span class="fw7">{{ loadingProgress }}%</span>
    </h1>
    <template v-else-if="statsType === StatsType.reportField">
      <table class="w-100 ba b--moon-gray" cellspacing="0">
        <thead>
          <tr class="bg-light-gray tl">
            <th>公司名稱</th>
            <th>年度</th>
            <th>欄位名稱</th>
            <th>填答時間（分）</th>
            <th>管理員改過</th>
            <th>無法填答</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="field in reportFieldList" :key="field.id">
            <td>{{ reportMap.get(field.reportId).company.name }}</td>
            <td>{{ reportMap.get(field.reportId).year }}</td>
            <td>{{ fieldMetaMap.get(field.fieldId).name }}</td>
            <td>{{ timeInMin(field.timeSpentInSeconds) }}</td>
            <td>{{ field.hasAdminEdited ? '✅' : '-' }}</td>
            <td>{{ field.value === NA_VALUE ? '✅' : '-' }}</td>
          </tr>
        </tbody>
      </table>
    </template>
    <template v-else-if="statsType === StatsType.fieldMeta">
      <table class="w-100 ba b--moon-gray" cellspacing="0">
        <thead>
          <tr class="bg-light-gray tl">
            <th>欄位名稱</th>
            <th>平均填答時間（分）</th>
            <th>中位數填答時間（分）</th>
            <th>標準差填答時間（分）</th>
            <th>管理員改過比例</th>
            <th>填答次數</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="fieldMeta in visibleFieldMetaList" :key="fieldMeta.id">
            <td>{{ fieldMeta.name }}</td>
            <td>{{ timeInMin(perFieldMetaStats.get(fieldMeta.id)?.meanTimeSpent || 0) }}</td>
            <td>{{ timeInMin(perFieldMetaStats.get(fieldMeta.id)?.medianTimeSpent || 0) }}</td>
            <td>{{ timeInMin(perFieldMetaStats.get(fieldMeta.id)?.stdTimeSpend || 0) }}</td>
            <td>{{ perFieldMetaStats.get(fieldMeta.id)?.adminEditRatio || 0 }}%</td>
            <td>{{ perFieldMetaStats.get(fieldMeta.id)?.count || 0 }}</td>
          </tr>
        </tbody>
      </table>
    </template>
  </div>
</template>
<script lang="ts" setup>
import stats from 'stats-lite'
import { Report } from '~/libs/feathers/services/report/report.shared'
import { ReportField } from '~/libs/feathers/services/report-field/report-field.shared'
import { StatsType } from '~/pages/profession/stats.vue'
import { NA_VALUE } from '~/components/AnswerPanel.vue'

const props = defineProps<{
  reportList: Report[],
  statsType: StatsType
}>()

const { feathers } = useProfessionApi()
const { fieldMetaList, fieldMetaMap } = useFieldMeta()

const reportFieldList = ref<ReportField[]>([])
const loadingProgress = ref(0)

const reportMap = computed(() => {
  const map = new Map<number, Report>()
  for (const report of props.reportList) {
    map.set(report.id, report)
  }
  return map
})

type FieldMetaStats = {
  timeSpentList: number[],
  meanTimeSpent: number,
  medianTimeSpent: number,
  stdTimeSpend: number,
  adminEditCount: number,
  adminEditRatio: number,
  count: number
}

const perFieldMetaStats = computed(() => {
  const statsMap = new Map<number, FieldMetaStats>()

  reportFieldList.value.forEach((field) => {
    if (!statsMap.has(field.fieldId)) {
      statsMap.set(field.fieldId, {
        timeSpentList: [],
        meanTimeSpent: 0,
        medianTimeSpent: 0,
        stdTimeSpend: 0,
        adminEditCount: 0,
        adminEditRatio: 0,
        count: 0
      })
    }
    const fieldStats = statsMap.get(field.fieldId)!
    fieldStats.timeSpentList.push(field.timeSpentInSeconds)
    fieldStats.adminEditCount += field.hasAdminEdited ? 1 : 0
    fieldStats.count += 1
  })

  for (const [, fieldStats] of statsMap) {
    fieldStats.meanTimeSpent = stats.mean(fieldStats.timeSpentList)
    fieldStats.medianTimeSpent = stats.median(fieldStats.timeSpentList)
    fieldStats.stdTimeSpend = stats.stdev(fieldStats.timeSpentList)
    fieldStats.adminEditRatio = Math.round(fieldStats.adminEditCount * 100 / fieldStats.count)
  }

  return statsMap
})

const visibleFieldMetaList = computed(() => {
  return fieldMetaList.value.filter(fieldMeta => perFieldMetaStats.value.has(fieldMeta.id))
})

function timeInMin (timeSpentInSeconds: number) {
  return Math.round(timeSpentInSeconds * 10 / 60) / 10
}

function loadOnePageFieldData (skip = 0) {
  return feathers.app.service('report-field')
    .find({
      query: {
        timeSpentInSeconds: { $gt: 0 },
        $select: ['fieldId', 'reportId', 'timeSpentInSeconds', 'hasAdminEdited', 'value'],
        $limit: 500,
        $sort: {
          reportId: 1,
          fieldId: 1
        },
        $skip: skip
      }
    })
}

async function getAllReportField () {
  // each year, we will get 150 reports * 50 fields = 7500 records
  // may require performance tuning in the future
  let skipCursor = 0
  const tempReportFieldList: ReportField[] = []
  while (true) {
    const reportFieldResp = await loadOnePageFieldData(skipCursor)
    tempReportFieldList.push(...reportFieldResp.data)

    if (!reportFieldResp.data.length) {
      loadingProgress.value = 100
      break
    }
    skipCursor = reportFieldResp.skip + reportFieldResp.data.length
    loadingProgress.value = Math.floor(skipCursor * 100 / reportFieldResp.total)
  }
  reportFieldList.value = tempReportFieldList
}

watchImmediate(
  feathers.isReady,
  (isReady) => {
    if (isReady) {
      getAllReportField()
    }
  }
)

</script>
<style lang="scss">
.detailStats {
  th {
    padding: 0.5rem 1rem;
  }
  td {
    padding: 0.5rem 1rem;
    border-top: 1px solid #ccc;
  }
}
</style>
