// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  companyDataValidator,
  companyPatchValidator,
  companyQueryValidator,
  companyResolver,
  companyExternalResolver,
  companyDataResolver,
  companyPatchResolver,
  companyQueryResolver
} from './company.schema'

import type { Application } from '../../declarations'
import { CompanyService, getOptions } from './company.class'
import { companyPath, companyMethods } from './company.shared'

export * from './company.class'
export * from './company.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const company = (app: Application) => {
  // Register our service on the Feathers application
  app.use(companyPath, new CompanyService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: companyMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(companyPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(companyExternalResolver),
        schemaHooks.resolveResult(companyResolver)
      ]
    },
    before: {
      all: [schemaHooks.validateQuery(companyQueryValidator), schemaHooks.resolveQuery(companyQueryResolver)],
      find: [],
      get: [],
      create: [schemaHooks.validateData(companyDataValidator), schemaHooks.resolveData(companyDataResolver)],
      patch: [schemaHooks.validateData(companyPatchValidator), schemaHooks.resolveData(companyPatchResolver)],
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
    [companyPath]: CompanyService
  }
}
