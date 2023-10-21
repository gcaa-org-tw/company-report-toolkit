// For more information about this file see https://dove.feathersjs.com/guides/cli/knexfile.html
import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('report', (table) => {
    table.increments('id')
    table
      .string('companyId')
      .references('id')
      .inTable('company')
    table.integer('year')
    table.integer('totalPages')
    table.integer('pageOffset')
    table.integer('totalFields')
    table.integer('answeredFields')
    table.boolean('isVerified')
    table.timestamp('updatedAt')
    table.timestamp('createdAt')
    table.primary(['id'])
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('report')
}
