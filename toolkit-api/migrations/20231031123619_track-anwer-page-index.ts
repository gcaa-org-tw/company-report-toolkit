import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table('report-field', (table) => {
    table.integer('pageIndex')
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.table('report-field', (table) => {
    table.dropColumn('pageIndex')
  })
}

