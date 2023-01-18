const { Email, Password } = require("../../utlis/regex");
const { knex } = require("../../database/connection");
const { compareSync } = require("bcrypt")
module.exports = {
    checkCredentials: async (username, userPassword) => {
        const hasUsername = Email.test(username) && username.length > 0
        const hasPassword = Password.test(userPassword)
        if (hasUsername && hasPassword) {
            try {
                const users = await knex('users').where('email', username)
                const user = users[0]
                const { password } = user
                const isValidPassword = compareSync(userPassword, password)
                return isValidPassword ? user.id : false
            } catch (error) {
                return false
            }
        } else {
            return false
        }

    }
}