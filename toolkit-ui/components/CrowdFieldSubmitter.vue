<template lang="pug">
.crowdSubmit
  .br.b--moon-gray
    .crowdSubmit__control.pv3.ph2
      crowd-control-panel(
        :user-id="userId"
        :fields-to-submit="fieldsToSubmit"
        @report="changeReport"
        @page="changePage"
        @matched-pages="updateMatchedPages"
        @complete-all-submission="allCompleted"
      )
  .main__reader
    pdf-viewer(
      v-if="report && reportPage"
      :year="report.year"
      :company="report.company"
      :page="reportPage.page"
      :highlight="reportPage.highlight"
      :matched-pages="matchedPages"
    )
</template>
<script setup lang="ts">
const emits = defineEmits(['complete-all-submission'])

defineProps({
  userId: {
    type: String,
    required: true
  },
  fieldsToSubmit: {
    type: Array,
    required: true
  }
})

const report = ref(null)
const reportPage = ref(null)
const matchedPages = ref([])

function allCompleted () {
  emits('complete-all-submission')
}

function changeReport (newReport) {
  report.value = newReport
  reportPage.value = { page: 1, highlight: '' }
}

function changePage (newPage) {
  reportPage.value = newPage
}

function updateMatchedPages (matched) {
  matchedPages.value = matched
}
</script>
<style lang="scss" scoped>
.crowdSubmit {
  display: grid;
  grid-template-columns: 30rem 1fr;

  &__control {
    height: calc(100vh - #{$bannerHeight});
    overflow-y: auto;
    overflow-x: hidden;
  }
}
</style>
