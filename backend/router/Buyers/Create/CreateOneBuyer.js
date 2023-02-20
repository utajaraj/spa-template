const { knex } = require("../../../database/connection");
const { AddOnebuyersValidation } = require("./CreateOneBuyer.Validation");


const CreateOneBuyer = require("express").Router();



CreateOneBuyer.post("/one", async (req, res) => {
  try {
    req.body.created_by = req.body.created_by
    const validation = await AddOnebuyersValidation(req.body, req.headers.verbose)
    const valid = validation.status || validation.data.invalidParameters.concat(validation.data.missingParameters).toString()
    if (valid === true) {
      try {
        knex("buyers").insert(req.body).then(async () => {
          const response = await knex("buyers").select().where({ created_by: rkeq.body.created_by }).orderBy("created_at", "desc").limit(1)
          res.status(200).send({ status: true, message: "Comprador ha sido añadido", data: response })
        }).catch((err) => {
          if (err.code === "ER_DUP_ENTRY") {
            res.status(400).send({ status: false, message: `El Comprador: ${req.body.name} ya ha sido registrado`, data: err.sqlMessage })
          } else {
            res.status(400).send({ status: false, message: "No se pudo crear el cliente nuevo", data: err.sqlMessage })
          }
        })
      } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
          res.status(400).send({ status: false, message: `El Comprador: ${req.body.name} ya ha sido registrado`, data: error.sqlMessage })
        } else {
          res.status(400).send({ status: false, message: "No se pudo crear el cliente nuevo", data: error.sqlMessage })
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
  CreateOneBuyer: CreateOneBuyer,
};
