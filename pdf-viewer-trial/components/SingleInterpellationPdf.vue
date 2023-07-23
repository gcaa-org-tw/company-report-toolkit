<template lang="pug">
.sip.pdfViewer(ref="pageEle")
</template>
<script setup lang="ts">

import { onMounted, ref } from 'vue'

const DEFAULT_SCALE = 0.95

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
    pdfSinglePageViewer._setScale(DEFAULT_SCALE, props.noScroll)

    if (props.highlight) {
      // TODO: handle search not found
      // console.warn('search', props.highlight)
      eventBus.dispatch('find', {
        type: '',
        query: props.highlight,
        phraseSearch: true,
        highlightAll: true
      })
    } else {
      const scrollEle = pdfSinglePageViewer.container.parentElement
      const top = scrollEle.scrollTop
      pdfSinglePageViewer.currentPageNumber = props.page
      pdfSinglePageViewer.container.parentElement.scrollTo({ top })
    }
    emit('loaded')
  })

  eventBus.on('updatetextlayermatches', () => {
    if (pdfSinglePageViewer.currentPageNumber !== props.page) {
      pdfSinglePageViewer._setCurrentPageNumber(props.page, !props.noScroll)
    }
  })

  pdfSinglePageViewer.setDocument(props.document)
  viewerConfig.linkService.setDocument(props.document, null)
}

onMounted(renderPdf)

</script>
<style lang="scss" scoped>
.sip {
  ::v-deep {
    .pdfViewer .page {
      box-sizing: content-box;
    }
  }
}
</style>
