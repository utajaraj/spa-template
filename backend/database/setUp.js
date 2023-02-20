const { knex } = require("./connection");


const createDatabaseSchemas = async () => {

    try {

        const emititedQuotes = await knex.schema.hasTable('counts')
        if (!emititedQuotes) {
            try {
                await knex.schema.createTable('counts', function (t) {
                    t.integer('counts_clientID',255).unique().notNullable()
                    t.integer('counts',255).notNullable()
                })
            } catch (error) {
                console.log(error);
            }
        }

        const hasCompanySite = await knex.schema.hasTable('companysite')
        if (!hasCompanySite) {
            await knex.schema.createTable('companysite', function (t) {
                t.increments('id').primary().unique().notNullable();
                t.string('companyID', 100).notNullable().unique();
                t.string('site_name', 100).notNullable().unique();
                t.string('address', 100).notNullable().unique();
                t.datetime('created_at', { precision: 6 }).defaultTo(knex.fn.now(6)).notNullable()
                t.integer('created_by', 100).notNullable()
                t.datetime('modified_at', { precision: 6 }).defaultTo(knex.fn.now(6)).notNullable()
                t.integer('modified_by', 100).notNullable()
            })
        }

        const hasClientSite = await knex.schema.hasTable('clientsite')
        if (!hasClientSite) {
            await knex.schema.createTable('clientsite', function (t) {
                t.increments('id').primary().unique().notNullable();
                t.string('clientID', 100).notNullable().unique();
                t.string('site_name', 100).notNullable().unique();
                t.string('address', 100).notNullable().unique();
                t.datetime('created_at', { precision: 6 }).defaultTo(knex.fn.now(6)).notNullable()
                t.integer('created_by', 100).notNullable()
                t.datetime('modified_at', { precision: 6 }).defaultTo(knex.fn.now(6)).notNullable()
                t.integer('modified_by', 100).notNullable()
            })
        }

        const hasCompany = await knex.schema.hasTable('companies')
        if (!hasCompany) {
            await knex.schema.createTable('companies', function (t) {
                t.increments('id').primary().unique().notNullable();
                t.string('company_name', 100).notNullable().unique();
                t.string('address', 100).notNullable().unique();
                t.datetime('created_at', { precision: 6 }).defaultTo(knex.fn.now(6)).notNullable()
                t.integer('created_by', 100).notNullable()
                t.datetime('modified_at', { precision: 6 }).defaultTo(knex.fn.now(6)).notNullable()
                t.integer('modified_by', 100).notNullable()
            })
        }

        const hasRoles = await knex.schema.hasTable('roles')
        if (!hasRoles) {
                await knex.schema.createTable('roles', function (t) {
                    t.increments('id').primary().unique().notNullable();
                    t.string('quotes_permission', 100).notNullable();
                    t.string('clients_permission', 100).notNullable();
                    t.string('buyers_permission', 100).notNullable();
                    t.boolean('wos_permission', 100).notNullable();
                    t.string('users_permission', 255)
                    t.boolean('configuration_permission', 255)
                    t.integer('modified_by', 100).notNullable()
                    t.datetime('modified_at', { precision: 6 }).defaultTo(knex.fn.now(6)).notNullable()
                })
        }

        const hasUsers = await knex.schema.hasTable('users')
        if (!hasUsers) {
                await knex.schema.createTable('users', function (t) {
                    t.increments('id').primary().unique().notNullable();
                    t.string('user_name', 100).notNullable();
                    t.string('user_middle_name', 100).notNullable();
                    t.string('user_last_name', 100).notNullable();
                    t.string('email', 100).notNullable();
                    t.string('color', 100).notNullable();
                    t.boolean('collapsed', 100).notNullable();
                    t.boolean('theme', 100).notNullable();
                    t.string('password', 255).notNullable();
                    t.string('company_siteID', 255).notNullable();
                    t.string('roleID', 100).notNullable();
                    t.integer('created_by', 100).notNullable()
                    t.integer('modified_by', 100).notNullable()
                    t.datetime('created_at', { precision: 6 }).defaultTo(knex.fn.now(6)).notNullable()
                    t.datetime('modified_at', { precision: 6 }).defaultTo(knex.fn.now(6)).notNullable()
                })
        }
        const hasCategories = await knex.schema.hasTable('categories')
        if (!hasCategories) {
                await knex.schema.createTable('categories', function (t) {
                    t.increments('id').primary().unique().notNullable();
                    t.string('category_name', 100).unique().notNullable();
                    t.datetime('created_at', { precision: 6 }).defaultTo(knex.fn.now(6)).notNullable()
                    t.integer('created_by', 100).notNullable()
                    t.datetime('modified_at', { precision: 6 }).defaultTo(knex.fn.now(6)).notNullable()
                    t.integer('modified_by', 100).notNullable()
                })
        
        }

        const hasBrands = await knex.schema.hasTable('brands')
        if (!hasBrands) {
            await knex.schema.createTable('brands', function (t) {
                t.increments('id').primary().unique().notNullable();
                t.string('brand_name', 100).unique().notNullable();
                t.datetime('created_at', { precision: 6 }).defaultTo(knex.fn.now(6)).notNullable()
                t.integer('created_by', 100).notNullable()
                t.datetime('modified_at', { precision: 6 }).defaultTo(knex.fn.now(6)).notNullable()
                t.integer('modified_by', 100).notNullable()
            })
        }
        const hasClients = await knex.schema.hasTable('clients')
        if (!hasClients) {
            await knex.schema.createTable('clients', function (t) {
                t.increments('id').primary().unique().notNullable();
                t.string('client_name', 100).notNullable().unique();
                t.string('client_serialization', 100).notNullable().unique();
                t.string('street', 100);
                t.string('postalCode', 100);
                t.string('city', 100);
                t.string('state', 100);
                t.string('country', 100);
                t.integer('accountOwnerID', 100).notNullable();
                t.foreign('accountOwnerID').references('users.id').onDelete('cascade')
                t.datetime('created_at', { precision: 6 }).defaultTo(knex.fn.now(6)).notNullable()
                t.integer('created_by', 100).notNullable()
                t.datetime('modified_at', { precision: 6 }).defaultTo(knex.fn.now(6)).notNullable()
                t.integer('modified_by', 100).notNullable()
            })
        }

        const hasBuyers = await knex.schema.hasTable('buyers')
        if (!hasBuyers) {
            await knex.schema.createTable('buyers', function (t) {
                t.increments('id').primary().unique().notNullable();
                t.string('buyer_name', 100).notNullable();
                t.string('buyer_last_name', 100);
                t.integer('clientID', 100).notNullable();
                t.foreign('clientID').references('clients.id').onDelete('cascade')
                t.datetime('created_at', { precision: 6 }).defaultTo(knex.fn.now(6)).notNullable()
                t.integer('created_by', 100).notNullable()
                t.datetime('modified_at', { precision: 6 }).defaultTo(knex.fn.now(6)).notNullable()
                t.integer('modified_by', 100).notNullable()
            })
        }


        const hasQuotes = await knex.schema.hasTable('quotes')
        if (!hasQuotes) {
            await knex.schema.createTable('quotes', function (t) {
                t.increments('id').primary().unique().notNullable();
                t.string('reference', 100)
                t.string('currency', 100).notNullable();
                t.string('exchange_rate', 100);
                t.boolean('emitted', 100).defaultTo(false).notNullable();
                t.datetime('expiration_date', { precision: 6 }).notNullable();
                t.string('clientID', 100).notNullable();
                t.foreign('clientID').references('clients.id').onDelete('cascade')
                t.string('buyerID', 100)
                t.foreign('buyerID').references('buyers.id').onDelete('cascade')
                t.string('agentID', 100).notNullable();
                t.string('companyID', 100).notNullable();
                t.foreign('agentID').references('users.id').onDelete('cascade')
                t.datetime('created_at', { precision: 6 }).defaultTo(knex.fn.now(6)).notNullable()
                t.integer('created_by', 100).notNullable()
                t.datetime('modified_at', { precision: 6 }).defaultTo(knex.fn.now(6)).notNullable()
                t.integer('modified_by', 100).notNullable()
            })
        }
  
        const hasQuotePartitions = await knex.schema.hasTable('partitions')
        if (!hasQuotePartitions) {

            await knex.schema.createTable('partitions', function (t) {
                t.increments('id').primary().unique().notNullable();
                t.string('partition_name', 100).notNullable();
                t.string('description', 100).notNullable();
                t.string('part_number',100)
                t.string('unit', 100).notNullable();
                t.datetime('edd', { precision: 6 });
                t.integer('quoteID', 100).notNullable();
                t.foreign('quoteID').references('quotes.id').onDelete('cascade')
                t.decimal('quantity').notNullable();
                t.integer('categoryID', 100);
                t.foreign('categoryID').references('categories.id').onDelete('cascade')
                t.integer('brandID', 100);
                t.foreign('brandID').references('brands.id').onDelete('cascade')
                t.decimal('cost', 12, 4);
                t.decimal('factor', 12, 4);
                t.decimal('amount', 12, 4);
                t.integer('created_by', 100).notNullable()
                t.integer('modified_by', 100).notNullable()
                t.datetime('created_at', { precision: 6 }).defaultTo(knex.fn.now(6)).notNullable()
                t.datetime('modified_at', { precision: 6 }).defaultTo(knex.fn.now(6)).notNullable()
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