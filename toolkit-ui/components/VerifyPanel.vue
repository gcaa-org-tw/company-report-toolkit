<template>
  <div class="verifyPanel">
    <div class="fw5 mb2">{{ titleLabel }}{{ unitLabel }}</div>
    <div v-if="fieldHistory.length" class="verifyPanel__table f6 pb3 relative" :style="tableStyle">
      <div class="verifyPanel__head verifyPanel__head--bt">年度</div>
      <div
        v-for="history in allHistory"
        :key="history.year"
        class="verifyPanel__cell verifyPanel__cell--bt"
      > {{ history.year }} </div>
      <div class="verifyPanel__head verifyPanel__head--bt">數值</div>
      <div
        v-for="history in allHistory"
        :key="history.year"
        class="verifyPanel__cell verifyPanel__cell--bt"
      > {{ beautifyValue(history.value) }} </div>
      <div class="verifyPanel__head">前年差</div>
      <div
        v-for="history in allHistory"
        :key="history.year"
        class="verifyPanel__cell"
      > {{ history.diffLabel }} </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { parse } from 'csv-parse/browser/esm/sync'
import type { FieldData } from './AnswerPanel.vue'
import { reportSchema } from '~/libs/feathers/services/report/report.schema'
import { reportFieldSchema } from '~/libs/feathers/services/report-field/report-field.schema'
import { fieldMetaSchema } from '~/libs/feathers/services/field-meta/field-meta.schema'
import { normalizeReportFiledValue } from '~/utils/fieldMetaUtils'

const props = defineProps<{
  report: typeof reportSchema
  reportField: typeof reportFieldSchema
  fieldMeta: typeof fieldMetaSchema,
  curFiledData: FieldData
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

const MAX_YEAR_AGO = 2

const titleLabel = computed(() => {
  if (fieldHistory.value.length) {
    return '歷史資料'
  } else {
    return '無歷史資料'
  }
})

const unitLabel = computed(() => {
  if (!fieldHistory.value.length || !props.fieldMeta.defaultUnit) {
    return ''
  }
  return ` (${props.fieldMeta.defaultUnit})`
})

const historyData = shallowRef<historyDataType[]>()

function genDiffLabel (cur: any, prev: any) {
  const diff = Number.parseFloat(cur.value) - Number.parseFloat(prev.value)
  let diffLabel = '-'
  if (Number.isNaN(diff)) {
    return diffLabel
  }
  if (diff > 0) {
    diffLabel = `+${diff.toLocaleString()}`
  } else if (diff < 0) {
    diffLabel = `${diff.toLocaleString()}`
  }
  return diffLabel
}

const fieldHistory = computed(() => {
  const historyColumnName = props.fieldMeta.historyColumnName

  if (!historyColumnName || !historyData.value) {
    return []
  }

  const rawHistory = historyData.value
    .filter((history) => {
      return historyColumnName === history.項目 && !!history.來自公司報告
    })
    .sort((a, b) => {
      return b.年份 - a.年份
    })
    .map((history) => {
      return {
        year: history.年份,
        value: history.數值
      }
    })

  return rawHistory
    .map((history, i) => {
      const ret = {
        ...history,
        diffLabel: '-'
      }
      if (i < rawHistory.length - 1) {
        ret.diffLabel = genDiffLabel(ret, rawHistory[i + 1])
      }
      return ret
    })
    .slice(0, MAX_YEAR_AGO)
})

const allHistory = computed(() => {
  if (!fieldHistory.value.length) {
    return []
  }

  const thisYear = {
    year: props.report.year,
    value: normalizeReportFiledValue(props.curFiledData, props.fieldMeta),
    diffLabel: '-'
  }
  thisYear.diffLabel = genDiffLabel(thisYear, fieldHistory.value[0])

  return [
    thisYear,
    ...fieldHistory.value
  ]
})

const tableStyle = computed(() => {
  return {
    gridTemplateColumns: `1fr repeat(${allHistory.value.length}, 2fr)`
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

function beautifyValue (value: string | number) {
  if (props.fieldMeta.dataType === 'number') {
    if (typeof value === 'string') {
      value = Number.parseFloat(value)
    }
    return value.toLocaleString()
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
    padding: 0.5rem 0.25rem;
    padding-left: 0;
    &--bt {
      border-bottom: 1px solid #ccc;
    }
  }
  &__cell {
    padding: 0.5rem 0.25rem;
    &--bt {
      border-bottom: 1px solid #ccc;
    }
  }
}
</style>
