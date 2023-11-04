import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('report', table => {
    table.boolean('hasSetPageOffset').defaultTo(false)
  })
  await knex('report')
    .update({ hasSetPageOffset: true })
    .whereNot('pageOffset', 0)
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('report', table => {
    table.dropColumn('hasSetPageOffset')
  })
}

