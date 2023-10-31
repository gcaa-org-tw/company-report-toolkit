import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.table('field-meta', (table) => {
    table.string('historyColumnName')
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.table('field-meta', (table) => {
    table.dropColumn('historyColumnName')
  })
}

