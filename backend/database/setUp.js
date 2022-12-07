const { knex } = require("./connection");


const createDatabaseSchemas = async () => {

    try {

        const hasUsers = await knex.schema.hasTable('users')
        if (!hasUsers) {
            knex.schema.createTable('users', function (t) {
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


        return (true)

    } catch (error) {
        return (error)
    }

}

module.exports = {
    createDatabaseSchemas: createDatabaseSchemas
}