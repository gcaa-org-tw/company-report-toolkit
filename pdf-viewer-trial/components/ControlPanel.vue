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
    .mv3.pb2.bb
      input.w-100.controlPanel__input(placeholder="我是假的輸入框 😛")
      .controlPanel__keywordSection.mt2
        .flex.f6
          .flex-none 欄位關鍵字
          .flex.flex-wrap
            button.controlPanel__keyword.pointer(
              v-for="keyword in curField.keywords"
              :key="keyword"
              :class="{'controlPanel__keyword--active': keyword === curKeyword}"
              @click="selectKeyword(keyword)"
            )
              | {{ keyword }}
        .f6.gray.mv1(v-show="keywordResults.length")
          .flex.mv2(v-for="hit in keywordResults" :key="hit.page")
            .flex-none.dark-gray 頁{{ hit.page }}
            .pl2 {{ extractMatchSegment(hit.content) }}
    .flex.justify-between.items-center
      button.controlPanel__cursor(@click="gotoPrevField")
        | 《 {{ prevField.label }}
      button.controlPanel__cursor(@click="gotoNextField")
        | {{ nextField.label }} 》
</template>
<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import algoliasearch from 'algoliasearch'
import fieldMap from '~/assets/field-map.yml'

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

const emit = defineEmits(['report', 'cursor'])

const curYear = ref(2021)
const curCompanyId = ref(reportMap[0].reports[0].id)
const curFieldIndex = ref(0)

const flatFieldMap = fieldMap.flatMap((category) => {
  return category.fields.map((field) => {
    return {
      category: category.category,
      ...field
    }
  })
})

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
  return flatFieldMap[flatFieldMap.length - 1]
})

function selectReport (year: number, company: any) {
  resetControl(year, company)
  emit('report', { year, company })
}

function isSelected (year: number, company: any) {
  return year === curYear.value && company.id === curCompanyId.value
}

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

watch([curField], () => {
  keywordResults.value = []
})

const runtimeConfig = useRuntimeConfig()
const agClient = algoliasearch(
  runtimeConfig.public.algoliaAppId,
  runtimeConfig.public.algoliaSearchApiKey)
const agIndex = agClient.initIndex(runtimeConfig.public.algoliaIndexName)

const curKeyword = ref<string | null>('')
const keywordResults = ref([])

// const isShowingMiscKeyword = computed(() => {
//   return curKeyword.value === null
// })

function selectKeyword (keyword) {
  curKeyword.value = keyword
  searchKeyword()
}

async function searchKeyword () {
  const { hits } = await agIndex.search(curKeyword.value, {
    facetFilters: [
      `company:${curCompanyId.value}`,
      `year:${curYear.value}`
    ]
  })

  keywordResults.value = hits
}

const MATCH_SEGMENT_LEN = 7

function extractMatchSegment (haystack: string) {
  // TODO: better detection, handle tail
  haystack = haystack.replace(/\n/g, '')
  const keywordStr = `${curKeyword.value || ''}`
  const index = haystack.indexOf(keywordStr)
  const minMatchLen = keywordStr.length + MATCH_SEGMENT_LEN

  if (index > MATCH_SEGMENT_LEN) {
    return '...' + haystack.slice(index - MATCH_SEGMENT_LEN, index + MATCH_SEGMENT_LEN + minMatchLen) + '...'
  } else {
    return haystack.slice(0, minMatchLen * 2) + '...'
  }
}

function resetControl (year, company) {
  curYear.value = year
  curCompanyId.value = company.id
  if (curKeyword.value) {
    searchKeyword()
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

  &__keyword {
    background: none;
    border: none;
    padding: 0 0.25rem;
    margin-bottom: 0.125rem;
    color: #aaa;

    &:hover {
      text-decoration: underline;
    }

    + .controlPanel__keyword {
      margin-right: 0.125rem;
    }

    &--active {
      color: black;
      font-weight: bold;
    }
  }
}
</style>
