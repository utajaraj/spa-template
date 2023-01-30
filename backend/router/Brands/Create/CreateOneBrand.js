const { knex } = require("../../../database/connection");
const { AddOneBrandsValidation } = require("./CreateOneBrand.Validation");


const CreateOneBrand = require("express").Router();



CreateOneBrand.post("/one", async (req, res) => {
  try {
    const validation = await AddOneBrandsValidation(req.body, req.headers.verbose)
    const valid = validation.status || validation.data.invalidParameters.concat(validation.data.missingParameters).toString()
    if (valid === true) {
      try {
        knex("brands").insert(req.body).then(async () => {
          const response = await knex("brands").select().where({ created_by: req.body.created_by }).orderBy("created_at", "desc").limit(1)
          res.status(200).send({ status: true, message: "Marca ha sido añadido", data: response })
        }).catch((err) => {
          if (err.code === "ER_DUP_ENTRY") {
            res.status(400).send({ status: false, message: `La marca: ${req.body.name} ya ha sido registrado`, data: err.sqlMessage })
          } else {
            res.status(400).send({ status: false, message: "No se pudo crear la marca nueva", data: err.sqlMessage })
          }
        })
      } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
          res.status(400).send({ status: false, message: `El marca: ${req.body.name} ya ha sido registrada`, data: error.sqlMessage })
        } else {
          res.status(400).send({ status: false, message: "No se pudo crear la marca nueva", data: error.sqlMessage })
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
  CreateOneBrand: CreateOneBrand,
};
