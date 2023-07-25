<template lang="pug">
main.main
  .pa2
    .ba.b--gray.pa2
      .main__control
        control-panel(@report="changeReport" @page="changePage" @matched-pages="updateMatchedPages")
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
const report = ref(null)
const reportPage = ref(null)
const matchedPages = ref([])

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
<style lang="scss">
body {
  overflow: hidden;
}
.main {
  display: grid;
  grid-template-columns: 1fr 3fr;

  &__control {
    height: calc(100vh - 2rem);
    overflow-y: auto;
    overflow-x: hidden;
  }

  &__reader {
    max-height: 100vh;
    overflow-y: auto;
  }
}
</style>
