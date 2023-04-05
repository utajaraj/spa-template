const { knex } = require("../../../database/connection");
const { UpdateOneClientsValidation } = require("./UpdateOneClient.Validation");


const UpdateOneQuote = require("express").Router();

UpdateOneQuote.patch("/one", async (req, res) => {
  try {
    const validation = await UpdateOneClientsValidation(req.body, req.headers.verbose)
    const valid = validation.status || validation.data.invalidParameters.concat(validation.data.missingParameters).toString()
    if (valid === true) {
      try {
        knex("clients").update(req.body).where({id:req.body.id}).then(async () => {
          const response = await knex("clients").select().where({ id: req.body.id })
          res.status(200).send({ status: true, message: "Cliente ha sido actualizado", data: response })
        }).catch((err) => {
          console.log(err);
          if (err.code === "ER_DUP_ENTRY") {
            res.status(400).send({ status: false, message: `El cliente: ${req.body.client_name} ya ha sido registrado`, data: err.sqlMessage })
          } else {
            res.status(400).send({ status: false, message: "No se pudo actualizar el cliente nuevo", data: err.sqlMessage })
          }
        })
      } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
          res.status(400).send({ status: false, message: `El cliente: ${req.body.client_name} ya ha sido registrado`, data: error.sqlMessage })
        } else {
          res.status(400).send({ status: false, message: "No se pudo actualizar el client nuevo", data: error.sqlMessage })
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
  UpdateOneQuote: UpdateOneQuote,
};
