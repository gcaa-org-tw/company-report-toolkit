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
          </tr>
        </thead>
        <tbody>
          <tr v-for="field in reportFieldList" :key="field.id">
            <td>{{ reportMap.get(field.reportId).company.name }}</td>
            <td>{{ reportMap.get(field.reportId).year }}</td>
            <td>{{ fieldMetaMap.get(field.fieldId).name }}</td>
            <td>{{ timeInMin(field) }}</td>
            <td>{{ field.hasAdminEdited ? '✅' : '-' }}</td>
          </tr>
        </tbody>
      </table>
    </template>
  </div>
</template>
<script lang="ts" setup>
import { Report } from '~/libs/feathers/services/report/report.shared'
import { ReportField } from '~/libs/feathers/services/report-field/report-field.shared'
import { StatsType } from '~/pages/profession/stats.vue'

const props = defineProps<{
  reportList: Report[],
  statsType: StatsType
}>()

const { feathers } = useProfessionApi()
const { fieldMetaMap } = useFieldMeta()

const reportFieldList = ref<ReportField[]>([])
const loadingProgress = ref(0)

const reportMap = computed(() => {
  const map = new Map<number, Report>()
  for (const report of props.reportList) {
    map.set(report.id, report)
  }
  return map
})

function timeInMin (field: ReportField) {
  return Math.round(field.timeSpentInSeconds / 60)
}

function loadOnePageFieldData (skip = 0) {
  return feathers.app.service('report-field')
    .find({
      query: {
        timeSpentInSeconds: { $gt: 0 },
        $select: ['fieldId', 'reportId', 'timeSpentInSeconds', 'hasAdminEdited'],
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
  while (true) {
    const reportFieldResp = await loadOnePageFieldData(skipCursor)
    reportFieldList.value = reportFieldList.value.concat(reportFieldResp.data)

    if (!reportFieldResp.data.length) {
      loadingProgress.value = 100
      break
    }
    skipCursor = reportFieldResp.skip + reportFieldResp.data.length
    loadingProgress.value = Math.floor(skipCursor * 100 / reportFieldResp.total)
  }
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
    border-bottom: 1px solid #ccc;
  }
}
</style>
