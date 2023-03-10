const { knex } = require("../../../database/connection");
const { UpdateOneCompanyValidation } = require("./UpdateOneCompany.Validation");


const UpdateOneCompany = require("express").Router();



UpdateOneCompany.patch("/one", async (req, res) => {
  try {
    delete req.body.created_by
    const validation = await UpdateOneCompanyValidation(req.body, req.headers.verbose)
    const valid = validation.status || validation.data.invalidParameters.concat(validation.data.missingParameters).toString()
    if (valid === true) {
      try {
        const updatedCompany = await knex("companies").update(req.body).where({ id: req.body.id })
        res.status(200).send({status:true,message:"Información de empresa actualizada"})
      } catch (error) {
        res.status(400).send({ status: false, message: "No se pudo actualizar la empresa.", data: error.sqlMessage })
      }

    } else {
      res.status(400).send({ status: false, message: valid })
    }
  } catch (error) {
    res.status(400).send({ status: false, message: "Error de servidor" })
  }
});

module.exports = {
  UpdateOneCompany: UpdateOneCompany,
};
