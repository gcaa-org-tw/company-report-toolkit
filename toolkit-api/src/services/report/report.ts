// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  reportDataValidator,
  reportPatchValidator,
  reportQueryValidator,
  reportResolver,
  reportExternalResolver,
  reportDataResolver,
  reportPatchResolver,
  reportQueryResolver
} from './report.schema'

import type { Application, HookContext, NextFunction } from '../../declarations'
import { ReportService, getOptions } from './report.class'
import { reportPath, reportMethods } from './report.shared'

export * from './report.class'
export * from './report.schema'

function setHasSetPageOffsetIfNeeded (context: HookContext) {
  const { data } = context
  if (data && 'pageOffset' in data) {
    data.hasSetPageOffset = true
  }
}

// A configure function that registers the service and its hooks via `app.configure`
export const report = (app: Application) => {
  // Register our service on the Feathers application
  app.use(reportPath, new ReportService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: reportMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(reportPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(reportExternalResolver),
        schemaHooks.resolveResult(reportResolver)
      ]
    },
    before: {
      all: [schemaHooks.validateQuery(reportQueryValidator), schemaHooks.resolveQuery(reportQueryResolver)],
      find: [],
      get: [],
      create: [schemaHooks.validateData(reportDataValidator), schemaHooks.resolveData(reportDataResolver)],
      patch: [
        schemaHooks.validateData(reportPatchValidator),
        schemaHooks.resolveData(reportPatchResolver),
        setHasSetPageOffsetIfNeeded
      ],
      remove: []
    },
    after: {
      all: []
    },
    error: {
      all: []
    }
  })
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [reportPath]: ReportService
  }
}
