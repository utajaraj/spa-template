const { knex } = require("../../../database/connection");
const { UpdateOneCompanySiteValidation } = require("./UpdateOneCompanySite.Validation");


const UpdateOneCompanySite = require("express").Router();



UpdateOneCompanySite.patch("/one", async (req, res) => {
  try {
    delete req.body.created_by
    const validation = await UpdateOneCompanySiteValidation(req.body, req.headers.verbose)
    const valid = validation.status || validation.data.invalidParameters.concat(validation.data.missingParameters).toString()
    if (valid === true) {
      try {
        const updatedCompanySite = await knex("companysites").update(req.body).where({ id: req.body.id })
        res.status(200).send({status:true,message:"Información de sucursal actualizada."})
      } catch (error) {
        res.status(400).send({ status: false, message: "No se pudo actualizar la sucursal.", data: error.sqlMessage })
      }

    } else {
      res.status(400).send({ status: false, message: valid })
    }
  } catch (error) {
    res.status(400).send({ status: false, message: "Error de servidor" })
  }
});

module.exports = {
  UpdateOneCompanySite: UpdateOneCompanySite,
};
