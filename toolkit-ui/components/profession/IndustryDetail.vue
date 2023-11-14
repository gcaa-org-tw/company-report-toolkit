<template>
  <div class="industryDetail">
    <h1 v-if="loadingProgress < 1" class="mv5 tc f2">
      資料載入中...
      <span class="fw7">{{ loadingProgress }}%</span>
    </h1>
    <div class="industryDetail__table mv3 f6" :style="tableStyle">
      <div class="industryDetail__cell industryDetail__cell--head industryDetail__cell--name">公司名稱</div>
      <div
        v-for="field in filedMetaList"
        :key="field.id"
        class="industryDetail__cell industryDetail__cell--head"
      > {{ field.name }} </div>
      <div class="industryDetail__cell industryDetail__cell--head">更新時間</div>
      <template v-for="report in reportList" :key="report.id">
        <template v-if="industryFieldMap[report.id]">
          <NuxtLink :to="reportLink(report)" class="industryDetail__cell industryDetail__cell--name gray dim no-underline">
            {{ report.company.abbreviation }}
            <i class="ml3 fa-solid fa-arrow-up-right-from-square"></i>
          </NuxtLink>
          <div
            v-for="meta in filedMetaList"
            :key="meta.id"
            class="industryDetail__cell"
          >
            <div class="industryDetail__value">
              <ProfessionIndustryCellValue
                :report-field="industryFieldMap[report.id][meta.id]"
                :filed-meta="meta"
              />
            </div>
          </div>
          <div class="industryDetail__cell">
            {{ readableDate(report.updatedAt) }}
          </div>
        </template>
      </template>
    </div>
  </div>
</template>
<script lang="ts" setup>
import dayjs from 'dayjs'
import { reportSchema } from '~/libs/feathers/services/report/report.schema'
import { reportFieldSchema } from '~/libs/feathers/services/report-field/report-field.schema'
import { fieldMetaSchema } from '~/libs/feathers/services/field-meta/field-meta.schema'

const props = defineProps<{
  reportList: typeof reportSchema[]
}>()

const { feathers } = useProfessionApi()

type REPORT_FILED_MAP = { [fieldId: string]: typeof reportFieldSchema }
const industryFieldMap = ref<{ [reportId: string]: REPORT_FILED_MAP }>({})
const filedMetaList = ref<{ [id: string]: typeof fieldMetaSchema }>({})
const loadingProgress = ref(0)

const tableStyle = computed(() => {
  return {
    gridTemplateColumns: `5rem repeat(${filedMetaList.value.length}, 6rem) 8rem`
  }
})

function readableDate (date: string) {
  return dayjs(date).format('YYYY/MM/DD HH:mm')
}

function reportLink (report: typeof reportSchema) {
  return `/profession/report/${report.id}`
}

function loadOnePageIndustryData (idList: number[], skip = 0) {
  return feathers.app.service('report-field').find({
    query: {
      reportId: {
        $in: idList
      },
      $limit: 200,
      $skip: skip
    }
  })
}

async function loadIndustryData () {
  const reportIdList = props.reportList.map(report => report.id)
  let skipCursor = 0
  while (true) {
    const reportFieldResp = await loadOnePageIndustryData(reportIdList, skipCursor)
    reportFieldResp.data.forEach((field: typeof reportFieldSchema) => {
      if (!industryFieldMap.value[field.reportId]) {
        industryFieldMap.value[field.reportId] = {}
      }
      industryFieldMap.value[field.reportId][field.fieldId] = field
    })

    if (!reportFieldResp.data.length) {
      loadingProgress.value = 100
      break
    }
    skipCursor = reportFieldResp.skip + reportFieldResp.data.length
    loadingProgress.value = Math.floor(skipCursor * 100 / reportFieldResp.total)
  }
}

async function initPageData () {
  const fileMetaResp = await feathers.app.service('field-meta').find({
    query: {
      // we have 50+ fields in some reports, so we need to increase the limit
      $limit: 100,
      $sort: {
        id: 1
      }
    }
  })
  filedMetaList.value = fileMetaResp.data
  await loadIndustryData()
}

watch(() => props.reportList, initPageData, {
  immediate: true
})

</script>
<style scoped lang="scss">
.industryDetail {
  &__table {
    display: grid;
    max-width: 100%;
    max-height: calc(100vh - 6rem);
    overflow: auto;
    border: 1px solid #ccc;
  }

  &__cell {
    padding: 0.25rem 0.5rem;
    border-top: 1px solid #ccc;
    &--head {
      border: none;
      position: sticky;
      top: 0rem;
      background: white;
      z-index: 1;
    }
    &--name {
      position: sticky;
      left: 0;
      background: white;
      box-shadow: 0.25rem 0 1rem -0.375rem #aaa
    }
  }

}
</style>
