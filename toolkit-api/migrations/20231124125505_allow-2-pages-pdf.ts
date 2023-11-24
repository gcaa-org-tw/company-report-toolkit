import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('report', table => {
    table.boolean('is2Pages').defaultTo(false)
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('report', table => {
    table.dropColumn('is2Pages')
  })
}

