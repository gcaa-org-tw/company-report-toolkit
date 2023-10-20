// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import type { Application } from '../../declarations'
import { HealthService, getOptions } from './health.class'
import { healthPath, healthMethods } from './health.shared'

export * from './health.class'

// A configure function that registers the service and its hooks via `app.configure`
export const health = (app: Application) => {
  // Register our service on the Feathers application
  app.use(healthPath, new HealthService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: healthMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(healthPath).hooks({
    around: {
      all: []
    },
    before: {
      all: [],
      find: [],
      get: [],
      create: [],
      patch: [],
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
    [healthPath]: HealthService
  }
}
