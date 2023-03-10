const { unregisterCustomQueryHandler } = require("puppeteer");
const { knex } = require("../../database/connection");


module.exports = {
    needsSetUp: async () => {
        try {
            const users = await knex('users')
           return (users.length===0)
        } catch (error) {
            return false
        }
    }
}