const { knex } = require("../../database/connection");
const { AddOneUserValidation } = require("../../router/Users/Create/ValidateCreateOneUser");
const { Email } = require("../../utlis/regex");
const generateSalt = require("bcrypt").genSaltSync
const hashPassword = require("bcrypt").hashSync

const CreateOneUser = require("express").Router();


const createAdminUser = async ({ username, password, company_name, company_address,user_name,user_last_name, tax_id }) => {
    try {
        return await knex.transaction(async trx => {

            if (Email.test(username) === false) {
                throw { status: false, message: "Correo Inválido" }
            }


            const salt = generateSalt(12)
            const hash = hashPassword(password, salt)
            const userBody = {
                password: hash,
                user_name: user_name,
                user_last_name: user_last_name,
                email: username,
                color: "#000",
                collapsed: true,
                theme: true,
                password: hash,
                created_by: 0,
                modified_by: 0,
            }
            
            const isValid = await AddOneUserValidation(userBody)
            if (isValid.status) {
                const user = await trx("users").insert(userBody);
                return { status: true, message: "Aplicación configurada con éxito" }
            } else {
                throw { status: false, message:`${isValid.data.invalidParameters.toString()}` + `${isValid.data.missingParameters.toString()}` }
            }

        })
    } catch (error) {
        console.log(error);
        if (error.status===false) {
            return error
        }
        return { status: false, message: "Error Iniciando Aplicación" }
    }
}

module.exports = {
    createAdminUser: createAdminUser,
};
