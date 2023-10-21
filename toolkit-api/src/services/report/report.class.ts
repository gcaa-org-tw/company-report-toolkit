// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../declarations'
import type { Report, ReportData, ReportPatch, ReportQuery } from './report.schema'

export type { Report, ReportData, ReportPatch, ReportQuery }

export interface ReportParams extends KnexAdapterParams<ReportQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class ReportService<ServiceParams extends Params = ReportParams> extends KnexService<
  Report,
  ReportData,
  ReportParams,
  ReportPatch
> {}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('rdbClient'),
    name: 'report'
  }
}
