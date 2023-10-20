// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../declarations'
import type { Company, CompanyData, CompanyPatch, CompanyQuery } from './company.schema'

export type { Company, CompanyData, CompanyPatch, CompanyQuery }

export interface CompanyParams extends KnexAdapterParams<CompanyQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class CompanyService<ServiceParams extends Params = CompanyParams> extends KnexService<
  Company,
  CompanyData,
  CompanyParams,
  CompanyPatch
> {}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('rdbClient'),
    name: 'company'
  }
}
