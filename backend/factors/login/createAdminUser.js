const { knex } = require("../../database/connection");
const { AddOneUserValidation } = require("../../router/Users/Create/ValidateCreateOneUser");
const { Email } = require("../../utlis/regex");
const generateSalt = require("bcrypt").genSaltSync
const hashPassword = require("bcrypt").hashSync

const CreateOneUser = require("express").Router();


const createAdminUser = async ({ username, password, company_name, company_address,user_name,user_last_name }) => {
    try {
        return await knex.transaction(async trx => {

            if (Email.test(username) === false) {
                throw { status: false, message: "Correo Inválido" }
            }
            const company = {
                company_name: company_name,
                company_address: company_address,
                created_by: 0,
                modified_by: 0,
            }
            const newCompany = await trx("companies").insert(company);

            const adminRoleBody = {
                role_name:"Administrador",
                quotes_permission:"all",
                clients_permission:"all",
                buyers_permission:"all",
                wos_permission:true,
                users_permission:"all",
                configuration_permission:true,
                modified_by:0,
            }

            const companySite = {
                companyID: newCompany,
                company_site_name: `${company_name} - Planta 1`,
                address: company_address,
                created_by: 0,
                modified_by: 0,
            }
            const newCompanySite = await trx("companysites").insert(companySite);

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
                company_siteID: newCompanySite,
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
