const { knex } = require("../../../database/connection");
const ReadMyClients = require("express").Router();



ReadMyClients.get("/mine", async (req, res) => {
  try {
    const clients = await knex("clients").where({ created_by: req.query.created_by })
    res.status(200).send(clients)
  } catch (error) {
    res.status(200).send([])
  }
});

module.exports = {
  ReadMyClients: ReadMyClients,
};
