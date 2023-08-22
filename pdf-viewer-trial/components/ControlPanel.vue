<template lang="pug">
.controlPanel
  h1.f4.b 企業永續報告書閱讀器-測試版
  .b--gray.f6
    .mt3.flex.flex-wrap.items-center(v-for="report in reportMap" :key="report.year")
      .pv1.mr2 {{ report.year }}
      button.controlPanel__company.pv1.ph3.ba.b--black.mr1.mb1.pointer(
        v-for="company in report.reports"
        :key="company.id"
        :class="{'controlPanel__company--active': isSelected(report.year, company)}"
        @click="selectReport(report.year, company)"
      )
        | {{ company.name }}
  .bt.bb.b--gray.mv3.pv2
    .f6.b {{ curField.category }} | {{ curField.label }}
    .mv3.pb2.bb
      .controlPanel__keywordSection
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
            input.mt1.f6.w-100.controlPanel__input(v-model.trim="customizedKeyword" placeholder="自訂關鍵字")
        .f6.gray.mv1(v-show="keywordResults.length")
          .flex.mv2.dim.pointer(
            v-for="hit in keywordResults"
            :key="hit.page"
            :class="{'b': hit === curSearchHit}"
            @click="gotoSelectedPage(hit)"
          )
            .flex-none.dark-gray 頁{{ humanPageNumber(hit.page) }}
            // eslint-disable-next-line vue/no-v-html
            .pl2(v-html="extractMatchSegment(hit.content)")
    .flex.justify-between.items-center
      button.controlPanel__cursor(@click="gotoPrevField")
        | 《 {{ prevField.label }}
      button.controlPanel__cursor(@click="gotoNextField")
        | {{ nextField.label }} 》
</template>
<script setup lang="ts">
import _ from 'lodash'
import algoliasearch from 'algoliasearch'
import fieldMap from '~/assets/field-map.yml'
import reportMap from '~/assets/report-list.yml'
// const reportMap = [
//   {
//     year: 2021,
//     reports: [
//       { id: '11913502', name: '台泥', totalPage: 121 },
//       { id: '07838854', name: '中鴻', totalPage: 115 },
//       { id: '89406518', name: '台塑', totalPage: 177 }
//     ]
//   }
// ]

const emit = defineEmits(['report', 'page', 'matched-pages'])

const curYear = ref(2021)
const curCompany = ref(reportMap[0].reports[0])
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
  curYear.value = year
  curCompany.value = company
  searchKeyword()
  emit('report', { year, company })
}

onMounted(() => {
  emit('report', { year: curYear.value, company: curCompany.value })
})

function isSelected (year: number, company: any) {
  return year === curYear.value && company.id === curCompany.value.id
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

function humanPageNumber (page: number) {
  return page + (curCompany.value.pageOffset || 0)
}

watch([curField], () => {
  keywordResults.value = []
  customizedKeyword.value = ''
  predefinedKeyword.value = ''
})

const runtimeConfig = useRuntimeConfig()
const agClient = algoliasearch(
  runtimeConfig.public.algoliaAppId,
  runtimeConfig.public.algoliaSearchApiKey)
const agIndex = agClient.initIndex(runtimeConfig.public.algoliaIndexName)

const predefinedKeyword = ref<string>('')
const customizedKeyword = ref('')
const keywordResults = ref([])

const curKeyword = computed(() => {
  return customizedKeyword.value || predefinedKeyword.value || ''
})

watch([predefinedKeyword, customizedKeyword], ([newPre, newCus], [oldPre, oldCus]) => {
  if (newPre !== oldPre && newPre) {
    customizedKeyword.value = ''
  } else if (newCus !== oldCus && newCus) {
    predefinedKeyword.value = ''
  }
})

function selectKeyword (keyword: string) {
  predefinedKeyword.value = keyword
}

watch([curKeyword], () => {
  searchKeyword()
})

async function searchKeyword () {
  if (!curKeyword.value) {
    keywordResults.value = []
    curSearchHit.value = null
    return
  }
  const { hits } = await agIndex.search(curKeyword.value, {
    facetFilters: [
      `company:${curCompany.value.id}`,
      `year:${curYear.value}`
    ]
  })

  keywordResults.value = hits
  curSearchHit.value = null
}

watch(keywordResults, (newResults) => {
  const matchedPages = newResults.map(hit => hit.page)
  emit('matched-pages', matchedPages)
})

const MATCH_SEGMENT_LEN = 7

function extractMatchSegment (haystack: string) {
  // TODO: better detection, handle tail
  haystack = haystack.replace(/\n/g, '')
  const keywordStr = `${predefinedKeyword.value || ''}`
  const index = haystack.indexOf(keywordStr)
  const minMatchLen = keywordStr.length + MATCH_SEGMENT_LEN

  if (index < 0) {
    return haystack.slice(0, minMatchLen * 2)
  }

  const keywordLen = keywordStr.length
  let head = haystack.slice(0, index)
  const tail = `${haystack.slice(index + keywordLen, index + keywordLen + MATCH_SEGMENT_LEN)}...`

  if (index > MATCH_SEGMENT_LEN) {
    head = `...${haystack.slice(index - MATCH_SEGMENT_LEN, index)}`
  } else {
    return haystack.slice(0, minMatchLen * 2) + '...'
  }
  return `${_.escape(head)}<b class="underline">${keywordStr}</b>${_.escape(tail)}`
}

const curSearchHit = ref(null)

function gotoSelectedPage (hit) {
  // TODO better keyword detection
  curSearchHit.value = hit
  emit('page', { highlight: curKeyword.value, page: hit.page })
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
    border-bottom: 1px solid #ccc;
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
