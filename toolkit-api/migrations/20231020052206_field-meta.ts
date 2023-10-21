// For more information about this file see https://dove.feathersjs.com/guides/cli/knexfile.html
import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('field-meta', (table) => {
    table.integer('id').unique().notNullable()
    table.string('name').notNullable()
    table.json('keywords').notNullable()
    table.string('description')
    table.enum('dataType', ['string', 'boolean']).notNullable()
    table.json('units').notNullable()
    table.timestamp('createdAt').notNullable()
    table.primary(['id'])
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('field-meta')
}
