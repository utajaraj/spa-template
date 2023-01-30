const { knex } = require("../../../database/connection");
const { AddOneCategoriesValidation } = require("./CreateOneCategory.Validation");


const CreateOneQuote = require("express").Router();



CreateOneQuote.post("/one", async (req, res) => {
  try {
    const validation = await AddOneCategoriesValidation(req.body, req.headers.verbose)
    const valid = validation.status || validation.data.invalidParameters.concat(validation.data.missingParameters).toString()
    if (valid === true) {
      try {
        knex("categories").insert(req.body).then(async () => {
          const response = await knex("categories").select().where({ created_by: req.body.created_by }).orderBy("created_at", "desc").limit(1)
          res.status(200).send({ status: true, message: "Categoría ha sido añadida", data: response })
        }).catch((err) => {
          if (err.code === "ER_DUP_ENTRY") {
            res.status(400).send({ status: false, message: `La categoría: ${req.body.name} ya ha sida registrada`, data: err.sqlMessage })
          } else {
            res.status(400).send({ status: false, message: "No se pudo crear la categoría nueva", data: err.sqlMessage })
          }
        })
      } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
          res.status(400).send({ status: false, message: `El categoría: ${req.body.name} ya ha sida registrada`, data: error.sqlMessage })
        } else {
          res.status(400).send({ status: false, message: "No se pudo crear la categoría nueva", data: error.sqlMessage })
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
