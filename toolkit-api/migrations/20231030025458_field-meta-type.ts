// alter table field-meta, change enum column dataType to [string, boolean, number]
import { Knex } from "knex"

const tableName = 'field-meta'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable(tableName, (table) => {
    // pure alter doesn't work, we need to drop and create
    table.dropColumn('dataType')
  })
  // drop & create can not live in the same alterTable :p
  await knex.schema.alterTable(tableName, (table) => {
    table.enum('dataType', ['string', 'boolean', 'number']).notNullable().defaultTo('string')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable(tableName, (table) => {
    table.dropColumn('dataType')
  })
  await knex.schema.alterTable(tableName, (table) => {
    table.enum('dataType', ['string', 'boolean']).notNullable().defaultTo('string')
  })
}

