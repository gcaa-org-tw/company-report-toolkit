<template lang="pug">
.crowdLanding
  onboard-crowd(v-if="!canStartTest")
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
// const airtable = useAirtable()

const userId = ref('ddio')
const pendingRecords = ref([])

const canStartTest = computed(() => {
  return userId.value && pendingRecords.value.length
})

const report = ref(null)
const reportPage = ref(null)
const matchedPages = ref([])

// async function getPendingFields () {
//   if (userId.value) {
//     const pendingRecords = await airtable.getPendingFields(userId.value)
//     pendingRecords.forEach((record) => {
//       console.log(['公司統編', '報告書年份', '欄位標籤', '相關填答者'].map(f => record.get(f)))
//     })
//   }
// }

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
