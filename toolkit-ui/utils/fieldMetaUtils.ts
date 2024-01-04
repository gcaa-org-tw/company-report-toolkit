import { fieldMetaSchema } from '~/libs/feathers/services/field-meta/field-meta.schema'
import type { FieldData } from '~/components/AnswerPanel.vue'

// convert filedData.value using default unit
export function normalizeReportFiledValue (fieldData: FieldData, fieldMeta: typeof fieldMetaSchema) {
  const { value, unit } = fieldData
  const { dataType, units, defaultUnit, unitTransformer } = fieldMeta

  const hasNoUnitOrTransformer = !unit || !defaultUnit || !unitTransformer.length || !units.includes(unit)
  const isNotNumber = dataType !== 'number' || typeof value !== 'number'
  if (hasNoUnitOrTransformer || isNotNumber) {
    return value
  }

  const unitIndex = units.indexOf(unit)
  const ratio = unitTransformer[unitIndex]
  return value * ratio
}
