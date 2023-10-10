const { knex } = require("./connection");


const createDatabaseSchemas = async () => {

    try {

     


      

        const hasUsers = await knex.schema.hasTable('users')
        if (!hasUsers) {
            await knex.schema.createTable('users', function (t) {
                
                t.boolean('active', 100).notNullable().defaultTo(true);
                t.increments('id').primary().unique().notNullable();
                t.string('user_name', 100).notNullable();
                t.string('user_middle_name', 100);
                t.string('user_last_name', 100).notNullable();
                t.string('email', 100).unique().notNullable();
                t.string('color', 100).notNullable().defaultTo("#000");
                t.boolean('collapsed', 100).notNullable().defaultTo(true);
                t.boolean('theme', 100).notNullable().defaultTo(true);
                t.string('password', 255).notNullable();
                t.integer('created_by', 100).notNullable()
                t.integer('modified_by', 100).notNullable()
                t.datetime('created_at', { precision: 6 }).defaultTo(knex.fn.now(6)).notNullable()
                t.datetime('modified_at', { precision: 6 }).defaultTo(knex.fn.now(6)).notNullable()
            })
        }



        const hasClients = await knex.schema.hasTable('clients')
        if (!hasClients) {
            await knex.schema.createTable('clients', function (t) {
                t.boolean('active', 100).notNullable().defaultTo(true);
                t.increments('id').primary().unique().notNullable();
                t.string('client_name', 100).notNullable().unique();
                t.string('street', 100);
                t.string('gender', 100);
                t.string('origin', 100);
                t.string('birthPostalCode', 100);
                t.string('birthCity', 100);
                t.string('birthState', 100);
                t.string('birthCountry', 100);
                t.string('residencePostalCode', 100);
                t.string('residenceCity', 100);
                t.string('residenceState', 100);
                t.string('residenceCountry', 100);
                t.datetime('created_at', { precision: 6 }).defaultTo(knex.fn.now(6)).notNullable()
                t.integer('created_by', 100).notNullable().in
                t.datetime('modified_at', { precision: 6 }).defaultTo(knex.fn.now(6)).notNullable()
                t.integer('modified_by', 100).notNullable().in
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