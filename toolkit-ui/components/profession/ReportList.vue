<template>
  <div class="reportList">
    <div class="reportList__report">
      <div class="reportList__cell">公司名稱</div>
      <div class="reportList__cell">年份</div>
      <div class="reportList__cell">進度</div>
      <div class="reportList__cell">更新時間</div>
    </div>
    <template v-if="visibleReportList.length">
      <nuxt-link
        v-for="report in visibleReportList"
        :key="report.id"
        :to="`/profession/report/${report.id}`"
        class="reportList__report black dim no-underline"
      >
        <div class="reportList__cell">{{ report.company.name }}</div>
        <div class="reportList__cell">{{ report.year }}</div>
        <div class="reportList__cell">
          <ProfessionFieldProgress :progress="report" :is-industry="false" />
        </div>
        <div class="reportList__cell">{{ readableDate(report.updatedAt) }}</div>
        <i class="fa-solid fa-arrow-right self-center"></i>
      </nuxt-link>
    </template>
    <div v-else class="pa2 tc">
      此分類無 資料
    </div>
  </div>
</template>
<script lang="ts" setup>
import dayjs from 'dayjs'
import type { reportSchema } from '~/libs/feathers/services/report/report.schema'
import { FilterType } from '~/pages/profession/industry/[industry].vue'

const props = defineProps<{
  reportList: typeof reportSchema[],
  filter: FilterType
}>()

const visibleReportList = computed(() => {
  if (props.filter === FilterType.all) {
    return props.reportList
  }
  return props.reportList.filter((report: typeof reportSchema) => {
    if (props.filter === FilterType.verified) {
      return report.isVerified
    }
    if (props.filter === FilterType.isAnswered) {
      return report.answeredFields === report.totalFields
    }
    return report.answeredFields < report.totalFields
  })
})

function readableDate (date: string) {
  return dayjs(date).format('YYYY/MM/DD HH:mm')
}

</script>
<style lang="scss">
.reportList {
  &__report {
    display: grid;
    grid-template-columns: 2fr 0.75fr 1.5fr 1fr 2rem;
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
