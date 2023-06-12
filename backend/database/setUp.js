const { knex } = require("./connection");


const createDatabaseSchemas = async () => {

    try {

        const emititedQuotes = await knex.schema.hasTable('counts')
        if (!emititedQuotes) {
            await knex.schema.createTable('counts', function (t) {
                t.integer('counts_clientID', 255).unique().notNullable()
                t.integer('counts', 255).notNullable()
            })

        }

        const hasCompanySites = await knex.schema.hasTable('companysites')
        if (!hasCompanySites) {
            await knex.schema.createTable('companysites', function (t) {
                t.boolean('active', 100).notNullable().defaultTo(true);
                t.increments('id').primary().unique().notNullable();
                t.string('companyID', 100).notNullable()
                t.string('company_site_address', 100).notNullable().unique();
                t.string('company_site_name', 100).notNullable().unique();
                t.datetime('created_at', { precision: 6 }).defaultTo(knex.fn.now(6)).notNullable()
                t.integer('created_by', 100).notNullable()
                t.datetime('modified_at', { precision: 6 }).defaultTo(knex.fn.now(6)).notNullable()
                t.integer('modified_by', 100).notNullable()
            })
        }

        const hasClientSite = await knex.schema.hasTable('clientsite')
        if (!hasClientSite) {
            await knex.schema.createTable('clientsite', function (t) {
                t.boolean('active', 100).notNullable().defaultTo(true);
                t.increments('id').primary().unique().notNullable();
                t.string('clientID', 100).notNullable().unique();
                t.string('site_name', 100).notNullable().unique();
                t.string('tax_identifaction_number', 100).notNullable().unique();
                t.string('client_address', 100).notNullable().unique();
                t.datetime('created_at', { precision: 6 }).defaultTo(knex.fn.now(6)).notNullable()
                t.integer('created_by', 100).notNullable()
                t.datetime('modified_at', { precision: 6 }).defaultTo(knex.fn.now(6)).notNullable()
                t.integer('modified_by', 100).notNullable()
            })
        }

        const hasCompany = await knex.schema.hasTable('companies')
        if (!hasCompany) {
            await knex.schema.createTable('companies', function (t) {
                t.boolean('active', 100).notNullable().defaultTo(true);
                t.increments('id').primary().unique().notNullable();
                t.string('company_name', 100).notNullable().unique();
                t.string('company_comercial_name', 100).unique();
                t.string('company_color', 100).unique();
                t.string('logo_name', 100).unique();
                t.string('company_address', 100).notNullable().unique();
                t.string('tax_id', 100).notNullable().unique();
                t.datetime('created_at', { precision: 6 }).defaultTo(knex.fn.now(6)).notNullable()
                t.integer('created_by', 100).notNullable()
                t.datetime('modified_at', { precision: 6 }).defaultTo(knex.fn.now(6)).notNullable()
                t.integer('modified_by', 100).notNullable()
            })
        }

      

        const hasUsers = await knex.schema.hasTable('users')
        if (!hasUsers) {
            await knex.schema.createTable('users', function (t) {
                
                t.boolean('active', 100).notNullable().defaultTo(true);
                t.increments('id').primary().unique().notNullable();
                t.string('user_name', 100).notNullable();
                t.string('user_middle_name', 100);
                t.string('user_last_name', 100).notNullable();
                t.string('email', 100).unique().notNullable();
                t.string('color', 100).notNullable().defautlTo("#000");
                t.boolean('collapsed', 100).notNullable().defaultTo(true);
                t.boolean('theme', 100).notNullable().defaultTo(true);
                t.string('password', 255).notNullable();
                t.string('company_siteID', 255).notNullable();
                t.integer('created_by', 100).notNullable()
                t.integer('modified_by', 100).notNullable()
                t.datetime('created_at', { precision: 6 }).defaultTo(knex.fn.now(6)).notNullable()
                t.datetime('modified_at', { precision: 6 }).defaultTo(knex.fn.now(6)).notNullable()
            })
        }
        const hasCategories = await knex.schema.hasTable('categories')
        if (!hasCategories) {
            await knex.schema.createTable('categories', function (t) {
                t.boolean('active', 100).notNullable().defaultTo(true);
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
                t.boolean('active', 100).notNullable().defaultTo(true);
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
                t.boolean('active', 100).notNullable().defaultTo(true);
                t.increments('id').primary().unique().notNullable();
                t.string('client_name', 100).notNullable().unique();
                t.string('client_serialization', 100).notNullable().unique();
                t.string('street', 100);
                t.string('postalCode', 100);
                t.string('city', 100);
                t.string('state', 100);
                t.string('country', 100);
                t.integer('accountOwnerID', 100).notNullable();
                t.datetime('created_at', { precision: 6 }).defaultTo(knex.fn.now(6)).notNullable()
                t.integer('created_by', 100).notNullable()
                t.datetime('modified_at', { precision: 6 }).defaultTo(knex.fn.now(6)).notNullable()
                t.integer('modified_by', 100).notNullable()
            })
        }

        const hasBuyers = await knex.schema.hasTable('buyers')
        if (!hasBuyers) {
            await knex.schema.createTable('buyers', function (t) {
                       t.boolean('active', 100).notNullable().defaultTo(true);
                t.increments('id').primary().unique().notNullable();
                t.string('buyer_name', 100).notNullable();
                t.string('buyer_last_name', 100);
                t.integer('clientID', 100).notNullable();
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
                t.string('buyerID', 100)
                t.string('agentID', 100).notNullable();
                t.string('companyID', 100).notNullable();
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
                t.string('description', 100).notNullable();
                t.string('status', 100);
                t.string('iva_tax', 2);
                t.string('part_number', 100)
                t.string('unit', 100).notNullable();
                t.integer('edd', 100);
                t.integer('quoteID', 100).notNullable();
                t.decimal('quantity').notNullable();
                t.decimal('shippingCost').notNullable();
                t.integer('categoryID', 100);
                t.integer('brandID', 100);
                t.decimal('cost', 12, 4);
                t.decimal('factor', 12, 4);
                t.decimal('amount', 12, 4);
                t.integer('created_by', 100).notNullable()
                t.integer('modified_by', 100).notNullable()
                t.datetime('date_emitted', { precision: 6 }).defaultTo(knex.fn.now(6))
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