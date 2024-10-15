<template lang="pug">
.sip.pdfViewer(ref="pageEle")
</template>
<script setup lang="ts">
import _ from 'lodash'

const props = defineProps({
  document: {
    type: Object,
    required: true
  },
  page: {
    type: Number,
    required: true
  },
  pageAnchor: {
    type: Number,
    default: 0
  },
  clickAnchor: {
    type: Array,
    default: () => []
  },
  highlight: {
    type: String,
    default: ''
  },
  noScroll: {
    type: Boolean,
    default: true
  },
  scale: {
    type: Number,
    default: 0.95
  }
})

const emit = defineEmits(['loaded', 'visible'])

const pageEle = ref(null)
const pdfViewer = shallowRef(null)

const isVisible = useElementVisibility(pageEle)

watch(isVisible, (newVal) => {
  if (newVal) {
    emit('visible')
  }
})

const pdf2CssUnits = computed(() => {
  if (!props.document) {
    return 1
  }
  return _.get(window, 'pdfjsLib.PixelsPerInch.PDF_TO_CSS_UNITS', 1)
})

function switchPage (page, top = 0) {
  // force disable scroll T___T
  // pdf.js v3 doesn't allow to disable scroll on scale change
  if (pdfViewer.value) {
    const scroller = pdfViewer.value.container.parentElement
    top = props.pageAnchor || top || scroller.scrollTop
    pdfViewer.value.currentPageNumber = page
    if (top) {
      scroller.scrollTo({ top })
      // TODO: resolve the magic number
      // we are waiting for pdf.js stop scroll..
      setTimeout(() => {
        scroller.scrollTo({ top })
      }, 400)
    }
  }
}

function setScale (scale: number): void {
  if (pdfViewer.value) {
    const previousScale = pdfViewer.value.currentScale
    const newScale = scale / pdf2CssUnits.value
    pdfViewer.value.currentScale = newScale

    if (props.clickAnchor.length !== 0) {
      const scroller = pdfViewer.value.container.parentElement
      const scaleDiff = (newScale / previousScale) - 1
      const rect = scroller.getBoundingClientRect()
      const scrollAnchorX = props.clickAnchor[0] - rect.left
      const scrollAnchorY = props.clickAnchor[1] - rect.top

      scroller.scrollLeft += scrollAnchorX * scaleDiff
      scroller.scrollTop += scrollAnchorY * scaleDiff
    }
  }
}

function renderPdf () {
  const pdfjsViewer = window.pdfjsViewer

  if (!pageEle.value) {
    return
  }

  const eventBus = new pdfjsViewer.EventBus()

  const viewerConfig = {
    container: pageEle.value.parentElement,
    viewer: pageEle.value,
    eventBus,
    linkService: new pdfjsViewer.PDFLinkService({ eventBus }),
    findController: null,
    removePageBorders: true
  }

  if (props.highlight) {
    viewerConfig.findController = new pdfjsViewer.PDFFindController({
      eventBus,
      linkService: viewerConfig.linkService
    })
  }

  const pdfSinglePageViewer = new pdfjsViewer.PDFSinglePageViewer(viewerConfig)
  viewerConfig.linkService.setViewer(pdfSinglePageViewer)

  eventBus.on('pagesinit', () => {
    setScale(props.scale)

    if (props.highlight) {
      eventBus.dispatch('find', {
        type: '',
        query: props.highlight,
        phraseSearch: true,
        highlightAll: true
      })
    } else {
      switchPage(props.page)
    }
    emit('loaded')
  })

  eventBus.on('updatefindcontrolstate', ({ source }) => {
    // FindState.NOT_FOUND === 1
    if (source._offset.pageIdx !== props.page - 1) {
      setTimeout(() => {
        switchPage(props.page)
      })
    }
  })

  eventBus.on('updatetextlayermatches', () => {
    if (pdfSinglePageViewer.currentPageNumber !== props.page) {
      pdfSinglePageViewer._setCurrentPageNumber(props.page)
    }
  })

  pdfSinglePageViewer.setDocument(props.document)
  viewerConfig.linkService.setDocument(props.document, null)

  pdfViewer.value = pdfSinglePageViewer
}

onMounted(renderPdf)

watch(() => props.scale, (newScale) => {
  if (pdfViewer.value) {
    setScale(newScale)
  }
})

</script>
<style lang="scss" scoped>
.sip.pdfViewer {
  ::v-deep() {
    .page {
      box-sizing: content-box;
      box-shadow:0px 0px 4px 2px rgba( 0, 0, 0, 0.2 );
    }
    .textLayer .highlight {
      border-radius: 0.125rem;
      background: #060;
    }
  }
}
</style>
