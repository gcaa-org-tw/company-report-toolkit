// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type { Health, HealthData, HealthPatch, HealthQuery, HealthService } from './health.class'

export type { Health, HealthData, HealthPatch, HealthQuery }

export type HealthClientService = Pick<HealthService<Params<HealthQuery>>, (typeof healthMethods)[number]>

export const healthPath = 'health'

export const healthMethods = ['find'] as const

export const healthClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(healthPath, connection.service(healthPath), {
    methods: healthMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [healthPath]: HealthClientService
  }
}
