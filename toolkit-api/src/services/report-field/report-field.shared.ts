// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type {
  ReportField,
  ReportFieldData,
  ReportFieldPatch,
  ReportFieldQuery,
  ReportFieldService
} from './report-field.class'

export type { ReportField, ReportFieldData, ReportFieldPatch, ReportFieldQuery }

export type ReportFieldClientService = Pick<
  ReportFieldService<Params<ReportFieldQuery>>,
  (typeof reportFieldMethods)[number]
>

export const reportFieldPath = 'report-field'

export const reportFieldMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

export const reportFieldClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(reportFieldPath, connection.service(reportFieldPath), {
    methods: reportFieldMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [reportFieldPath]: ReportFieldClientService
  }
}
