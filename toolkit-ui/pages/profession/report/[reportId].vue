<template>
  <div v-if="isDataReady" class="report pa4 lh-copy">
    <div class="pb4">
      <h1 class="tc f2 fw6 mb2">
        <nuxt-link :to="industryPageLink" class="f5 gray no-underline flex items-center dim">
          <i class="fa-solid fa-arrow-left mr2"></i>
          回{{ report.company.industry }}列表
        </nuxt-link>
        {{ report.company.name }}
      </h1>
      <p class="tc f3 mv2">
        已判讀 {{ report.answeredFields }} / {{ report.totalFields }} 欄
        <span v-if="report.isVerified" class="ml2 gray f5">
          （已標為驗證，不可再修改）
        </span>
      </p>
      <div class="w5 center">
        <ProfessionFieldProgress :progress="report" :is-industry="false" />
      </div>
    </div>
    <div class="bb bt b--moon-gray flex items-center justify-center pv3 mb4">
      <button
        v-for="theType in Object.values(filterType)"
        :key="theType"
        class="report__filter bg-white pv2 ph3 ba b--light-gray br2 dim pointer"
        :class="{ 'bg-green': filter === theType }"
        @click="changeFilter(theType)"
      >{{ theType }}</button>
    </div>
    <div class="pa4">
      <template v-if="!visibleReportFieldList.length">
        <div class="mv5 f4 fw5 tc">
          <template v-if="filter === filterType.pending">
            所有欄位都判讀完畢 🧙🧙🧙
          </template>
          <template v-else-if="filter === filterType.isAnswered">
            你是跳坑這本的勇者嗎？請點上面的「待判讀」，挑個喜歡的欄位開始吧 🐈
          </template>
          <template v-else>
            此分類無資料
          </template>
        </div>
      </template>
      <template v-else>
        <NuxtLink
          v-for="field in visibleReportFieldList"
          :key="field.id"
          :to="editorLink(report, field)"
          class="report__field pv3 ph2 bb b--moon-gray no-underline black"
          :class="{dim: !report.isVerified}"
        >
          <div>
            <div class="fw5 mb1">{{ meta(field).name }}</div>
            <div class="f6 gray"> {{ meta(field).description }}</div>
          </div>
          <div>
            <div v-if="field.value !== null" class="report__value">
              {{ field.value }} {{ field.unit }}
            </div>
            <div v-else class="report__value"> - </div>
            <div v-if="field.notes" class="report__notes mt2 gray">
              {{ field.notes }}
            </div>
          </div>
          <div class="nowrap self-center">{{ readableDate(field.updatedAt) }}</div>
          <i v-if="!report.isVerified" class="fa-solid fa-arrow-right self-center"></i>
        </NuxtLink>
      </template>
    </div>
  </div>
</template>
<script lang="ts">
import dayjs from 'dayjs'
import { reportSchema } from '~/libs/feathers/services/report/report.schema'
import { reportFieldSchema } from '~/libs/feathers/services/report-field/report-field.schema'

export enum filterType {
  all = '所有欄位',
  pending = '待判讀',
  isAnswered = '判讀完成'
}
</script>
<script lang="ts" setup>
const route = useRoute()

const filter = ref(filterType.pending)

function changeFilter (type: filterType) {
  filter.value = type
}

const reportId = computed(() => {
  return Number.parseInt(route.params.reportId as string)
})
const { report, reportFieldList, isDataReady, meta } = useReport(reportId.value)

function isFieldEmpty (field: typeof reportFieldSchema) {
  return !field.value && !field.notes
}

const industryPageLink = computed(() => {
  if (!report.value) {
    return '#'
  }
  return {
    name: 'profession-industry-industry',
    params: { industry: report.value.company.industry }
  }
})

const visibleReportFieldList = computed(() => {
  if (filter.value === filterType.all) {
    return reportFieldList.value
  }
  let validator = isFieldEmpty
  if (filter.value === filterType.isAnswered) {
    validator = (field: typeof reportFieldSchema) => {
      return !isFieldEmpty(field)
    }
  }
  return reportFieldList.value.filter(validator)
})

function readableDate (date: string) {
  return dayjs(date).format('YYYY-MM-DD HH:mm')
}

function editorLink (report: typeof reportSchema, field: typeof reportFieldSchema) {
  if (report.isVerified) {
    return '#'
  }
  return {
    name: 'profession-editor-reportId',
    params: { reportId: report.id },
    query: { fieldId: field.id }
  }
}

</script>
<style lang="scss" scoped>
.report {
  width: $professionWidth;
  max-width: 100vw;
  margin: 0 auto;

  &__field {
    display: grid;
    grid-template-columns: 30rem 1fr 10rem 2rem;
    grid-gap: 1rem;
    margin-bottom: 1rem;
  }

  &__filter {
    &:not(:last-child) {
      margin-right: 1rem;
    }
  }

  &__notes {
    white-space: pre-line;
  }
}
</style>
