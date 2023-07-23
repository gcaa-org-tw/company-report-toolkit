<template lang="pug">
main.main
  .main__control.pa2
    .ba.b--gray.pa2.h-100
      control-panel
  .main__reader
</template>
<script setup lang="ts">
import { ref, nextTick } from 'vue'

const reportMap = [
  {
    year: 2021,
    reports: [
      { id: '07838854', name: '中鴻' },
      { id: '11913502', name: '台泥' },
      { id: '89406518', name: '台塑' }
    ]
  }
]

const year = ref(2021)
const companyId = ref('07838854')
const pdfViewer = ref(null)

async function selectReport (targetYead: number, report: any) {
  year.value = targetYead
  companyId.value = report.id
  await nextTick()
  pdfViewer.value?.show()
}

</script>
<style lang="scss">
.main {
  display: grid;
  grid-template-columns: 1fr 3fr;

  &__control {
    height: 100vh;
    overflow-y: auto;
  }

  &__reader {
    max-height: 100vh;
    overflow-y: auto;
  }
}
</style>
