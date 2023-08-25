<template lang="pug">
.controlPanel(v-if="curField")
  .f6.mb1.gray {{ isSubmission ? '標注欄位' : '驗證欄位' }} {{ doneFieldList.length }} / {{ props.fields.length }}
  h2.mt0.f4.1b {{ curField.year }} 年 | {{ curField.company.name }} | {{ curField.label }}
  p(v-if="curField.notes") {{ curField.notes }}
  .bt.bb.b--moon-gray.mv3.pv2
    form.fieldForm.mt3.mb4.pb2.bb.b--moon-gray(@submit.prevent="submitFieldData")
      .fw5.mb1 {{ isSubmission ? '填寫判讀結果' : '驗證欄位數值' }}
      .flex.items-center.mb2
        label.fieldForm__value.flex-auto.mr3 數值
          input.fieldForm__input(
            v-model.trim="fieldData.value"
            type="text"
            placeholder="數值"
            :readonly="!isSubmission"
          )
        label.fieldForm__unit.flex-none 單位
          input.fieldForm__input(
            v-model.trim="fieldData.unit"
            type="text"
            placeholder="單位"
            :readonly="!isSubmission"
          )
      label 備註
        textarea.fieldForm__input(
          v-model.trim="fieldData.notes"
          placeholder="備註"
          :readonly="!isSubmission"
        )
      .mt3
        .flex.items-center.justify-between(v-if="isSubmission")
          button.pa2.bg-white.ba.b--light-gray.gray.pointer(@click.stop.prevent="skipField") 找不到答案，放棄 🥺
          button.pv2.ph4.pointer(type="submit" :disabled="!canSubmitFieldData || isOnSubmit") 送出標注結果
        .flex.items-center.justify-end(v-else)
          button.pv1.ph3.pointer.ml2(
            v-for="theType in VERIFY_TYPES"
            :key="theType"
            @click.stop.prevent="verifyFieldData(theType)"
          ) 標為{{ theType }}
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

const { submitField, verifyField, sendTrackUsage } = useAirtable()

const emit = defineEmits(['report', 'page', 'matched-pages', 'complete'])

const props = defineProps({
  userId: {
    type: String,
    required: true
  },
  fields: {
    type: Array,
    required: true
  },
  focusedPage: {
    type: Number,
    default: 1
  },
  isSubmission: {
    type: Boolean,
    default: true
  }
})

const curFieldIndex = ref(0)
const curField = computed(() => {
  return props.fields[curFieldIndex.value]
})

const defaultFieldData = {
  value: '',
  unit: '',
  notes: ''
}

const fieldData = ref({
  ...defaultFieldData
})

const nextField = computed(() => {
  if (curFieldIndex.value < props.fields.length - 1) {
    return props.fields[curFieldIndex.value + 1]
  }
  return props.fields[0]
})

const prevField = computed(() => {
  if (curFieldIndex.value > 0) {
    return props.fields[curFieldIndex.value - 1]
  }
  return props.fields[props.fields.length - 1]
})

function gotoNextField () {
  if (curFieldIndex.value < props.fields.length - 1) {
    curFieldIndex.value += 1
  } else {
    curFieldIndex.value = 0
  }
}

function gotoPrevField () {
  if (curFieldIndex.value > 0) {
    curFieldIndex.value -= 1
  } else {
    curFieldIndex.value = props.fields.length - 1
  }
}

const doneFieldList = ref<any>([])

watch(doneFieldList, (newList) => {
  if (newList.length === props.fields.length) {
    emit('complete')
  }
}, { deep: true })

function resetFieldData () {
  fieldData.value = {
    ...defaultFieldData
  }
}

const canSubmitFieldData = computed(() => {
  return !!fieldData.value.value
})

const isOnSubmit = ref(false)

const VERIFY_TYPES = ['不正確', '不確定', '正確']

async function verifyFieldData (type: string) {
  // TODO: avoid duplicate verification
  const data = {
    userId: props.userId,
    submissionId: curField.value.data.id,
    result: type
  }
  const atRow = await verifyField(data)

  doneFieldList.value.push({
    field: curField.value,
    atRow
  })

  gotoNextField()
}

function skipField () {
  // TODO: send tracking event
  doneFieldList.value.push({
    field: curField.value
  })
  resetFieldData()
  gotoNextField()
}

