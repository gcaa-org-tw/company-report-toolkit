import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.table('field-meta', (table) => {
    table.string('numberStep').defaultTo(1)
    table.string('defaultUnit')
    table.json('unitTransformer')
    table.boolean('isCustomUnit').defaultTo(false)
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.table('field-meta', (table) => {
    table.dropColumn('numberStep')
    table.dropColumn('defaultUnit')
    table.dropColumn('unitTransformer')
    table.dropColumn('isCustomUnit')
  })
}

