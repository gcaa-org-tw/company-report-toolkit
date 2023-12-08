<template>
  <div class="answerPanel">
    <form class="answerPanel__form pb2 mb3 bb b--moon-gray" @submit.prevent="submitFieldData">
      <div class="fw5 mb2">{{ titleLabel }}</div>
      <div class="flex items-center mb2">
        <div class="answerPanel__value flex-auto mr3">
          <span class="f6 mid-gray"> 數值 </span>
          <template v-if="valueInputType !== 'radio'">
            <input
              v-model.trim="fieldData.value"
              :type="valueInputType"
              :step="fieldMeta.numberStep || 1"
              class="answerPanel__input"
              placeholder="數值"
            />
          </template>
          <div v-else class="answerPanel__input pv2">
            <label class="mr2">
              <input
                v-model="fieldData.value"
                type="radio"
                name="answerValue"
                value="是"
              />
              是
            </label>
            <label>
              <input
                v-model="fieldData.value"
                type="radio"
                name="answerValue"
                value="否"
              />
              否
            </label>
          </div>
        </div>
        <label v-show="shouldShowUnit" class="answerPanel__unit flex-none">
          單位
          <input
            v-if="fieldMeta.isCustomUnit"
            v-model="fieldData.unit"
            type="text"
            class="answerPanel__input"
          />
          <select v-else v-model="fieldData.unit" name="answerUnit" class="answerPanel__input">
            <option v-for="unit in fieldMeta.units" :key="unit" :value="unit">{{ unit }}</option>
          </select>
        </label>
      </div>
      <div class="flex mb2">
        <label class="flex-auto mr3">
          備註
          <textarea
            v-model.trim="fieldData.notes"
            class="answerPanel__input mt1"
            placeholder="備註"
          />
        </label>
        <label class="answerPanel__answerPage flex-none">
          答案頁次
          <button type="button" class="mt1 w-100 f7" @click="syncPageIndex">同步頁次</button>
          <input v-model="fieldData.pageIndex" type="number" class="answerPanel__input mt1" />
        </label>
      </div>
      <div class="flex justify-between">
        <button
          type="button"
          class="answerPanel__submit"
          @click="markAsNoAnswer"
        >無法填答</button>
        <button
          type="submit"
          :disabled="!canSubmitData"
          class="answerPanel__submit"
        >儲存</button>
      </div>
    </form>
    <VerifyPanel
      :report="report"
      :report-field="reportField"
      :field-meta="fieldMeta"
      :cur-filed-data="fieldData"
    />
  </div>
</template>
<script lang="ts">
import { reportSchema } from '~/libs/feathers/services/report/report.schema'
import { reportFieldSchema } from '~/libs/feathers/services/report-field/report-field.schema'
import { fieldMetaSchema } from '~/libs/feathers/services/field-meta/field-meta.schema'
import { toLogicalPageIndex, toPhysicalPageIndex } from '~/utils/reportUtils'

export const NA_VALUE = 'NA'

export type FieldData = {
  value: string | number,
  unit: string,
  notes?: string,
  pageIndex?: number
}
</script>
<script lang="ts" setup>
const props = defineProps<{
  report: typeof reportSchema
  reportField: typeof reportFieldSchema
  fieldMeta: typeof fieldMetaSchema
  focusedPage: number
}>()

const emit = defineEmits(['next'])

const { feathers, isCollaborator } = useProfessionApi()

const fieldData = ref<FieldData>({ value: '', unit: '', notes: '', pageIndex: 0 })

const canSubmitData = computed(() => {
  if (fieldData.value.notes) {
    return true
  }
  return fieldData.value.value !== '' && (fieldData.value.unit || !shouldShowUnit.value)
})

const titleLabel = computed(() => {
  let title = '填寫判讀結果'
  if (fieldData.value.value === NA_VALUE) {
    title += ' (已標為無法填答)'
  }
  return title
})

const NULL_UNIT = new Set(['無', NA_VALUE])

const shouldShowUnit = computed(() => {
  if (!props.fieldMeta.units) {
    return false
  } else {
    return props.fieldMeta.units.some((unit: string) => !NULL_UNIT.has(unit))
  }
})

function syncPageIndex () {
  fieldData.value.pageIndex = toLogicalPageIndex(props.focusedPage, props.report)
}

const TYPE_MAP: { [key: string]: string } = {
  number: 'number',
  string: 'text',
  boolean: 'radio'
}

const valueInputType = computed(() => {
  return TYPE_MAP[props.fieldMeta.dataType] || 'text'
})

// user tracking
let startTime = 0

const pageVisibility = useDocumentVisibility()
const windowVisibility = useWindowFocus()

onMounted(() => {
  startTime = Date.now()
})

watch(windowVisibility, async (isFocused) => {
  if (!isFocused) {
    await trackTimeSpendIfNeeded()
  } else {
    startTime = Date.now()
  }
})

watch(pageVisibility, async (visibility) => {
  if (visibility === 'hidden') {
    await trackTimeSpendIfNeeded()
  } else if (visibility === 'visible') {
    startTime = Date.now()
  }
})

async function trackTimeSpendIfNeeded () {
  if (!isCollaborator.value) {
    return
  }
  const timeSpentInSeconds = Math.round((Date.now() - startTime) / 1000)
  await feathers.app.service('report-field').track({
    id: props.reportField.id,
    timeSpentInSeconds
  })
  startTime = Date.now()
}

// handle submission and field change

watchImmediate(() => props.reportField, (reportField) => {
  if (reportField) {
    fieldData.value.value = reportField.value || ''
    fieldData.value.unit = reportField.unit || ''
    if (props.fieldMeta.units.length === 1 && !fieldData.value.unit) {
      fieldData.value.unit = props.fieldMeta.units[0]
    }
    fieldData.value.notes = reportField.notes || ''
    const rawPageIndex = reportField.pageIndex || props.focusedPage || 0
    fieldData.value.pageIndex = toLogicalPageIndex(rawPageIndex, props.report)
  }
})

async function patchReportField (data: typeof fieldData.value) {
  data = {
    ...data,
    pageIndex: toPhysicalPageIndex(data.pageIndex || 0, props.report)
  }
  await feathers.app.service('report-field').patch(props.reportField.id, data)
  await trackTimeSpendIfNeeded()
  emit('next', data)
}

function submitFieldData () {
  patchReportField({
    value: fieldData.value.value.toString(),
    unit: fieldData.value.unit,
    notes: fieldData.value.notes,
    pageIndex: fieldData.value.pageIndex
  })
}

function markAsNoAnswer () {
  patchReportField({
    value: NA_VALUE,
    unit: '',
    notes: fieldData.value.notes,
    pageIndex: fieldData.value.pageIndex
  })
}

</script>
<style scoped lang="scss">
.answerPanel {
  label {
    font-size: 0.875rem;
    color: #555;
  }
  &__unit {
    width: 8rem;
  }
  &__answerPage {
    width: 4rem;
  }
  &__input {
    border: none;
    background: none;
    border-bottom: 1px solid #ccc;
    outline: none;
    width: 100%;
    font-size: 1rem;
    color: black;
  }
  &__submit {
    padding: 0.5rem 1.5rem;
    border: none;
    background: #9EEBCF;
    cursor: pointer;
    &:disabled {
      cursor: not-allowed;
    }
  }
}
</style>
