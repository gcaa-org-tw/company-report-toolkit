// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, virtual } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'
import dayjs from 'dayjs'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { ReportService } from './report.class'
import { companySchema } from '../company/company.schema'
import { companyPath } from '../company/company.shared'

// Main data model schema
export const reportSchema = Type.Object(
  {
    id: Type.Number(),
    companyId: Type.String(),
    company: Type.Optional(Type.Ref(companySchema)),
    year: Type.Number(),
    totalPages: Type.Number(),
    pageOffset: Type.Number({ default: 0 }),
    totalFields: Type.Number({ default: 0 }),
    answeredFields: Type.Number({ default: 0 }),
    isVerified: Type.Boolean({ default: false }),
    updatedAt: Type.String({ format: 'date-time' }),
    createdAt: Type.String({ format: 'date-time' })
  },
  { $id: 'Report', additionalProperties: false }
)
export type Report = Static<typeof reportSchema>
export const reportValidator = getValidator(reportSchema, dataValidator)
export const reportResolver = resolve<Report, HookContext<ReportService>>({
  company: virtual(async (row, context) => {
    if (!row.companyId) {
      return undefined
    }
    try {
      return await context.app.service(companyPath).get(row.companyId)
    } catch {
      return undefined
    }
  }),
})

export const reportExternalResolver = resolve<Report, HookContext<ReportService>>({})

// Schema for creating new entries
export const reportDataSchema = Type.Pick(reportSchema, [
  'companyId', 'year', 'totalPages', 'pageOffset'
], {
  $id: 'ReportData'
})
export type ReportData = Static<typeof reportDataSchema>
export const reportDataValidator = getValidator(reportDataSchema, dataValidator)
export const reportDataResolver = resolve<Report, HookContext<ReportService>>({
  updatedAt: async () => dayjs().toISOString(),
  createdAt: async () => dayjs().toISOString()
})

// Schema for updating existing entries
export const reportPatchSchema = Type.Partial(reportSchema, {
  $id: 'ReportPatch'
})
export type ReportPatch = Static<typeof reportPatchSchema>
export const reportPatchValidator = getValidator(reportPatchSchema, dataValidator)
export const reportPatchResolver = resolve<Report, HookContext<ReportService>>({
  updatedAt: async () => dayjs().toISOString()
})

// Schema for allowed query properties
export const reportQueryProperties = Type.Pick(reportSchema, [
  'id', 'companyId', 'year', 'totalFields', 'answeredFields', 'isVerified', 'updatedAt', 'createdAt'
])
export const reportQuerySchema = Type.Intersect(
  [
    querySyntax(reportQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type ReportQuery = Static<typeof reportQuerySchema>
export const reportQueryValidator = getValidator(reportQuerySchema, queryValidator)
export const reportQueryResolver = resolve<ReportQuery, HookContext<ReportService>>({})
