<template lang="pug">
.reportViewer
  .reportViewer__control.pr2
    .bb.b--gray.flex.items-center.justify-between.pv2
      .flex.items-center
      .flex.items-center
        button.reportViewer__button
          i.fa-solid.fa-plus
          | 放大
        button.reportViewer__button
          i.fa-solid.fa-minus
          | 縮小
        button.reportViewer__button
          i.fa-solid.fa-arrows-left-right
          | 滿頁寬
        button.reportViewer__button
          i.fa-solid.fa-arrows-up-down
          | 滿頁高
  .reportViewer__scrollContainer.relative
    .reportViewer__content(v-if="isMainReady" ref="contentEle" :style="containerStyle")
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
          :highlight="cursor.highlight"
          :scale="pdfScale.scale"
        )
</template>
<script lang="ts" setup>
const PDFJS_BASE = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.9.179'
const PDF_SRC_BASE = 'https://ddio-public.s3.us-west-2.amazonaws.com/gcaa-csr-report/demo'
const PAGE_PER_CHUNK = 10

const CHECK_PDF_LIB_SOMETIME = 100

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
  },
  matchedPages: {
    type: Array,
    default () {
      return []
    }
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
  if (!pdfSize.value || !isMounted.value) {
    return null
  }
  const outputScale = window.devicePixelRatio || 1
  const canvasWidth = (contentWidth.value - containerPadding * 2) * outputScale
  const scale = canvasWidth / pdfSize.value.width

  return {
    scale,
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
  const pdfPage = pageIndex + 2
  const pdf = await preparePdf(pdfPage)
  tailPages.value[pageIndex] = {
    pdf: shallowRef(pdf),
    highlight: props.matchedPages.includes(pdfPage) ? normalizedHighlight.value : ''
  }
}

const isMounted = useMounted()
const { width: pageWidth } = useWindowSize()
const contentEle = ref(null)

const contentWidth = computed(() => {
  let width = 960
  if (isMounted.value) {
    width = pageWidth.value * 0.75 // grid size
    if (contentEle.value) {
      width = contentEle.value.clientWidth
    }
  }
  return width
})

const containerStyle = computed(() => {
  return {
    width: `${contentWidth.value}px`
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
  $controlHeight: 4rem;

  &__control {
    height: $controlHeight;
  }

  &__scrollContainer {
    height: calc(100vh - #{$controlHeight});
    overflow-y: auto;
    padding: 0 1rem;
  }
  &__content {
    position: absolute;
    padding-bottom: 2rem;
    left: 0;
  }

  &__page + .reportViewer__page,
  #hiddenCopyElement + .reportViewer__page {
    margin-top: 2rem;
  }

  &__button {
    border: #ccc 1px solid;
    display: flex;
    align-items: center;
    padding: 0.25rem 0.5rem;
    background: none;
    cursor: pointer;

    i { margin-right: 0.5rem; }

    + .reportViewer__button {
      margin-left: 0.5rem;
    }
  }
}
</style>
