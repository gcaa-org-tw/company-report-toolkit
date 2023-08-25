<template lang="pug">
.crowdEditor
  .br.b--moon-gray
    .crowdEditor__control.pv3.ph2
      crowd-control-panel(
        :user-id="userId"
        :fields="fields"
        :focused-page="lastFocusPageIndex"
        :is-submission="isSubmission"
        @report="changeReport"
        @page="changePage"
        @matched-pages="updateMatchedPages"
        @complete="allCompleted"
      )
  .main__reader
    pdf-viewer(
      v-if="report && reportPage"
      :year="report.year"
      :company="report.company"
      :page="reportPage.page"
      :highlight="reportPage.highlight"
      :matched-pages="matchedPages"
      @view-page="handleViewPage"
    )
</template>
<script setup lang="ts">
const emit = defineEmits(['complete'])

defineProps({
  userId: {
    type: String,
    required: true
  },
  fields: {
    type: Array,
    required: true
  },
  isSubmission: {
    type: Boolean,
    default: true
  }
})

const report = ref(null)
const reportPage = ref(null)
const matchedPages = ref([])

const lastFocusPageIndex = ref(0)

function handleViewPage (pageIndex) {
  lastFocusPageIndex.value = pageIndex
}

function allCompleted () {
  emit('complete')
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
.crowdEditor {
  display: grid;
  grid-template-columns: 30rem 1fr;

  &__control {
    height: calc(100vh - #{$bannerHeight});
    overflow-y: auto;
    overflow-x: hidden;
  }
}
</style>
