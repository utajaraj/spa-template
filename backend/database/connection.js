require("dotenv").config()
const knex = require('knex')({
  client: 'mysql',
  connection: {
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DB,
  },
  pool: { min: 2, max: 7 }
});
module.exports = {
  knex: knex
}