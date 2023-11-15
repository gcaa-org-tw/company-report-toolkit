// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'
import { atLeastCollaborator, mustBeAdmin } from '../../hooks/authorization'

import {
  reportFieldDataValidator,
  reportFieldPatchValidator,
  reportFieldQueryValidator,
  reportFieldResolver,
  reportFieldExternalResolver,
  reportFieldDataResolver,
  reportFieldPatchResolver,
  reportFieldQueryResolver
} from './report-field.schema'

import type { Application } from '../../declarations'
import { ReportFieldService, getOptions } from './report-field.class'
import { reportFieldPath, reportFieldMethods } from './report-field.shared'
import { HookContext } from '@feathersjs/feathers'
import { reportPath } from '../report/report.shared'

export * from './report-field.class'
export * from './report-field.schema'

const updateReportStats = async (context: HookContext) => {
  const { app, result } = context
  const { reportId } = result
  const reportService = app.service(reportPath)
  const reportFieldService = app.service(reportFieldPath)

  const answeredFields = await reportFieldService.find({
    query: {
      $or: [
        { reportId, value: { $ne: null } },
        { reportId, notes: { $ne: null } }
      ]
    }
  })
  reportService.patch(reportId, {
    answeredFields: answeredFields.total
  })
}

const applyDefaultQuery = (context: HookContext) => {
  const { params } = context
  if (!params.query) {
    params.query = {}
  }
  if (!params.query.$sort) {
    params.query.$sort = { fieldId: 1 }
  }
}

// A configure function that registers the service and its hooks via `app.configure`
export const reportField = (app: Application) => {
  // Register our service on the Feathers application
  app.use(reportFieldPath, new ReportFieldService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: reportFieldMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(reportFieldPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(reportFieldExternalResolver),
        schemaHooks.resolveResult(reportFieldResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(reportFieldQueryValidator),
        schemaHooks.resolveQuery(reportFieldQueryResolver)
      ],
      find: [applyDefaultQuery],
      get: [],
      create: [
        schemaHooks.validateData(reportFieldDataValidator),
        schemaHooks.resolveData(reportFieldDataResolver),
        mustBeAdmin
      ],
      patch: [
        schemaHooks.validateData(reportFieldPatchValidator),
        schemaHooks.resolveData(reportFieldPatchResolver),
        atLeastCollaborator
      ],
      remove: [mustBeAdmin]
    },
    after: {
      all: [],
      patch: [updateReportStats]
    },
    error: {
      all: []
    }
  })
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [reportFieldPath]: ReportFieldService
  }
}
