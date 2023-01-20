const knex = require('knex')({
  client: 'mysql',
  connection: {
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'db',
    port: 30000
  },
  pool: { min: 2, max: 7 }
});
module.exports = {
  knex: knex
}