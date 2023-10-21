// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'
import dayjs from 'dayjs'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { CompanyService } from './company.class'

// Main data model schema
export const companySchema = Type.Object(
  {
    id: Type.String(), // 統一編號
    name: Type.String(),
    abbreviation: Type.String(),
    industry: Type.String(),
    stockCode: Type.String(),
    createdAt: Type.String({ format: 'date-time' }),
  },
  { $id: 'Company', additionalProperties: false }
)
export type Company = Static<typeof companySchema>
export const companyValidator = getValidator(companySchema, dataValidator)
export const companyResolver = resolve<Company, HookContext<CompanyService>>({})

export const companyExternalResolver = resolve<Company, HookContext<CompanyService>>({})

// Schema for creating new entries
export const companyDataSchema = Type.Pick(companySchema, [
  'id', 'name', 'abbreviation', 'industry', 'stockCode'
], {
  $id: 'CompanyData'
})
export type CompanyData = Static<typeof companyDataSchema>
export const companyDataValidator = getValidator(companyDataSchema, dataValidator)
export const companyDataResolver = resolve<Company, HookContext<CompanyService>>({
  createdAt: async () => dayjs().toISOString()
})

// Schema for updating existing entries
export const companyPatchSchema = Type.Partial(companySchema, {
  $id: 'CompanyPatch'
})
export type CompanyPatch = Static<typeof companyPatchSchema>
export const companyPatchValidator = getValidator(companyPatchSchema, dataValidator)
export const companyPatchResolver = resolve<Company, HookContext<CompanyService>>({})

// Schema for allowed query properties
export const companyQueryProperties = Type.Pick(companySchema, ['id', 'name', 'abbreviation', 'industry', 'stockCode'])
export const companyQuerySchema = Type.Intersect(
  [
    querySyntax(companyQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type CompanyQuery = Static<typeof companyQuerySchema>
export const companyQueryValidator = getValidator(companyQuerySchema, queryValidator)
export const companyQueryResolver = resolve<CompanyQuery, HookContext<CompanyService>>({})
