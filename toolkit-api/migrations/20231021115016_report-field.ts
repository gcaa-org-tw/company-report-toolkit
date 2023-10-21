// For more information about this file see https://dove.feathersjs.com/guides/cli/knexfile.html
import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('report-field', (table) => {
    table.increments('id')
    table
      .integer('fieldId')
      .references('id')
      .inTable('field-meta')
    table
      .integer('reportId')
      .references('id')
      .inTable('report')
    table.string('value')
    table.string('unit')
    table.string('notes')
    table.timestamp('updatedAt')
    table.timestamp('createdAt')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('report-field')
}
