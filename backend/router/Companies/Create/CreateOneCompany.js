const { knex } = require("../../../database/connection");
const { AddOneCompanyValidation } = require("./CreateOneCompany.Validation");


const CreateOneCompany = require("express").Router();



CreateOneCompany.post("/one", async (req, res) => {
  try {
    const validation = await AddOneCompanyValidation(req.body, req.headers.verbose)
    const valid = validation.status || validation.data.invalidParameters.concat(validation.data.missingParameters).toString()
    if (valid === true) {
      try {
        knex("companies").insert(req.body).then(async () => {
          const response = await knex("companies").select().where({ created_by: req.body.created_by }).orderBy("created_at", "desc").limit(1)
          res.status(200).send({ status: true, message: "Empresa ha sido añadido", data: response })
        }).catch((err) => {
          if (err.code === "ER_DUP_ENTRY") {
            res.status(400).send({ status: false, message: `La empresa: ${req.body.name} ya ha sido registrado`, data: err.sqlMessage })
          } else {
            res.status(400).send({ status: false, message: "No se pudo crear la empresa nueva", data: err.sqlMessage })
          }
        })
      } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
          res.status(400).send({ status: false, message: `La empresa: ${req.body.name} ya ha sido registrada`, data: error.sqlMessage })
        } else {
          res.status(400).send({ status: false, message: "No se pudo crear la empresa nueva", data: error.sqlMessage })
        }
      }

    } else {
      res.status(400).send({ status: false, message: valid })
    }
  } catch (error) {
    res.status(400).send({ status: false, message: "Error de servidor", error: error.toString() })
  }
});

module.exports = {
  CreateOneCompany: CreateOneCompany,
};
