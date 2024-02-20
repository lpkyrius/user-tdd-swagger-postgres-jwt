/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
    .createTable('users', function (table) {
        table.string('id', 36).notNullable().unique(); 
        table.string('email', 100).notNullable().unique();
        table.string('password', 100).notNullable();
        table.enu('role', ['1', '2']).notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
    })

    .createTable('maintenance_task', function (table) {
        table.string('id', 36).notNullable().unique();
        table.string('user_id', 36).unsigned().notNullable();
        table.string('summary', 500).notNullable();
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
    .dropTable("maintenance_task")
    .dropTable("users");
};

exports.config = { transaction: false };