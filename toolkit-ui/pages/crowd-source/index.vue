<template lang="pug">
.crowdLanding
  .ma5(v-if="false")
    input(v-model="userId" placeholder="User ID")
    button(@click="getPendingFields") Test
  .crowdInit(v-else)
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
const airtable = useAirtable()

const report = ref(null)
const reportPage = ref(null)
const matchedPages = ref([])

const userId = ref('ddio')

async function getPendingFields () {
  if (userId.value) {
    await airtable.getPendingFields(userId.value)
  }
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
<style lang="scss">
body {
  overflow-y: hidden;
}
.crowdInit {
  display: grid;
  grid-template-columns: 1fr 3fr;

  &__control {
    height: calc(100vh - 2rem);
    overflow-y: auto;
    overflow-x: hidden;
  }
}
</style>
