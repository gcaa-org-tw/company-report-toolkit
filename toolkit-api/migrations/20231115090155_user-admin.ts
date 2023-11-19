import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', table => {
    table.enum('role', ['admin', 'collaborator', 'visitor']).defaultTo('visitor')
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', table => {
    table.dropColumn('role')
  })
}

