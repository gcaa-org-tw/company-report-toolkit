// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type {
  FieldMeta,
  FieldMetaData,
  FieldMetaPatch,
  FieldMetaQuery,
  FieldMetaService
} from './field-meta.class'

export type { FieldMeta, FieldMetaData, FieldMetaPatch, FieldMetaQuery }

export type FieldMetaClientService = Pick<
  FieldMetaService<Params<FieldMetaQuery>>,
  (typeof fieldMetaMethods)[number]
>

export const fieldMetaPath = 'field-meta'

export const fieldMetaMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

export const fieldMetaClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(fieldMetaPath, connection.service(fieldMetaPath), {
    methods: fieldMetaMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [fieldMetaPath]: FieldMetaClientService
  }
}
