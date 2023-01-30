const { knex } = require("../../../database/connection");
const ReadBrands = require("express").Router();



ReadBrands.get("/all", async (req, res) => {
  try {
    const brands = await knex("brands")
    res.status(200).send(brands)
  } catch (error) {
    res.status(200).send([])
  }
});

module.exports = {
  ReadBrands: ReadBrands,
};
