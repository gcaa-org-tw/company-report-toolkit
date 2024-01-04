// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'
import { Parser } from '@json2csv/plainjs'

import { appendCache } from '../../utils/downloaderCache'
import type { Application } from '../../declarations'
import type { Report, ReportData, ReportPatch, ReportQuery } from './report.schema'
import { ReportField, reportFieldPath } from '../report-field/report-field.shared'
import { FieldMeta, fieldMetaPath } from '../field-meta/field-meta.shared'

export type { Report, ReportData, ReportPatch, ReportQuery }

export interface ReportParams extends KnexAdapterParams<ReportQuery> {}

type ReportIds = number[]

function getMoreReportFields (app: Application, reportIdList: number[], skip: number = 0) {
  const fieldService = app.service(reportFieldPath)
  return fieldService.find({
    query: {
      reportId: {
        $in: reportIdList
      },
      $skip: skip,
      $sort: {
        id: 1
      }
    }
  })
}

// modified from fieldMetaUtils
function normalizeReportFiledValue (fieldData: ReportField, fieldMeta: FieldMeta) {
  const { unit, value } = fieldData
  const { dataType, units, defaultUnit, unitTransformer } = fieldMeta

  const numberValue = Number.parseFloat(value || '')

  const hasNoUnitOrTransformer = !unit || !defaultUnit || !unitTransformer.length || !units.includes(unit)
  const isNotNumber = dataType !== 'number' || Number.isNaN(numberValue)

  if (hasNoUnitOrTransformer || isNotNumber) {
    return undefined
  }

  const unitIndex = units.indexOf(unit)
  const ratio = unitTransformer[unitIndex] as number
  return numberValue * ratio
}

interface downloadSetting {
  reportIds: ReportIds
  fileName: string
}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class ReportService<ServiceParams extends Params = ReportParams> extends KnexService<
  Report,
  ReportData,
  ReportParams,
  ReportPatch
> {
  app: Application | null = null
  setup (app: Application, path: string): void {
    this.app = app
  }
  async download ({ reportIds, fileName }: downloadSetting, params?: ServiceParams): Promise<any> {
    if (!this.app) {
      throw new Error('app not initialized')
    }
    const metaService = this.app.service(fieldMetaPath)

    const metaList = await metaService.find({
      query: { $sort: { id: 1 } },
      paginate: false
    })

    const reportList = await this.find({
      query: {
        id: {
          $in: reportIds
        }
      },
      paginate: false
    })

    const allReportFields: any = {}
    let skip = 0

    while (true) {
      const fieldValueList = await getMoreReportFields(this.app, reportIds, skip)
      if (!fieldValueList.data.length) {
        break
      }
      skip += fieldValueList.data.length
      fieldValueList.data.forEach((fieldValue) => {
        if (!allReportFields[fieldValue.reportId]) {
          allReportFields[fieldValue.reportId] = {}
        }
        allReportFields[fieldValue.reportId][fieldValue.fieldId] = fieldValue
      })
    }

    const fieldTable = reportIds
      .map((reportId) => {
        if (!allReportFields[reportId]) {
          return undefined
        }
        const report = reportList.find((report) => report.id === reportId) as Report
        const rowObj = {
          證券代號: report?.company?.stockCode,
          公司名稱: report?.company?.name,
          公司簡稱: report?.company?.abbreviation
        }
        const oneReportFields = allReportFields[reportId]
        return metaList.reduce((acc, meta) => {
          const fieldValue = oneReportFields[meta.id]
          const normalizedValue = normalizeReportFiledValue(fieldValue, meta)
          acc[meta.name] = normalizedValue || fieldValue?.value || ''
          if (meta.defaultUnit) {
            const unit = normalizedValue ? meta.defaultUnit : fieldValue?.unit || ''
            acc[`${meta.name}-單位`] = unit
          }
          acc[`${meta.name}-備註`] = fieldValue?.notes ?? ''
          return acc
        }, rowObj as any)
      })
      .filter((row) => row)

    const parser = new Parser()
    const csv = parser.parse(fieldTable)
    const fileId = appendCache(csv, fileName)

    return { id: fileId }
  }
}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('rdbClient'),
    name: 'report'
  }
}
