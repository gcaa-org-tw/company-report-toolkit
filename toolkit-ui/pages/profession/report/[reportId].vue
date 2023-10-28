<template lang="pug">
.report.pa4.lh-copy(v-if="isDataReady")
  .pb4.bb.b--moon-gray.mb5
    h1.tc.f2.fw6.mb2 {{ report.company.industry }} | {{ report.company.name }}
    p.tc.f3.mv2 已判讀 {{ report.answeredFields }} / {{ report.totalFields }} 欄
    .w5.center
      profession-field-progress(:progress="report" :is-industry="false")
  .pa4
    nuxt-link.report__field.pv3.ph2.bb.b--moon-gray.no-underline.black.dim(
      v-for="field in reportFieldList"
      :key="field.id"
      :to="editorLink(report, field)"
    )
      div
        .fw5.mb1 {{ meta(field).name }}
        .f6.gray.truncate {{ meta(field).description }}
      div
        .report__value(v-if="field.value !== null")
          | {{ field.value }} {{ field.unit }}
        .report__value(v-else) -
        .mt2.gray.truncate(v-if="field.note") {{ field.note }}
      div {{ readableDate(field.updatedAt) }}
</template>
<script lang="ts" setup>
import dayjs from 'dayjs'

const route = useRoute()
const reportId = computed(() => {
  return Number.parseInt(route.params.reportId as string)
})
const { report, reportFieldList, isDataReady, meta } = useReport(reportId.value)

function readableDate (date: string) {
  return dayjs(date).format('YYYY-MM-DD HH:mm')
}

function editorLink (report, field) {
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
    grid-template-columns: 40% 40% 20%;
    grid-gap: 1rem;
    margin-bottom: 1rem;
  }
}
</style>
