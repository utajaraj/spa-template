const { knex } = require("../../../database/connection");
const { AddOneClientsValidation } = require("./CreateOneClient.Validation");


const CreateOneQuote = require("express").Router();



CreateOneQuote.post("/one", async (req, res) => {
  try {
    req.body.accountOwnerID = req.body.created_by
    const validation = await AddOneClientsValidation(req.body, req.headers.verbose)
    const valid = validation.status || validation.data.invalidParameters.concat(validation.data.missingParameters).toString()
    if (valid === true) {
      try {
        knex("clients").insert(req.body).then(async () => {
          const response = await knex("clients").select().where({ created_by: req.body.created_by }).orderBy("created_at", "desc").limit(1)
          res.status(200).send({ status: true, message: "Cliente ha sido añadido", data: response })
        }).catch((err) => {
          if (err.code === "ER_DUP_ENTRY") {
            res.status(400).send({ status: false, message: `El cliente: ${req.body.name} ya ha sido registrado`, data: err.sqlMessage })
          } else {
            res.status(400).send({ status: false, message: "No se pudo crear el client nuevo", data: err.sqlMessage })
          }
        })
      } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
          res.status(400).send({ status: false, message: `El cliente: ${req.body.name} ya ha sido registrado`, data: error.sqlMessage })
        } else {
          res.status(400).send({ status: false, message: "No se pudo crear el client nuevo", data: error.sqlMessage })
        }
      }

    } else {
      res.status(400).send({ status: false, message: valid })
    }
  } catch (error) {
    res.status(400).send({ status: false, message: "Error de servidor" })
  }
});

module.exports = {
  CreateOneQuote: CreateOneQuote,
};
