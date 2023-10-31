<template>
  <div class="verifyPanel">
    <div class="fw5 mb2">{{ titleLabel }}</div>
    <div v-if="fieldHistory.length" class="verifyPanel__table f6 pb3 relative" :style="tableStyle">
      <div class="verifyPanel__head bb b--moon-gray pb1 mb1">年度</div>
      <div
        v-for="history in fieldHistory"
        :key="history.year"
        class="verifyPanel__cell bb b--moon-gray pb1 ph1 mb1"
      > {{ history.year }} </div>
      <div class="verifyPanel__head">數值</div>
      <div
        v-for="history in fieldHistory"
        :key="history.year"
        class="verifyPanel__cell ph1"
      > {{ beautifyValue(history.value) }} </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { parse } from 'csv-parse/browser/esm/sync'
import { reportSchema } from '~/libs/feathers/services/report/report.schema'
import { reportFieldSchema } from '~/libs/feathers/services/report-field/report-field.schema'
import { fieldMetaSchema } from '~/libs/feathers/services/field-meta/field-meta.schema'

const props = defineProps<{
  report: typeof reportSchema
  reportField: typeof reportFieldSchema
  fieldMeta: typeof fieldMetaSchema
}>()

const HISTORY_ENDPOINT = 'https://thaubing-esg.gcaa.org.tw/content/company/'

type historyDataType = {
  分類: string
  子分類: string
  項目: string
  來自公司報告: string
  單位: string
  年份: number
  數值: string
}

const MAX_YEAR_AGO = 5

const titleLabel = computed(() => {
  if (fieldHistory.value.length) {
    return '歷史資料'
  } else {
    return '無歷史資料'
  }
})

const historyData = shallowRef<historyDataType[]>()

const fieldHistory = computed(() => {
  const historyColumnName = props.fieldMeta.historyColumnName

  if (!historyColumnName || !historyData.value) {
    return []
  }

  return historyData.value
    .filter((history) => {
      return historyColumnName === history.項目
    })
    .map((history) => {
      return {
        year: history.年份,
        value: history.數值
      }
    })
    .sort((a, b) => {
      return a.year - b.year
    })
    .slice(-MAX_YEAR_AGO)
})

const tableStyle = computed(() => {
  return {
    gridTemplateColumns: `1fr repeat(${fieldHistory.value.length}, 2fr)`
  }
})

async function getHistoryData () {
  const companyAbbr = props.report.company.abbreviation
  const url = `${HISTORY_ENDPOINT}${companyAbbr}.csv`

  const response = await fetch(url)
  const csvText = await response.text()
  historyData.value = parse(csvText, {
    columns: true,
    skip_empty_lines: true
  })
}

function beautifyValue (value: string) {
  if (props.fieldMeta.dataType === 'number') {
    return Number.parseFloat(value).toLocaleString()
  }
  return value.toLocaleString()
}

watchEffect(() => {
  getHistoryData()
})

</script>
<style lang="scss" scoped>
.verifyPanel {
  &__table {
    display: grid;
    max-width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
  }
  &__head {
    white-space: nowrap;
    position: sticky;
    left: 0;
    background: $answerPanelBg;
    padding-right: 0.25rem;
  }
}
</style>
