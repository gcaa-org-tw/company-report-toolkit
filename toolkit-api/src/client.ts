// For more information about this file see https://dove.feathersjs.com/guides/cli/client.html
import { feathers } from '@feathersjs/feathers'
import type { TransportConnection, Application } from '@feathersjs/feathers'
import authenticationClient from '@feathersjs/authentication-client'
import type { AuthenticationClientOptions } from '@feathersjs/authentication-client'

import { reportFieldClient } from './services/report-field/report-field.shared'
export type {
  ReportField,
  ReportFieldData,
  ReportFieldQuery,
  ReportFieldPatch
} from './services/report-field/report-field.shared'

import { fieldMetaClient } from './services/field-meta/field-meta.shared'
export type {
  FieldMeta,
  FieldMetaData,
  FieldMetaQuery,
  FieldMetaPatch
} from './services/field-meta/field-meta.shared'

import { reportClient } from './services/report/report.shared'
export type { Report, ReportData, ReportQuery, ReportPatch } from './services/report/report.shared'

import { companyClient } from './services/company/company.shared'
export type { Company, CompanyData, CompanyQuery, CompanyPatch } from './services/company/company.shared'
import { healthClient } from './services/health/health.shared'
export type { Health, HealthData, HealthQuery, HealthPatch } from './services/health/health.shared'

import { userClient } from './services/users/users.shared'
export type { User, UserData, UserQuery, UserPatch } from './services/users/users.shared'

export interface Configuration {
  connection: TransportConnection<ServiceTypes>
}

export interface ServiceTypes {}

export type ClientApplication = Application<ServiceTypes, Configuration>

/**
 * Returns a typed client for the toolkit-api app.
 *
 * @param connection The REST or Socket.io Feathers client connection
 * @param authenticationOptions Additional settings for the authentication client
 * @see https://dove.feathersjs.com/api/client.html
 * @returns The Feathers client application
 */
export const createClient = <Configuration = any,>(
  connection: TransportConnection<ServiceTypes>,
  authenticationOptions: Partial<AuthenticationClientOptions> = {}
) => {
  const client: ClientApplication = feathers()

  client.configure(connection)
  client.configure(authenticationClient(authenticationOptions))
  client.set('connection', connection)

  client.configure(userClient)
  client.configure(companyClient)
  client.configure(reportClient)
  client.configure(fieldMetaClient)
  client.configure(reportFieldClient)
  client.configure(healthClient)
  return client
}
