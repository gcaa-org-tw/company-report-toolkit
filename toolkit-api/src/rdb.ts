// For more information about this file see https://dove.feathersjs.com/guides/cli/databases.html
import knex from 'knex'
import type { Knex } from 'knex'
import type { Application } from './declarations'

declare module './declarations' {
  interface Configuration {
    rdbClient: Knex
  }
}

export const rdb = (app: Application) => {
  const config = app.get('rdbClient')
  const db = knex(config!)

  app.set('rdbClient', db)
}
