import { fieldMeta } from './field-meta/field-meta'
import { report } from './report/report'
import { company } from './company/company'
import { user } from './users/users'
// For more information about this file see https://dove.feathersjs.com/guides/cli/application.html#configure-functions
import type { Application } from '../declarations'

export const services = (app: Application) => {
  app.configure(fieldMeta)
  app.configure(report)
  app.configure(company)
  app.configure(user)
  // All services will be registered here
}
