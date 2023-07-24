<template lang="pug">
main.main
  .pa2
    .ba.b--gray.pa2
      .main__control
        control-panel(@report="changeReport" @page="changePage")
  .main__reader
    pdf-viewer(
      v-if="report && reportPage"
      :year="report.year"
      :company-id="report.companyId"
      :start-page="reportPage.page"
      :highlight="reportPage.highlight"
    )
</template>
<script setup lang="ts">
const report = ref(null)
const reportPage = ref(null)

function changeReport (newReport) {
  report.value = newReport
  reportPage.value = { page: 1, highlight: '' }
}

function changePage (newPage) {
  reportPage.value = newPage
}

</script>
<style lang="scss">
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
