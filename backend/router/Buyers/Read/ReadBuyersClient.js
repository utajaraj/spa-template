const { knex } = require("../../../database/connection");
const ReadBuyersClient = require("express").Router();



ReadBuyersClient.get("/client", async (req, res) => {
  try {
    const buyers = await knex("buyers").where({ clientID: req.query.clientID })
    res.status(200).send(buyers)
  } catch (error) {
    res.status(200).send([])
  }
});

module.exports = {
  ReadBuyersClient: ReadBuyersClient,
};
