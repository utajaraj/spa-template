const { knex } = require("../../../database/connection");
const { AddOneCompanySiteValidation } = require("./CreateOneCompanySite.Validation");


const CreateOneCompanySite = require("express").Router();



CreateOneCompanySite.post("/one", async (req, res) => {
  try {
    const validation = await AddOneCompanySiteValidation(req.body, req.headers.verbose)
    const valid = validation.status || validation.data.invalidParameters.concat(validation.data.missingParameters).toString()
    if (valid === true) {
      try {
        knex("companysites").insert(req.body).then(async () => {
          const response = await knex("companysites").select().where({ created_by: req.body.created_by }).orderBy("created_at", "desc").limit(1)
          res.status(200).send({ status: true, message: "Sucursal ha sido añadida", data: response })
        }).catch((err) => {
          if (err.code === "ER_DUP_ENTRY") {
            res.status(400).send({ status: false, message: `La sucursal: ${req.body.name} ya ha sido registrado`, data: err.sqlMessage })
          } else {
            res.status(400).send({ status: false, message: "No se pudo crear la sucursal nueva", data: err.sqlMessage })
          }
        })
      } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
          res.status(400).send({ status: false, message: `El sucursal: ${req.body.name} ya ha sido registrada`, data: error.sqlMessage })
        } else {
          res.status(400).send({ status: false, message: "No se pudo crear la sucursal nueva", data: error.sqlMessage })
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
  CreateOneCompanySite: CreateOneCompanySite,
};
