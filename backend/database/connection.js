require("dotenv").config()
const knex = require('knex')({
  client: 'mysql',
  connection: {
    host: process.env.HOST,
    user: process.env.DBUSER,
    password: process.env.PASSWORD,
    database: process.env.DB,
    port:process.env.PORT
  },
  pool: { min: 2, max: 7 }
});
module.exports = {
  knex: knex
}