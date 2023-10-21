// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type { Company, CompanyData, CompanyPatch, CompanyQuery, CompanyService } from './company.class'

export type { Company, CompanyData, CompanyPatch, CompanyQuery }

export type CompanyClientService = Pick<CompanyService<Params<CompanyQuery>>, (typeof companyMethods)[number]>

export const companyPath = 'company'

export const companyMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

export const companyClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(companyPath, connection.service(companyPath), {
    methods: companyMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [companyPath]: CompanyClientService
  }
}
