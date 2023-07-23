<template lang="pug">
.controlPanel
  h1.f4.b 企業永續報告書閱讀器-測試版
  .b--gray.f6
    .mt3.flex.items-center(v-for="report in reportMap" :key="report.year")
      .pv1.mr2 {{ report.year }}
      button.controlPanel__company.pv1.ph3.ba.b--black.mr1.pointer(
        v-for="company in report.reports"
        :key="company.id"
        :class="{'controlPanel__company--active': isSelected(report.year, company)}"
        @click="selectReport(report.year, company)"
      )
        | {{ company.name }}
  .bt.bb.b--gray.mv3.pv2
    .f6.b {{ curField.category }} | {{ curField.label }}
    .mv3
      input.w-100.controlPanel__input(placeholder="我是假的輸入框 😛")
    .flex.justify-between.items-center
      button.controlPanel__cursor(@click="gotoPrevField")
        | 《 {{ prevField.label }}
      button.controlPanel__cursor(@click="gotoNextField")
        | {{ nextField.label }} 》
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import fieldMap from '~/assets/field-map.yml'

const reportMap = ref([
  {
    year: 2021,
    reports: [
      { id: '07838854', name: '中鴻' },
      { id: '11913502', name: '台泥' },
      { id: '89406518', name: '台塑' }
    ]
  }
])

const emit = defineEmits(['report', 'cursor'])

const curYear = ref(2021)
const curCompanyId = ref(reportMap.value[0].reports[0].id)
const curFieldIndex = ref(0)

const curField = computed(() => {
  return flatFieldMap[curFieldIndex.value]
})

const nextField = computed(() => {
  if (curFieldIndex.value < flatFieldMap.length - 1) {
    return flatFieldMap[curFieldIndex.value + 1]
  }
  return flatFieldMap[0]
})

const prevField = computed(() => {
  if (curFieldIndex.value > 0) {
    return flatFieldMap[curFieldIndex.value - 1]
  }
  return flatFieldMap[flatFieldMap.length - 1 ]
})

function selectReport (year: number, company: any) {
  curYear.value = year
  curCompanyId.value = company.id
  curFieldIndex.value = 0
  emit('report', { year, company })
}

function isSelected (year: number, company: any) {
  return year === curYear.value && company.id === curCompanyId.value
}

const flatFieldMap = fieldMap.flatMap((category) => {
  return category.fields.map((field) => {
    return {
      category: category.category,
      ...field
    }
  })
})

function gotoNextField () {
  if (curFieldIndex.value < flatFieldMap.length - 1) {
    curFieldIndex.value += 1
  } else {
    curFieldIndex.value = 0
  }
}

function gotoPrevField () {
  if (curFieldIndex.value > 0) {
    curFieldIndex.value -= 1
  } else {
    curFieldIndex.value = flatFieldMap.length - 1
  }
}

</script>
<style lang="scss">
.controlPanel {
  &__company {
    background: white;
    &--active {
      background: black;
      color: white;
      font-weight: bold;
    }
  }

  &__input {
    border: none;
    border-bottom: 1px solid black;
    outline: none;
  }

  &__cursor {
    cursor: pointer;
    padding: 0.5rem;
    background: #ccc;
    border: none;
    font-size: 0.875rem;
  }
}
</style>
