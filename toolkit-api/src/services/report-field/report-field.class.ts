// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../declarations'
import type { ReportField, ReportFieldData, ReportFieldPatch, ReportFieldQuery } from './report-field.schema'

export type { ReportField, ReportFieldData, ReportFieldPatch, ReportFieldQuery }

export interface ReportFieldParams extends KnexAdapterParams<ReportFieldQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class ReportFieldService<ServiceParams extends Params = ReportFieldParams> extends KnexService<
  ReportField,
  ReportFieldData,
  ReportFieldParams,
  ReportFieldPatch
> {}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('rdbClient'),
    name: 'report-field'
  }
}
