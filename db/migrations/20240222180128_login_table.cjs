/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

// npx knex --knexfile ./db/knexfile.cjs migrate:make login_table
// npx knex --knexfile ./db/knexfile.cjs migrate:rollback
// npx knex --knexfile ./db/knexfile.cjs migrate:status
// npx knex --knexfile ./db/knexfile.cjs migrate:latest

exports.up = function(knex) {
    return knex.schema
    .table('users', function(table) {
        table.dropColumn('password');
    })

    .createTable('login', function (table) {
        table.string('id', 36).notNullable().unique(); 
        table.string('password', 100).notNullable();
        table.string('email', 100).notNullable().unique();
        table.foreign('email').references('email').inTable('users');
    })

    .createTable('refresh_tokens', function (table) {
        table.string('id', 36).notNullable().unique(); 
        table.string('user_id', 36).unsigned().notNullable();
        table.string('refresh_token', 200).notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.foreign('user_id').references('id').inTable('users');
    })

};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema
    .table('users', function(table) {
        table.string('password', 100).notNullable();
    })
    .dropTable("maintenance_task")
    .dropTable("refresh_tokens")
    .dropTable("login")
};

exports.config = { transaction: false };