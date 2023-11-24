<template lang="pug">
.searchPanel
  .flex.mt2
    .flex.flex-wrap
      button.searchPanel__keyword.pointer.ba.b--moon-gray.br1(
        v-for="keyword in fieldMeta.keywords"
        :key="keyword"
        :class="{'searchPanel__keyword--active': keyword === curKeyword}"
        @click="selectKeyword(keyword)"
      )
        | {{ keyword }}
      input.mt1.f6.w-100.searchPanel__input(v-model.trim="customizedKeyword" placeholder="自訂關鍵字")
  .f6.dark-gray.mv1(v-show="keywordResults.length")
    .flex.mv2.dim.pointer(
      v-for="hit in keywordResults"
      :key="hit.page"
      :class="{'b': hit === curSearchHit}"
      @click="gotoSelectedPage(hit)"
    )
      .flex-none.dark-gray 頁{{ humanPageNumber(hit.page) }}
      // eslint-disable-next-line vue/no-v-html
      .pl2(v-html="extractMatchSegment(hit.content)")
</template>
<script lang="ts" setup>
import _ from 'lodash'
import algoliasearch from 'algoliasearch'
import { reportSchema } from '~/libs/feathers/services/report/report.schema'
import { fieldMetaSchema } from '~/libs/feathers/services/field-meta/field-meta.schema'
import { toLogicalPageIndex } from '~/utils/reportUtils'

const props = defineProps<{
  report: typeof reportSchema
  fieldMeta: typeof fieldMetaSchema
}>()

const emit = defineEmits(['matched-pages', 'page'])

const runtimeConfig = useRuntimeConfig()
const agClient = algoliasearch(
  runtimeConfig.public.algoliaAppId,
  runtimeConfig.public.algoliaSearchApiKey)
const agIndex = agClient.initIndex(runtimeConfig.public.algoliaIndexName)

const predefinedKeyword = ref('')
const customizedKeyword = ref('')
const keywordResults = ref([])
const curSearchHit = ref(null)

const curKeyword = computed(() => {
  return customizedKeyword.value || predefinedKeyword.value || ''
})

watchEffect(() => {
  if (props.fieldMeta.keywords.length) {
    predefinedKeyword.value = props.fieldMeta.keywords[0]
  }
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

watchEffect(() => {
  if (curKeyword.value) {
    searchKeyword()
  }
})

async function searchKeyword () {
  if (!curKeyword.value) {
    keywordResults.value = []
    curSearchHit.value = null
    return
  }
  const { hits } = await agIndex.search(curKeyword.value, {
    facetFilters: [
      `company:${props.report.company.id}`,
      `year:${props.report.year}`
    ],
    hitsPerPage: 100
  })
  keywordResults.value = hits.filter((hit) => {
    // pdf2html parse hidden page as well XD
    // hide it to avoid confusion
    return hit.page <= props.report.totalPages
  })
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

function humanPageNumber (page: number) {
  return toLogicalPageIndex(page, props.report)
}

</script>
<style lang="scss" scoped>
.searchPanel {
  &__keyword {
    background: none;
    padding: 0.25rem 0.5rem;
    margin-bottom: 0.125rem;
    color: #aaa;

    &:hover {
      text-decoration: underline;
    }

    + .searchPanel__keyword {
      margin-left: 0.25rem;
    }

    &--active {
      color: black;
      font-weight: bold;
    }
  }
}
</style>
