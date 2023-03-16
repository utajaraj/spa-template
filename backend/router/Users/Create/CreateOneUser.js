const { knex } = require("../../../database/connection");
const { respond } = require("../../../utlis/response");
const { AddOneUserValidation } = require("./ValidateCreateOneUser");
const { genSaltSync, hashSync } = require("bcrypt")

const CreateOneUser = require("express").Router();


CreateOneUser.post("/one", async (req, res) => {
  try {
    const isValid = await AddOneUserValidation(req.body)

    if (isValid.status === true) {
      const salt = genSaltSync(12)
      req.body.password = hashSync(req.body.password, salt)
      await knex("users").insert(req.body)
      res.status(200).send({ status: true, message: "Usuario añadido con éxito" })
    } else {
      res.status(400).send({ status: false, message: `${isValid.data.invalidParameters.toString()}` + `${isValid.data.missingParameters.toString()}` })
    }

  } catch (error) {
    res.status(400).send({ status: false, message: `Correo ${req.body.email} ya está en uso` })
  }
});

module.exports = {
  CreateOneUser: CreateOneUser,
};
