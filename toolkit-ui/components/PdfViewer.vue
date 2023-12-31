<template lang="pug">
.reportViewer
  .reportViewer__control.pr2
    .bb.b--moon-gray.flex.items-center.justify-between.pv2
      .flex.items-center.pl3
        input.reportViewer__pageInput.b--moon-gray.ba.ph1.mr1(
          v-model.lazy="readablePageIndex"
          @keyup.enter="$event.target.blur()"
        )
        | 頁 / 共 {{ report.totalPages }} 頁
      .flex.items-center
        button.reportViewer__button(@click="zoomIn")
          i.fa-solid.fa-plus
          | 放大
        button.reportViewer__button(@click="zoomOut")
          i.fa-solid.fa-minus
          | 縮小
        button.reportViewer__button(@click="fitScaleWidth")
          i.fa-solid.fa-arrows-left-right
          | 滿頁寬
        button.reportViewer__button(@click="fitScaleHeight")
          i.fa-solid.fa-arrows-up-down
          | 滿頁高
  .reportViewer__scrollContainer.relative(ref="scrollerEle")
    .reportViewer__content.w-100(v-if="isMainReady")
      template(v-for="(cursor, index) in pages" :key="index")
        empty-page.reportViewer__page(
          v-if="!cursor"
          :style="pageStyle"
          :class="[`theEmpty--${index + 1}`]"
          :page-number="index + 1"
          @visible="loadPageSlowly(index + 1)"
        )
        single-pdf-page.reportViewer__page(
          v-else
          v-bind="cursor.pdf"
          :class="[`thePage--${index + 1}`]"
          :highlight="cursor.highlight"
          :page-anchor="pageAnchor"
          :scale="pdfScale.scale"
          @visible="handlePageVisible(index + 1)"
        )
</template>
<script lang="ts" setup>
import _ from 'lodash'
import type { reportSchema } from '~/libs/feathers/services/report/report.schema'

const PDFJS_BASE = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.9.179'
const PDF_SRC_BASE = 'https://gcaa-static.s3.ap-northeast-3.amazonaws.com/company-report-toolkit'
const PAGE_PER_CHUNK = 10

const CHECK_PDF_LIB_SOMETIME = 100

const TIME_TO_GLANCE_PAGE = 100
const TIME_TO_VIEW_PAGE = 2000

useHead({
  link: [{ rel: 'stylesheet', href: `${PDFJS_BASE}/web/pdf_viewer.css` }]
})

const emit = defineEmits(['view-page', 'page'])

const props = withDefaults(defineProps<{
  page?: number,
  year?: number | string,
  report: typeof reportSchema,
  highlight?: string | number,
  matchedPages?: number[]
}>(), {
  page: 1,
  year: 2019,
  highlight: '',
  matchedPages () { return [] }
})

enum ScaleType {
  FitWidth = 'fit-width',
  FitHeight = 'fit-height',
  Custom = 'custom'
}

const isLibLoaded = ref(false)
const pdfLibTimer = ref<number | undefined>(undefined)
const pageLoadQueue = ref<number[]>([])
const pageAnchor = ref(0)
const pageChunk = shallowRef<any>({})
const pages = ref<any>([null])

// 1 index
const curPageIndex = ref(1)
const readablePageIndex = computed({
  get () {
    const index = curPageIndex.value + (props.report.pageOffset || 0)
    if (index < 1) {
      return '-'
    }
    return index
  },
  set (valStr: string) {
    const val = Number.parseInt(valStr, 10) - (props.report.pageOffset || 0)
    manualSetPage(val)
  }
})

const scaleMode = ref<ScaleType>(ScaleType.FitWidth)
const scaleMeta = ref({ pdfSize: { width: 0, height: 0 }, widthScale: 0, heightScale: 0, customScale: 0 })

const pdfScale = computed(() => {
  if (!scaleMeta.value.widthScale || !isMounted.value) {
    return null
  }

  let scale = 1
  switch (scaleMode.value) {
    case ScaleType.Custom:
      scale = scaleMeta.value.customScale
      break
    case ScaleType.FitHeight:
      scale = scaleMeta.value.heightScale
      break
    case ScaleType.FitWidth:
    default:
      scale = scaleMeta.value.widthScale
  }
  scale = scale || 1

  return {
    scale,
    width: scaleMeta.value.pdfSize.width * scale,
    height: scaleMeta.value.pdfSize.height * scale
  }
})

onMounted(() => {
  keepCheckingPdfLibReadiness()
})

onBeforeUnmount(() => {
  clearTimeout(pdfLibTimer.value)
})

const isMainReady = computed(() => {
  return pages.value[0] && pdfScale.value
})

