<template lang="pug">
.editorControl
  .ph3
    nuxt-link.flex.f6.gray.items-center.no-underline.dim.pt3(:to="reportPageLink")
      i.fa-solid.fa-arrow-left.mr1
      | {{ report.company.abbreviation }} {{ report.year }} 報告書
  .editorControl__keepTop.mt2.pv2.ph3.mb2.bb.b--moon-gray
    h1.fw6.f4.mv0.black {{ fieldMeta.name }}
  .ph3
    p.gray.f6.mt0.pb2.mb3.bb.b--moon-gray.lh-copy {{ fieldMeta.description }}
    .flex.justify-between.items-center.mb3.mt2.pb3.bb.b--moon-gray
      button.editorControl__nav(@click="gotoPrevField") 往上個欄位
      button.editorControl__nav(@click="gotoNextField") 往下個欄位
    .editorControl__keywordSection.pb2.mb3
      .editorControl__keepMiddle.fw5.mb1 相關關鍵字
      .f6.gray 點選以下關鍵字，或是自行輸入，就能搜出相關頁面
      search-panel(
        :report="report"
        :field-meta="fieldMeta"
        @matched-pages="updateMatchedPages"
        @page="gotoPage"
      )
  .editorControl__keepBottom.pv2.ph3.bt.ba.b--moon-gray.shadow-1.br2(v-if="isCollaborator")
    .flex.justify-end
      button.pv2.ph3.ba.bg-dark-gray.white.br2.pointer.f6.flex.items-baseline(@click="toggleBottomSection")
        template(v-if="isBottomFolded")
          | 展開填答 x 驗證區
          i.fa-solid.fa-eye.ml2.f7
        template(v-else)
          | 收合填答 x 驗證區
          i.fa-solid.fa-eye-slash.ml2.f7
    .mt2(v-show="!isBottomFolded")
      answer-panel(
        :report="report"
        :report-field="reportField"
        :field-meta="fieldMeta"
        :focused-page="focusedPage"
        @next="updateReportField"
      )
</template>
<script lang="ts" setup>
import { fieldMetaSchema } from '~/libs/feathers/services/field-meta/field-meta.schema'
import { reportFieldSchema } from '~/libs/feathers/services/report-field/report-field.schema'
import { reportSchema } from '~/libs/feathers/services/report/report.schema'

const { isCollaborator } = useProfessionApi()

const props = defineProps<{
  report: typeof reportSchema
  reportField: typeof reportFieldSchema
  fieldMeta: typeof fieldMetaSchema
  focusedPage: number
}>()

const emit = defineEmits(['page', 'matched-pages', 'next', 'prev', 'report-field'])

const reportPageLink = computed(() => {
  return {
    name: 'profession-report-reportId',
    params: {
      reportId: props.report.id
    }
  }
})

function updateMatchedPages (matchedPages: number[]): void {
  emit('matched-pages', matchedPages)
}

function gotoPage (payload: any): void {
  emit('page', payload)
}

// submission

const isBottomFolded = ref(false)

function toggleBottomSection () {
  isBottomFolded.value = !isBottomFolded.value
}

function updateReportField (reportField: typeof reportFieldSchema): void {
  emit('report-field', reportField)
  gotoNextField()
}

// navigation
function gotoNextField () {
  emit('next')
}

function gotoPrevField () {
  emit('prev')
}
</script>
<style lang="scss" scoped>
.editorControl {
  &__nav {
    border: 1px solid #ccc;
    border-radius: 0.125rem;
    padding: 0.25rem 0.5rem;
    background-color: #fff;
    cursor: pointer;
  }

  &__keepTop {
    position: sticky;
    top: 0;
    background-color: #fff;
    z-index: 1;
  }

  &__keepBottom {
    width: $editorWidth;
    position: fixed;
    bottom: 0.5rem;
    right: 0.5rem;
    background-color: $answerPanelBg;
    z-index: 1000;
  }
}
</style>
