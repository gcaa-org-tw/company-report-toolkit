// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#custom-services
import type { Id, NullableId, Params, ServiceInterface } from '@feathersjs/feathers'

import type { Application } from '../../declarations'

type Health = any
type HealthData = any
type HealthPatch = any
type HealthQuery = any

export type { Health, HealthData, HealthPatch, HealthQuery }

export interface HealthServiceOptions {
  app: Application
}

export interface HealthParams extends Params<HealthQuery> {}

// This is a skeleton for a custom service class. Remove or add the methods you need here
export class HealthService<ServiceParams extends HealthParams = HealthParams>
  implements ServiceInterface<Health, HealthData, ServiceParams, HealthPatch>
{
  constructor(public options: HealthServiceOptions) {}

  async find(_params?: ServiceParams): Promise<Health[]> {
    return []
  }

  async get(id: Id, _params?: ServiceParams): Promise<Health> {
    return {
      id: 0,
      text: `A new message with ID: ${id}!`
    }
  }

  async create(data: HealthData, params?: ServiceParams): Promise<Health>
  async create(data: HealthData[], params?: ServiceParams): Promise<Health[]>
  async create(data: HealthData | HealthData[], params?: ServiceParams): Promise<Health | Health[]> {
    if (Array.isArray(data)) {
      return Promise.all(data.map((current) => this.create(current, params)))
    }

    return {
      id: 0,
      ...data
    }
  }

  // This method has to be added to the 'methods' option to make it available to clients
  async update(id: NullableId, data: HealthData, _params?: ServiceParams): Promise<Health> {
    return {
      id: 0,
      ...data
    }
  }

  async patch(id: NullableId, data: HealthPatch, _params?: ServiceParams): Promise<Health> {
    return {
      id: 0,
      text: `Fallback for ${id}`,
      ...data
    }
  }

  async remove(id: NullableId, _params?: ServiceParams): Promise<Health> {
    return {
      id: 0,
      text: 'removed'
    }
  }
}

export const getOptions = (app: Application) => {
  return { app }
}
