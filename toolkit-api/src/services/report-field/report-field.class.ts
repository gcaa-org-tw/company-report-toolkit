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
> {
  async track (data: ReportField, params: ServiceParams) {
    const { id, timeSpentInSeconds } = data
    const { user } = params

    const reportField = await this.get(id)

    const newData: any = {
      timeSpentInSeconds: reportField.timeSpentInSeconds + timeSpentInSeconds
    }
    if (user?.role === 'admin') {
      newData.hasAdminEdited = true
    }

    const newReportField = await this.patch(id, newData, params)
    return newReportField
  }
}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('rdbClient'),
    name: 'report-field'
  }
}
