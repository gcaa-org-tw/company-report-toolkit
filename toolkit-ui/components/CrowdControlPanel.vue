<template lang="pug">
.controlPanel
  .f6.mb1.gray 欄位標注
  h2.mt0.f4.1b {{ curField.company.name }} | {{ curField.category }} | {{ curField.label }}
  .bt.bb.b--gray.mv3.pv2
    form.controlPanel__submission.mv3.pb2.bb
      .fw5.mb1 填寫判讀結果
    .controlPanel__keywordSection.mv3.pb2.bb
      .fw5.mb1 相關關鍵字
      .f6.gray 點選以下關鍵字，或是自行輸入，就能列出相關頁面
      .flex.mt3
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
      button.controlPanel__cursor(v-if="prevField !== nextField" @click="gotoPrevField")
        | 跳到 《 {{ prevField.label }}
      div(v-else)
      button.controlPanel__cursor(@click="gotoNextField")
        | 跳到 {{ nextField.label }} 》
</template>
<script setup lang="ts">
import _ from 'lodash'
import algoliasearch from 'algoliasearch'

const emit = defineEmits(['report', 'page', 'matched-pages'])

const props = defineProps({
  fieldsToSubmit: {
    type: Array,
    required: true
  }
})

const curFieldIndex = ref(0)
const curField = computed(() => {
  return props.fieldsToSubmit[curFieldIndex.value]
})

watchEffect(() => {
  if (!curField.value) {
    return
  }
  emit('report', {
    year: curField.value.year,
    company: curField.value.company
  })
})

const nextField = computed(() => {
  if (curFieldIndex.value < props.fieldsToSubmit.length - 1) {
    return props.fieldsToSubmit[curFieldIndex.value + 1]
  }
  return props.fieldsToSubmit[0]
})

const prevField = computed(() => {
  if (curFieldIndex.value > 0) {
    return props.fieldsToSubmit[curFieldIndex.value - 1]
  }
  return props.fieldsToSubmit[props.fieldsToSubmit.length - 1]
})

function gotoNextField () {
  if (curFieldIndex.value < props.fieldsToSubmit.length - 1) {
    curFieldIndex.value += 1
  } else {
    curFieldIndex.value = 0
  }
}

function gotoPrevField () {
  if (curFieldIndex.value > 0) {
    curFieldIndex.value -= 1
  } else {
    curFieldIndex.value = props.fieldsToSubmit.length - 1
  }
}

function humanPageNumber (page: number) {
  return page + (curField.value.company.pageOffset || 0)
}

const runtimeConfig = useRuntimeConfig()
const agClient = algoliasearch(
  runtimeConfig.public.algoliaAppId,
  runtimeConfig.public.algoliaSearchApiKey)
const agIndex = agClient.initIndex(runtimeConfig.public.algoliaIndexName)

const predefinedKeyword = ref('')
const customizedKeyword = ref('')
const keywordResults = ref([])

watch(curField, () => {
  keywordResults.value = []
  customizedKeyword.value = ''
  predefinedKeyword.value = ''
})

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

watch(curKeyword, () => {
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
      `company:${curField.value.company.id}`,
      `year:${curField.value.year}`
    ],
    hitsPerPage: 100
  })

  keywordResults.value = hits
  curSearchHit.value = null
}

watch(keywordResults, (newResults) => {
  const matchedPages = newResults.map(hit => hit.page)
  emit('matched-pages', matchedPages)
})

const MATCH_SEGMENT_LEN = 15

function extractMatchSegment (haystack: string) {
  // TODO: better detection, handle tail
  haystack = haystack.replace(/\n/g, '')
  const keywordStr = `${curKeyword.value || ''}`
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

async function gotoSelectedPage (hit) {
  // TODO better keyword detection
  if (curSearchHit.value === hit) {
    // force page change
    emit('page', { highlight: '', page: 1 })
  } else {
    curSearchHit.value = hit
  }
  await nextTick()
  emit('page', { highlight: curKeyword.value, page: hit.page })
}

</script>
<style lang="scss" scoped>
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
