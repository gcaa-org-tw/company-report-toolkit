import { reportField } from './report-field/report-field'
import { fieldMeta } from './field-meta/field-meta'
import { report } from './report/report'
import { company } from './company/company'
import { user } from './users/users'
import { health } from './health';
// For more information about this file see https://dove.feathersjs.com/guides/cli/application.html#configure-functions
import type { Application } from '../declarations'


export { HealthService } from './health';

export const services = (app: Application) => {
  app.configure(reportField)
  app.configure(fieldMeta)
  app.configure(report)
  app.configure(company)
  app.configure(user)
  app.configure(health)
  // All services will be registered here
}