async function submitFieldData () {
  // TODO: update if exists
  // TODO: send tracking event
  if (!canSubmitFieldData.value) {
    return
  }
  isOnSubmit.value = true
  const { value, unit, notes } = fieldData.value
  const { year, company, category, label } = curField.value
  const data = {
    userId: props.userId,
    year: `${year}`,
    companyId: company.id,
    category,
    field: label,
    value,
    unit,
    notes,
    page: props.focusedPage
  }
  if (curKeyword.value) {
    data.keyword = curKeyword.value
  }
  const atRow = await submitField(data)
  doneFieldList.value.push({
    field: curField.value,
    data,
    atRow
  })

  trackingHistory.value.answerPage = `${props.focusedPage}`

  resetFieldData()
  gotoNextField()
  isOnSubmit.value = false
}

function humanPageNumber (page: number) {
  return page + (curField.value.company.pageOffset || 0)
}

// handle search logic

const runtimeConfig = useRuntimeConfig()
const agClient = algoliasearch(
  runtimeConfig.public.algoliaAppId,
  runtimeConfig.public.algoliaSearchApiKey)
const agIndex = agClient.initIndex(runtimeConfig.public.algoliaIndexName)

const predefinedKeyword = ref('')
const customizedKeyword = ref('')
const keywordResults = ref([])
const pendingHitPage = ref(0)

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

  if (pendingHitPage.value) {
    const hit = hits.find(hit => hit.page === pendingHitPage.value)
    if (hit) {
      gotoSelectedPage(hit)
    } else {
      emit('page', { highlight: curKeyword.value, page: pendingHitPage.value })
    }
    pendingHitPage.value = 0
  }
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
  trackingHistory.value.clickPages.push(hit.page)
  emit('page', { highlight: curKeyword.value, page: hit.page })
}

function resetSearchState () {
  keywordResults.value = []
  predefinedKeyword.value = ''
  customizedKeyword.value = ''
}

// handle field init

function initVerification () {
  const curData = curField.value.data

  fieldData.value = {
    value: curData.get('數值'),
    unit: curData.get('單位'),
    notes: curData.get('補充資訊')
  }

  const pageIndex = curData.get('答案頁次')
  const keyword = curData.get('答案關鍵字')

  if (keyword) {
    const isPredefined = curField.value.keywords.includes(keyword)
    if (isPredefined) {
      predefinedKeyword.value = keyword
    } else {
      customizedKeyword.value = keyword
    }
  } else {
    resetSearchState()
  }
  if (pageIndex) {
    if (keyword) {
      pendingHitPage.value = pageIndex
    } else {
      emit('page', { highlight: '', page: pageIndex })
    }
  }
}

watchEffect(() => {
  if (!curField.value) {
    return
  }

  emit('report', {
    year: curField.value.year,
    company: curField.value.company
  })

  if (props.isSubmission) {
    resetSearchState()
  } else {
    initVerification()
  }
})

// tracking

// const trackingId = ref('')
function genEmptyTrackHistory () {
  return {
    searchKeyword: curKeyword.value,
    isPredefined: true,
    clickPages: [],
    viewPages: [],
    answerPage: ''
  }
}
const trackingHistory = ref(genEmptyTrackHistory())

function initTracking () {
  // const { year, company, label } = curField.value
  // const data = {
  //   userId: props.userId,
  //   year: `${year}`,
  //   companyId: company.id,
  //   field: label,
  //   isOnVerify: !props.isSubmission
  // }
  // const { id } = await initTrackUsage(data)
  trackingHistory.value = genEmptyTrackHistory()
  // trackingId.value = id
}

// simple workaround for IME
const submitTracking = _.throttle(() => {
  const { year, company, label } = curField.value
  const data = {
    userId: props.userId,
    year: `${year}`,
    companyId: company.id,
    field: label,
    isOnVerify: !props.isSubmission,
    ...trackingHistory.value
  }

  return sendTrackUsage(data)
}, 100)

watch(() => props.focusedPage, (pageIndex) => {
  // page 1 is always loaded, ignore it
  if (!pageIndex || pageIndex === 1) {
    return
  }
  trackingHistory.value.viewPages.push(pageIndex)
})

watch(curKeyword, async (newKeyword) => {
  submitTracking()
  await initTracking()
  trackingHistory.value.isPredefined = newKeyword !== customizedKeyword.value
  trackingHistory.value.searchKeyword = newKeyword
})

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
.fieldForm {
  &__unit {
    width: 10rem;
  }
  &__input {
    border: none;
    border-bottom: 1px solid #ccc;
    outline: none;
    width: 100%;
  }
}
</style>
