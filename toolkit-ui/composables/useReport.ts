import type { reportSchema } from '~/libs/feathers/services/report/report.schema'
import type { reportFieldSchema } from '~/libs/feathers/services/report-field/report-field.schema'
import type { fieldMetaSchema } from '~/libs/feathers/services/field-meta/field-meta.schema'

type FieldMetaMap = { [key: string]: typeof fieldMetaSchema }

export function useReport (reportId: number) {
  const { feathers } = useProfessionApi()

  const report = ref<typeof reportSchema>()
  const fieldMetaMap = ref<FieldMetaMap>({})
  const reportFieldList = ref<typeof reportFieldSchema[]>([])
  const isDataReady = ref(false)

  async function loadReport () {
    report.value = await feathers.app.service('report').get(reportId)
  }

  async function loadReportFieldList () {
    const { data: reportFieldData } = await feathers.app.service('report-field').find({
      query: {
        reportId,
        $sort: {
          id: 1
        },
        // we have 50+ fields in some reports, so we need to increase the limit
        $limit: 100
      }
    })
    reportFieldList.value = reportFieldData
  }

  async function loadFieldMeta () {
    const { data: fieldMetaData } = await feathers.app.service('field-meta').find({
      query: {
        // we have 50+ fields in some reports, so we need to increase the limit
        $limit: 100
      }
    })
    fieldMetaMap.value = fieldMetaData.reduce((acc: FieldMetaMap, cur: typeof fieldMetaSchema) => {
      acc[cur.id] = cur
      return acc
    }, {})
  }

  function meta (field: typeof reportFieldSchema) {
    const fieldId = field.fieldId
    const fieldMeta = fieldMetaMap.value[fieldId]
    return fieldMeta || undefined
  }

  watchEffect(async () => {
    if (feathers.isReady.value) {
      await Promise.all([
        loadReport(),
        loadReportFieldList(),
        loadFieldMeta()
      ])
      isDataReady.value = true
    }
  })

  return { report, reportFieldList, fieldMetaMap, isDataReady, meta }
}
