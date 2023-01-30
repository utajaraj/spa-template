const { knex } = require("../../../database/connection");
const DeleteMyPartitions = require("express").Router();



DeleteMyPartitions.delete("/mine", async (req, res) => {

  const isArrayOfInteger = Array.isArray(req.body.ids) && req.body.ids.filter(id => { return Number.isInteger(id) }).length !== 0

  try {
    if (isArrayOfInteger) {

      const deleteMatch = {
        created_by: req.body.created_by,
        modified_by: req.body.modified_by
      }
      const partitions = await knex("partitions").delete().where(deleteMatch).whereIn("id", req.body.ids)
      res.status(200).send({status:true,message:"Partidas eliminadas"})
    } else {

      res.status(400).send({ status: false, message: "Partidas invalidas" })
    }

  } catch (error) {
    res.status(400).send({ status: false, message: "No se eliminó la partida", error:error.toString() })
  }
});

module.exports = {
  DeleteMyPartitions: DeleteMyPartitions,
};