const pdfLinkBase = computed(() => {
  return `${PDF_SRC_BASE}/${props.year}/${props.report.company.id}`
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

async function initPdfScaleIfNeeded (pdf) {
  if (scaleMeta.value.widthScale) {
    return
  }
  const p1 = await pdf.getPage(1)
  const { width, height } = p1.getViewport({ scale: 1 })

  scaleMeta.value.pdfSize = { width, height }

  const scroller = scrollerEle.value

  const contentWidth = scroller.clientWidth
  const contentHeight = scroller.clientHeight
  const horizontalPadding = Number.parseInt(getComputedStyle(scroller).paddingLeft)

  // somehow we don't need it, but keep it here for future reference
  // const outputScale = window.devicePixelRatio || 1

  const canvasWidth = (contentWidth - horizontalPadding * 2) // * outputScale
  scaleMeta.value.widthScale = canvasWidth / width

  scaleMeta.value.heightScale = contentHeight / height

  // console.log('scaleMeta', canvasWidth, width, contentWidth, contentHeight, height)
}

const pageStyle = computed(() => {
  if (!pdfScale.value) {
    return {}
  }
  return {
    width: `${pdfScale.value?.width}px`,
    height: `${pdfScale.value?.height}px`
  }
})

async function renderMainPage () {
  const pdf = await preparePdf(1)
  pages.value[0] = {
    pdf: shallowRef(pdf)
  }
}

function resetViewer () {
  pageChunk.value = {}
  pages.value = Array(props.report.totalPages).fill(null)
  scaleMode.value = ScaleType.FitWidth
  scaleMeta.value.widthScale = 0
}

watchEffect(() => {
  if (!pdfLinkBase.value || !isLibLoaded.value || !isMounted.value) {
    return
  }
  resetViewer()

  renderMainPage()
})

function getPageChunkIndex (pageIndex: number) {
  //  1 -> return 001
  // 10 -> return 001
  // 11 -> return 002
  const chunkIndex = Math.ceil(pageIndex / PAGE_PER_CHUNK)
  return `${chunkIndex}`.padStart(3, '0')
}

async function loadPage (pageIndex: number, { forceLoad = false, anchor = 0 } = {}) {
  if (!forceLoad && pageLoadQueue.value.length) {
    if (!pageLoadQueue.value.includes(pageIndex)) {
      pageLoadQueue.value.unshift(pageIndex)
    }
    return
  }

  const zeroPageIndex = pageIndex - 1
  if (zeroPageIndex >= pages.value.length) {
    throw new Error(`Invalid page number: ${pageIndex}`)
  }

  if (!forceLoad) {
    pageLoadQueue.value.push(pageIndex)
    if (anchor) {
      pageAnchor.value = anchor
    }
  }

  if (!pages.value[zeroPageIndex]) {
    const pdf = await preparePdf(pageIndex)
    pages.value[zeroPageIndex] = {
      pdf: shallowRef(pdf),
      highlight: props.matchedPages.includes(pageIndex) ? normalizedHighlight.value : ''
    }
  }

  pageLoadQueue.value.pop()
  if (pageLoadQueue.value.length) {
    loadPage(pageLoadQueue.value[0], { forceLoad: true })
  } else {
    // stick into target page for a while
    setTimeout(() => {
      pageAnchor.value = 0
    }, STICKY_FOR_A_WHILE)
  }
}

const loadPageSlowly = _.debounce((pageIndex: number) => {
  loadPage(pageIndex)
}, 100)

const isMounted = useMounted()
// const { width: pageWidth } = useWindowSize()
const scrollerEle = ref(null)

function getAnchorPageTop (page: number) {
  const pageEleList = scrollerEle.value.querySelectorAll('.reportViewer__page')
  const target = pageEleList[page - 1]
  return target?.offsetTop
}

function manualSetPage (page: number) {
  if (page < 1 || page > props.report.totalPages || Number.isNaN(page)) {
    return
  }

  gotoPage(page)
  emit('page', page)
}

async function gotoPage (page: number) {
  const anchorTop = getAnchorPageTop(page)
  const promise = loadPage(page, { anchor: anchorTop })
  if (page > 1) {
    loadPage(page - 1)
  }
  if (page < props.report.totalPages) {
    loadPage(page + 1)
  }
  if (anchorTop) {
    scrollerEle.value.scrollTo({ top: anchorTop })
  }
  await promise
  curPageIndex.value = page
}

// TODO: watch highlight
// TODO: page change in short period
watch(() => props.page, async () => {
  await gotoPage(props.page)
})

// scale
const SCALE_STEP = 0.1
const STICKY_FOR_A_WHILE = 100

function zoomIn () {
  scaleMeta.value.customScale = (pdfScale.value?.scale || 1) * (1 + SCALE_STEP)
  scaleMode.value = ScaleType.Custom
}

function zoomOut () {
  scaleMeta.value.customScale = (pdfScale.value?.scale || 1) * (1 - SCALE_STEP)
  scaleMode.value = ScaleType.Custom
}

function fitScaleWidth () {
  scaleMode.value = ScaleType.FitWidth
}

function fitScaleHeight () {
  scaleMode.value = ScaleType.FitHeight
}

watch(pdfScale, async (newValue, prevValue) => {
  if (!newValue || !prevValue || !scrollerEle.value) {
    return
  }
  const scroller = scrollerEle.value
  const halfScreenHeight = scroller.clientHeight / 2
  const origTopRatio = (scroller.scrollTop + halfScreenHeight) / scroller.scrollHeight
  await nextTick()
  const newTop = scroller.scrollHeight * origTopRatio - halfScreenHeight
  pageAnchor.value = newTop
  setTimeout(() => {
    pageAnchor.value = 0
  }, STICKY_FOR_A_WHILE)
})

// page view

const handlePageVisible = _.debounce((pageIndex: number) => {
  curPageIndex.value = pageIndex
  emitLastVisiblePage()
}, TIME_TO_GLANCE_PAGE)

const emitLastVisiblePage = _.debounce(() => {
  emit('view-page', curPageIndex.value)
}, TIME_TO_VIEW_PAGE)

</script>
<style lang="scss" scoped>
.reportViewer {
  $controlHeight: 4rem;

  &__control {
    height: $controlHeight;
  }

  &__scrollContainer {
    height: calc(100vh - #{$controlHeight} - #{$bannerHeight});
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

  &__pageInput {
    width: 3rem;
  }
}
</style>
