// For more information about this file see https://dove.feathersjs.com/guides/cli/knexfile.html
import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('company', (table) => {
    table.string('id').unique().notNullable()
    table.string('name').notNullable()
    table.string('abbreviation').notNullable()
    table.string('industry').notNullable()
    table.string('stockCode').notNullable().unique()
    table.timestamp('createdAt').notNullable()
    table.primary(['id'])
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('company')
}
