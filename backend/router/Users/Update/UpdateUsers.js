const { knex } = require("../../../database/connection");
const { respond } = require("../../../utlis/response");
const { UpdateOneUserValidation } = require("./ValidateUpdateOneUser");


const UpdateUsers = require("express").Router();

UpdateUsers.patch("/one", async (req, res) => {
    try {
        const isValid = await UpdateOneUserValidation(req.body)
        delete req.body.companyID
        if(isValid.status){
            await knex("users").update(req.body).where({ id: req.body.id })
            res.status(200).send({ status: true, message: "Usuarioactualizado con éxito." })

        }else{
            res.status(400).send({ status: false, message: `${isValid.data.invalidParameters.toString()}` + `${isValid.data.missingParameters.toString()}` })
        }
    } catch (error) {
        console.log(error);
        res.status(400).send({ status: false, message: "No se pudo actualizar el usuario" })
    }
});

UpdateUsers.patch("/theme", async (req, res) => {
    try {
        let theme = {}
        if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(req.body.color)) {
            theme.color = req.body.color
        }
        if (req.body.theme === true || req.body.theme === false) {
            theme.theme = req.body.theme
        }
        if (req.body.collapsed === true || req.body.collapsed === false) {
            theme.collapsed = req.body.collapsed
        }
        if (Object.keys(theme).length === 0) {

            res.status(400).send({ status: false, message: "Petición inválida" })
        } else {

            const user = await knex("users").update(theme).where({ id: req.body.created_by }).then(async () => {
                const updatedUser = await knex("users").where({ id: req.body.created_by })
                return updatedUser
            })
            res.status(200).send({ status: true, message: "Tema actualizado", data: user[0] })
        }
    } catch (error) {
        res.status(400).send({ status: false, message: "No se pudo actualizar el tema" })
    }
});

module.exports = {
    UpdateUsers: UpdateUsers,
};
