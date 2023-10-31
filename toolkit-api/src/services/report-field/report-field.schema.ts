// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { ReportFieldService } from './report-field.class'
import dayjs from 'dayjs'

// Main data model schema
export const reportFieldSchema = Type.Object(
  {
    id: Type.Number(),
    fieldId: Type.Number(),
    reportId: Type.Number(),
    value: Type.Optional(Type.String()),
    unit: Type.Optional(Type.String()),
    notes: Type.Optional(Type.String()),
    pageIndex: Type.Optional(Type.Number()),
    updatedAt: Type.String({ format: 'date-time' }),
    createdAt: Type.String({ format: 'date-time' })
  },
  { $id: 'ReportField', additionalProperties: false }
)
export type ReportField = Static<typeof reportFieldSchema>
export const reportFieldValidator = getValidator(reportFieldSchema, dataValidator)
export const reportFieldResolver = resolve<ReportField, HookContext<ReportFieldService>>({})

export const reportFieldExternalResolver = resolve<ReportField, HookContext<ReportFieldService>>({})

// Schema for creating new entries
export const reportFieldDataSchema = Type.Pick(reportFieldSchema, ['fieldId', 'reportId'], {
  $id: 'ReportFieldData'
})
export type ReportFieldData = Static<typeof reportFieldDataSchema>
export const reportFieldDataValidator = getValidator(reportFieldDataSchema, dataValidator)
export const reportFieldDataResolver = resolve<ReportField, HookContext<ReportFieldService>>({
  updatedAt: async () => dayjs().toISOString(),
  createdAt: async () => dayjs().toISOString()
})

// Schema for updating existing entries
export const reportFieldPatchSchema = Type.Partial(reportFieldSchema, {
  $id: 'ReportFieldPatch'
})
export type ReportFieldPatch = Static<typeof reportFieldPatchSchema>
export const reportFieldPatchValidator = getValidator(reportFieldPatchSchema, dataValidator)
export const reportFieldPatchResolver = resolve<ReportField, HookContext<ReportFieldService>>({
  updatedAt: async () => dayjs().toISOString()
})

// Schema for allowed query properties
export const reportFieldQueryProperties = Type.Pick(reportFieldSchema, [
  'id', 'fieldId', 'reportId', 'value', 'unit', 'notes', 'pageIndex', 'updatedAt', 'createdAt'
])
export const reportFieldQuerySchema = Type.Intersect(
  [
    querySyntax(reportFieldQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type ReportFieldQuery = Static<typeof reportFieldQuerySchema>
export const reportFieldQueryValidator = getValidator(reportFieldQuerySchema, queryValidator)
export const reportFieldQueryResolver = resolve<ReportFieldQuery, HookContext<ReportFieldService>>({})
