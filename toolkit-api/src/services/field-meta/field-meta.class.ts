// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../declarations'
import type { FieldMeta, FieldMetaData, FieldMetaPatch, FieldMetaQuery } from './field-meta.schema'

export type { FieldMeta, FieldMetaData, FieldMetaPatch, FieldMetaQuery }

export interface FieldMetaParams extends KnexAdapterParams<FieldMetaQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class FieldMetaService<ServiceParams extends Params = FieldMetaParams> extends KnexService<
  FieldMeta,
  FieldMetaData,
  FieldMetaParams,
  FieldMetaPatch
> {}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('rdbClient'),
    name: 'field-meta'
  }
}
