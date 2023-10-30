// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { FieldMetaService } from './field-meta.class'
import dayjs from 'dayjs'

function genConvertToJson (fieldName: string) {
  return (value: any) => {
    try {
      // sqlite3 doesn't support JSON type, i.e. it's actually a string
      // but pgsql does support JSON type
      if (typeof value === 'string') {
        return JSON.parse(value)
      }
    } catch (error) {
      console.error(`unable to parse ${fieldName}: ${value}`)
      return []
    }
    return value
  }
}

export const FieldMetaDataType = Type.Union([
  Type.Literal('string'),
  Type.Literal('boolean'),
  Type.Literal('number')
])

// Main data model schema
export const fieldMetaSchema = Type.Object(
  {
    id: Type.Number(),
    name: Type.String(),
    // Accept string for sqlite3 w/ TypeScript support
    keywords: Type.Union([Type.Array(Type.String()), Type.String()], { default: [] }),
    description: Type.Optional(Type.String()),
    dataType: FieldMetaDataType,
    // Accept string for sqlite3 w/ TypeScript support
    units: Type.Union([Type.Array(Type.String()), Type.String()], { default: [] }),
    createdAt: Type.String({ format: 'date-time' })
  },
  { $id: 'FieldMeta', additionalProperties: false }
)
export type FieldMeta = Static<typeof fieldMetaSchema>
export const fieldMetaValidator = getValidator(fieldMetaSchema, dataValidator)
export const fieldMetaResolver = resolve<FieldMeta, HookContext<FieldMetaService>>({
  keywords: genConvertToJson('keywords'),
  units: genConvertToJson('units')
})

export const fieldMetaExternalResolver = resolve<FieldMeta, HookContext<FieldMetaService>>({})

// Schema for creating new entries
export const fieldMetaDataSchema = Type.Pick(fieldMetaSchema, [
  'id', 'name', 'keywords', 'description', 'dataType', 'units'
], {
  $id: 'FieldMetaData'
})
export type FieldMetaData = Static<typeof fieldMetaDataSchema>
export const fieldMetaDataValidator = getValidator(fieldMetaDataSchema, dataValidator)
export const fieldMetaDataResolver = resolve<FieldMeta, HookContext<FieldMetaService>>({
  keywords: async (value: any) => JSON.stringify(value),
  units: async (value: any) => JSON.stringify(value),
  createdAt: async () => dayjs().toISOString()
})

// Schema for updating existing entries
export const fieldMetaPatchSchema = Type.Partial(fieldMetaSchema, {
  $id: 'FieldMetaPatch'
})
export type FieldMetaPatch = Static<typeof fieldMetaPatchSchema>
export const fieldMetaPatchValidator = getValidator(fieldMetaPatchSchema, dataValidator)
export const fieldMetaPatchResolver = resolve<FieldMeta, HookContext<FieldMetaService>>({
  keywords: async (value: any) => JSON.stringify(value),
  units: async (value: any) => JSON.stringify(value)
})

// Schema for allowed query properties
export const fieldMetaQueryProperties = Type.Pick(fieldMetaSchema, [
  'id', 'name', 'keywords', 'description', 'dataType', 'units'
])
export const fieldMetaQuerySchema = Type.Intersect(
  [
    querySyntax(fieldMetaQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type FieldMetaQuery = Static<typeof fieldMetaQuerySchema>
export const fieldMetaQueryValidator = getValidator(fieldMetaQuerySchema, queryValidator)
export const fieldMetaQueryResolver = resolve<FieldMetaQuery, HookContext<FieldMetaService>>({})
