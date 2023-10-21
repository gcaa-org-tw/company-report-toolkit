// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  fieldMetaDataValidator,
  fieldMetaPatchValidator,
  fieldMetaQueryValidator,
  fieldMetaResolver,
  fieldMetaExternalResolver,
  fieldMetaDataResolver,
  fieldMetaPatchResolver,
  fieldMetaQueryResolver
} from './field-meta.schema'

import type { Application } from '../../declarations'
import { FieldMetaService, getOptions } from './field-meta.class'
import { fieldMetaPath, fieldMetaMethods } from './field-meta.shared'

export * from './field-meta.class'
export * from './field-meta.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const fieldMeta = (app: Application) => {
  // Register our service on the Feathers application
  app.use(fieldMetaPath, new FieldMetaService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: fieldMetaMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(fieldMetaPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(fieldMetaExternalResolver),
        schemaHooks.resolveResult(fieldMetaResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(fieldMetaQueryValidator),
        schemaHooks.resolveQuery(fieldMetaQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(fieldMetaDataValidator),
        schemaHooks.resolveData(fieldMetaDataResolver)
      ],
      patch: [
        schemaHooks.validateData(fieldMetaPatchValidator),
        schemaHooks.resolveData(fieldMetaPatchResolver)
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
    [fieldMetaPath]: FieldMetaService
  }
}
