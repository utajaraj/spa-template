const { knex } = require("./connection");


const createDatabaseSchemas = async () => {

    try {

        const hasUsers = await knex.schema.hasTable('users')
        if (!hasUsers) {
            await knex.schema.createTable('users', function (t) {
                t.increments('id').primary().unique();
                t.string('name', 100).notNullable();
                t.string('middleName', 100).notNullable();
                t.string('lastName', 100).notNullable();
                t.string('email', 100).notNullable();
                t.string('assignedPhone', 100)
                t.string('rfc', 100).notNullable();
                t.string('curp', 100).notNullable();
                t.string('city_id', 100).notNullable();
                t.string('state_id', 100).notNullable();
                t.string('country_id', 100).notNullable();
                t.string('position_id', 100).notNullable();
                t.string('department_id', 100).notNullable();
                t.string('role', 100).notNullable();
                t.string('username', 100).notNullable();
                t.datetime('created_at', { precision: 6 }).defaultTo(knex.fn.now(6)).notNullable()
                t.string('created_by', 100).notNullable()
                t.datetime('modified_at', { precision: 6 }).defaultTo(knex.fn.now(6)).notNullable()
                t.string('modified_by', 100).notNullable()
            })
        }
        const hasCategories = await knex.schema.hasTable('categories')
        if (!hasCategories) {
            await knex.schema.createTable('categories', function (t) {
                t.increments('id').primary().unique();
                t.string('name', 100).notNullable();
                t.datetime('created_at', { precision: 6 }).defaultTo(knex.fn.now(6)).notNullable()
                t.string('created_by', 100).notNullable()
                t.datetime('modified_at', { precision: 6 }).defaultTo(knex.fn.now(6)).notNullable()
                t.string('modified_by', 100).notNullable()
            })
        }

        const hasBrands = await knex.schema.hasTable('brands')
        if (!hasBrands) {
            await knex.schema.createTable('brands', function (t) {
                t.increments('id').primary().unique();
                t.string('name', 100).notNullable();
                t.datetime('created_at', { precision: 6 }).defaultTo(knex.fn.now(6)).notNullable()
                t.string('created_by', 100).notNullable()
                t.datetime('modified_at', { precision: 6 }).defaultTo(knex.fn.now(6)).notNullable()
                t.string('modified_by', 100).notNullable()
            })
        }

        const hasClients = await knex.schema.hasTable('clients')
        if (!hasClients) {
            await knex.schema.createTable('clients', function (t) {
                t.increments('id').primary().unique();
                t.string('name', 100).notNullable().unique();
                t.string('street', 100);
                t.string('postalCode', 100);
                t.string('city', 100);
                t.string('state', 100);
                t.string('country', 100);
                t.integer('accountOwnerID', 100).notNullable();
                t.foreign('accountOwnerID').references('users.id').onDelete('cascade')
                t.datetime('created_at', { precision: 6 }).defaultTo(knex.fn.now(6)).notNullable()
                t.string('created_by', 100).notNullable()
                t.datetime('modified_at', { precision: 6 }).defaultTo(knex.fn.now(6)).notNullable()
                t.string('modified_by', 100).notNullable()
            })
        }

        const hasBuyers = await knex.schema.hasTable('buyers')
        if (!hasBuyers) {
            await knex.schema.createTable('buyers', function (t) {
                t.increments('id').primary().unique();
                t.string('name', 100).notNullable();
                t.string('lastName', 100).notNullable();
                t.integer('clientID', 100).notNullable();
                t.foreign('clientID').references('clients.id').onDelete('cascade')
                t.datetime('created_at', { precision: 6 }).defaultTo(knex.fn.now(6)).notNullable()
                t.string('created_by', 100).notNullable()
                t.datetime('modified_at', { precision: 6 }).defaultTo(knex.fn.now(6)).notNullable()
                t.string('modified_by', 100).notNullable()
            })
        }


        const hasQuotes = await knex.schema.hasTable('quotes')
        if (!hasQuotes) {
            await knex.schema.createTable('quotes', function (t) {
                t.increments('id').primary().unique();
                t.string('reference', 100).notNullable();
                t.string('currency', 100).notNullable();
                t.boolean('emitted', 100).defaultTo(false).notNullable();
                t.string('expirationDate', 100).notNullable();
                t.string('clientID', 100).notNullable();
                t.foreign('clientID').references('clients.id').onDelete('cascade')
                t.string('buyerID', 100)
                t.foreign('buyerID').references('buyers.id').onDelete('cascade')
                t.string('agentID', 100).notNullable();
                t.foreign('agentID').references('users.id').onDelete('cascade')
                t.datetime('created_at', { precision: 6 }).defaultTo(knex.fn.now(6)).notNullable()
                t.string('created_by', 100).notNullable()
                t.datetime('modified_at', { precision: 6 }).defaultTo(knex.fn.now(6)).notNullable()
                t.string('modified_by', 100).notNullable()
            })
        }

        const hasQuotePartitions = await knex.schema.hasTable('partitions')
        if (!hasQuotePartitions) {
            await knex.schema.createTable('partitions', function (t) {
                t.increments('id').primary().unique();
                t.string('name', 100).notNullable();
                t.string('description', 100).notNullable();
                t.integer('categoryID', 100);
                t.foreign('categoryID').references('categories.id').onDelete('cascade')
                t.integer('brandID', 100);
                t.foreign('brandID').references('brands.id').onDelete('cascade')
                t.decimal('quantity').notNullable();
                t.decimal('cost');
                t.decimal('factor', 0, 1);
                t.decimal('amount').notNullable();
                t.datetime('created_at', { precision: 6 }).defaultTo(knex.fn.now(6)).notNullable()
                t.string('created_by', 100).notNullable()
                t.datetime('modified_at', { precision: 6 }).defaultTo(knex.fn.now(6)).notNullable()
                t.string('modified_by', 100).notNullable()
            })
        }





        return (true)

    } catch (error) {
        return (error)
    }

}

module.exports = {
    createDatabaseSchemas: createDatabaseSchemas
}