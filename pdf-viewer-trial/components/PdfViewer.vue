<template lang="pug">
.reportViewer.relative(ref="rootEle")
  // .pa3.ba {{ tailPages.length }} - {{ tailPages.slice(0, 5) }} - {{ pdfScale }}
  .reportViewer__container(v-if="isMainReady" :style="containerStyle")
    single-pdf-page.reportViewer__page(
      v-bind="mainPage"
      :scale="pdfScale.scale"
      :no-scroll="false"
    )
    template(v-for="(cursor, index) in tailPages" :key="index")
      empty-page.reportViewer__page(
        v-if="!cursor"
        :style="pageStyle"
        @visible="loadPage(index)"
      )
      single-pdf-page.reportViewer__page(
        v-else
        v-bind="cursor.pdf"
        :scale="pdfScale.scale"
      )
</template>
<script lang="ts" setup>
const PDFJS_BASE = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@2.14.305'
const PDF_SRC_BASE = 'https://ddio-public.s3.us-west-2.amazonaws.com/gcaa-csr-report/demo'
const PAGE_PER_CHUNK = 10

const CHECK_PDF_LIB_SOMETIME = 100
const MIN_SEARCH_LEN = 12

useHead({
  link: [{ rel: 'stylesheet', href: `${PDFJS_BASE}/web/pdf_viewer.css` }]
})

const props = defineProps({
  page: {
    type: Number,
    default: 1
  },
  year: {
    type: [Number, String],
    default: 2019
  },
  company: {
    type: Object,
    required: true
  },
  highlight: {
    type: [String, Number],
    default: ''
  }
})

const isLibLoaded = ref(false)
const pdfLibTimer = ref<number | undefined>(undefined)
const pageChunk = shallowRef<any>({})
const mainPage = shallowRef(null)
const tailPages = ref([])

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
  return mainPage.value && pdfScale.value
})

const pdfLinkBase = computed(() => {
  return `${PDF_SRC_BASE}/${props.year}/${props.company.id}`
})

const normalizedHighlight = computed(() => {
  return props.highlight + ''
})

const highlightHead = computed(() => {
  const highlight = normalizedHighlight.value
  let head = highlight.split(/[，。！？]/)[0]
  if (head.length < MIN_SEARCH_LEN) {
    head = highlight.slice(0, MIN_SEARCH_LEN)
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
  initPdfScaleIfNeeded(pdfDocument)

  return {
    document: pdfDocument,
    page: pageOffset
  }
}

const pdfSize = ref(null)

async function initPdfScaleIfNeeded (pdf) {
  if (pdfSize.value) {
    return
  }
  const p1 = await pdf.getPage(1)
  const { width, height } = p1.getViewport({ scale: 1 })

  pdfSize.value = { width, height }
}

const containerPadding = 16
const pdfScale = computed(() => {
  if (!pdfSize.value || !isMounted) {
    return null
  }
  const outputScale = 1 || window.devicePixelRatio || 1
  const canvasWidth = (containerWidth.value - containerPadding * 2) * outputScale
  const scale = canvasWidth / pdfSize.value.width

  return {
    scale: 1 || scale,
    // scale,
    width: pdfSize.value.width * scale,
    height: pdfSize.value.height * scale
  }
})

const pageStyle = computed(() => {
  if (!pdfScale.value) {
    return {}
  }
  return {
    width: `${pdfScale.value.width}px`,
    height: `${pdfScale.value.height}px`
  }
})

async function renderMainPage () {
  const pdf = await preparePdf(1)
  pdf.highlight = highlightHead.value
  mainPage.value = pdf
}

watchEffect(() => {
  if (!pdfLinkBase.value || !props.company) {
    return
  }
  mainPage.value = null
  pdfSize.value = null
  pageChunk.value = {}
  tailPages.value = Array(props.company.totalPage).fill(null)

  renderMainPage()
})

function getPageChunkIndex (pageIndex: number) {
  //  1 -> return 001
  // 10 -> return 001
  // 11 -> return 002
  const chunkIndex = Math.ceil(pageIndex / PAGE_PER_CHUNK)
  return `${chunkIndex}`.padStart(3, '0')
}

async function loadPage (pageIndex: number) {
  if (pageIndex >= tailPages.value.length) {
    throw new Error(`Invalid page number: ${pageIndex}`)
  }

  if (tailPages.value[pageIndex]) {
    return
  }

  // zero index + exclude main page
  const pdf = await preparePdf(pageIndex + 2)
  tailPages.value[pageIndex] = {
    pdf: shallowRef(pdf)
  }
}

const isMounted = useMounted()
const { width: pageWidth } = useWindowSize()
const rootEle = ref(null)

const containerWidth = computed(() => {
  let width = 960
  if (isMounted.value) {
    width = pageWidth.value * 0.75 // grid size
    if (rootEle.value) {
      width = rootEle.value.clientWidth
    }
  }
  return width
})

const containerStyle = computed(() => {
  return {
    width: `${containerWidth.value}px`
  }
})

// TODO: watch highlight
watch(() => props.page, async () => {
  const tailIndex = props.page - 2
  await loadPage(tailIndex)
  await nextTick()
  const target = document.querySelector(`.reportViewer__page:nth-of-type(${props.page})`)
  if (target) {
    target.scrollIntoView({
      behavior: 'smooth'
    })
  }
})

</script>
<style lang="scss" scoped>
.reportViewer {
  padding: 2rem;

  &__container {
    position: absolute;
    padding-bottom: 2rem;
    left: 0;
  }

  &__page + .reportViewer__page {
    margin-top: 2rem;
  }
}
</style>
