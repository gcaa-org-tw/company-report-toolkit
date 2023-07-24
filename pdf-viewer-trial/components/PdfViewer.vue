<template lang="pug">
.intViewer.relative
  // b-loading(:is-full-page="true" :active="!isMainReady")
  .intViewer__container(v-if="isMainReady" :style="containerStyle")
    // client-only
    //   infinite-loading(v-if="mainPage" :distance="0" direction="top" @infinite="loadMore(false, $event)" )
    //     // template(#no-more)
    //     // template(#no-results)
    // .h3
    // single-pdf-page(
    //   v-for="page in headPages"
    //   :key="page.id"
    //   v-bind="page.pdf"
    //   @loaded="markLoadingDone(false)"
    // )
    single-pdf-page(
      v-bind="mainPage"
      :no-scroll="false"
    )
    single-pdf-page(
      v-for="page in tailPages"
      :key="page.id"
      v-bind="page.pdf"
      @loaded="markLoadingDone(true)"
    )
    .h3
    client-only
      infinite-loading(v-if="mainPage" :distance="0" @infinite="loadMore(true, $event)")
        // template(#no-more)
        // template(#no-results)
    .h3
</template>
<script lang="ts" setup>
import InfiniteLoading from 'vue-infinite-loading'
import {
  ref,
  shallowRef,
  computed,
  watch,
  onBeforeUnmount,
  nextTick
} from 'vue'

const PDFJS_BASE = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@2.14.305'
const PDF_SRC_BASE = 'https://ddio-public.s3.us-west-2.amazonaws.com/gcaa-csr-report/demo'
const PAGE_PER_CHUNK = 10
const RENDER_SLOWLY = 300

const CHECK_PDF_LIB_SOMETIME = 100
const MIN_SEARCH_LEN = 12

useHead({
  link: [{ rel: 'stylesheet', href: `${PDFJS_BASE}/web/pdf_viewer.css` }]
})

const props = defineProps({
  startPage: {
    type: Number,
    required: true
  },
  year: {
    type: [Number, String],
    default: 2019
  },
  companyId: {
    type: [Number, String],
    required: true
  },
  highlight: {
    type: String,
    default: ''
  }
})

const isLibLoaded = ref(false)
const pdfLibTimer = ref<number | undefined>(undefined)
const pageChunk = shallowRef<any>({})
const mainPage = shallowRef(null)
const headPages = ref([])
const headLoadingState = ref<any>(null)
const tailPages = ref([])
const tailLoadingState = ref<any>(null)

onMounted(() => {
  keepCheckingPdfLibReadiness()
})

onBeforeUnmount(() => {
  clearTimeout(pdfLibTimer.value)
})

watch(isLibLoaded, () => {
  renderMainPage()
})

const isMainReady = computed(() => {
  return mainPage.value
})

const pdfLinkBase = computed(() => {
  return `${PDF_SRC_BASE}/${props.year}/${props.companyId}`
})

const highlightHead = computed(() => {
  let head = props.highlight.split(/[，。！？]/)[0]
  if (head.length < MIN_SEARCH_LEN) {
    head = props.highlight.slice(0, MIN_SEARCH_LEN)
  }
  return head
})

function checkPdfLibReadiness () {
  return !!window && !!window.pdfjsLib && !!window.pdfjsViewer
}

function keepCheckingPdfLibReadiness () {
  pdfLibTimer.value = setTimeout(async () => {
    const isLoaded = checkPdfLibReadiness()
    if (!isLoaded) {
      keepCheckingPdfLibReadiness()
    } else {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = `${PDFJS_BASE}/build/pdf.worker.js`
      await nextTick()
    }
    isLibLoaded.value = isLoaded
  }, CHECK_PDF_LIB_SOMETIME)
}

async function preparePdf (pageIndex: number): Promise<any> {
  const pdfjsLib = window.pdfjsLib
  const CMAP_URL = `${PDFJS_BASE}/cmaps/`

  const pageOffset = pageIndex % PAGE_PER_CHUNK || PAGE_PER_CHUNK
  const chunkIndex = getPageChunkIndex(pageIndex)

  if (!pageChunk.value[chunkIndex]) {
    pageChunk.value[chunkIndex] = pdfjsLib.getDocument({
      url: `${pdfLinkBase.value}/${chunkIndex}.pdf`,
      cMapUrl: CMAP_URL,
      cMapPacked: true,
      enableXfa: true
    })
  }

  const pdfDocument = await pageChunk.value[chunkIndex].promise

  return {
    document: pdfDocument,
    page: pageOffset
  }
}

async function renderMainPage () {
  const pdf = await preparePdf(props.startPage)
  pdf.highlight = highlightHead.value
  mainPage.value = pdf
}

function getPageChunkIndex (pageIndex: number) {
  //  1 -> return 001
  // 10 -> return 001
  // 11 -> return 002
  const chunkIndex = Math.ceil(pageIndex / PAGE_PER_CHUNK)
  return `${chunkIndex}`.padStart(3, '0')
}

function markLoadingDone (isTail: boolean) {
  if (isTail && tailLoadingState.value) {
    // TODO: handle end of pdf properly
    tailLoadingState.value.loaded()
    tailLoadingState.value = null
  } else if (!isTail && headLoadingState.value) {
    headLoadingState.value.loaded()
    headLoadingState.value = null
  }
}

async function loadMore (isTail: boolean, $state: any) {
  let nextPage = props.startPage
  if (isTail) {
    nextPage += tailPages.value.length + 1
  } else {
    nextPage = nextPage - headPages.value.length - 1
  }
  // TODO: handle end of pdf
  if (nextPage < 1) {
    $state.complete()
    return
  }
  const pdf = await preparePdf(nextPage)
  const page = {
    id: nextPage,
    pdf: shallowRef(pdf)
  }
  setTimeout(() => {
    if (isTail) {
      tailPages.value.push(page)
      tailLoadingState.value = $state
    } else {
      headPages.value.unshift(page)
      headLoadingState.value = $state
    }
  }, RENDER_SLOWLY)
}

const isMounted = useMounted()
const { width: pageWidth } = useWindowSize()

const containerStyle = computed(() => {
  let width = 960
  if (isMounted.value) {
    width = pageWidth.value * 0.75 // grid size
  }
  return { width: `${width}px` }
})

</script>
<style lang="scss" scoped>
.intViewer {
  padding: 2rem;

  &__container {
    position: absolute;
    margin: 0 auto;
    padding-bottom: 2rem;
  }

  .sip + .sip {
    margin-top: 2rem;
  }
}
</style>
