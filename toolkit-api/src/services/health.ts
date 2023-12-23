import type { ClientApplication } from '../client'
import { Application } from '../declarations';

export class HealthService {

  async find() {
    return { status: 'ok' };
  }
}

export const healthPath = 'health'

const healthMethods = ['find'] as const

export const health = (app: Application) => {
  // Register our service on the Feathers application
  app.use(healthPath, new HealthService(), {
    // A list of all methods this service exposes externally
    methods: healthMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
}

export const healthClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(healthPath, connection.service(healthPath), {
    methods: healthMethods
  })
}

declare module '../declarations' {
  interface ServiceTypes {
    [healthPath]: HealthService
  }
}

type HealthClientService = Pick<HealthService, (typeof healthMethods)[number]>

declare module '../client' {
  interface ServiceTypes {
    [healthPath]: HealthClientService
  }
}
