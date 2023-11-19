import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('report-field', table => {
    table.boolean('hasAdminEdited').defaultTo(false)
    table.integer('timeSpentInSeconds').defaultTo(0)
  })
  await knex.schema.alterTable('report', table => {
    table.integer('timeSpentInSeconds').defaultTo(0)
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('report-field', table => {
    table.dropColumn('hasAdminEdited')
    table.dropColumn('timeSpentInSeconds')
  })
  await knex.schema.alterTable('report', table => {
    table.dropColumn('timeSpentInSeconds')
  })
}

