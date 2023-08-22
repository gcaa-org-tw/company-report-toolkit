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

const emit = defineEmits(['loaded'])

const pageEle = ref(null)

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
    findController: null
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
    const pdf2CssUnits = _.get(window, 'pdfjsLib.PixelsPerInch.PDF_TO_CSS_UNITS', 1)
    const scrollEle = pdfSinglePageViewer.container.parentElement
    const top = scrollEle.scrollTop
    pdfSinglePageViewer.currentScale = props.scale / pdf2CssUnits

    if (props.highlight) {
      eventBus.dispatch('find', {
        type: '',
        query: props.highlight,
        phraseSearch: true,
        highlightAll: true
      })
    } else {
      pdfSinglePageViewer.currentPageNumber = props.page
      // force disable scroll T___T
      // pdf.js v3 doesn't allow to disable scroll on scale change
      pdfSinglePageViewer.container.parentElement.scrollTo({ top })
    }
    emit('loaded')
  })

  eventBus.on('updatefindcontrolstate', ({ source }) => {
    // FindState.NOT_FOUND === 1
    if (source._offset.pageIdx !== props.page - 1) {
      setTimeout(() => {
        pdfSinglePageViewer.currentPageNumber = props.page
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
}

onMounted(renderPdf)

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
