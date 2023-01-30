const { knex } = require("../../../database/connection");
const ReadMyCategories = require("express").Router();



ReadMyCategories.get("/all", async (req, res) => {
  try {
    const categories = await knex("categories")
    res.status(200).send(categories)
  } catch (error) {
    res.status(200).send([])
  }
});

module.exports = {
  ReadMyCategories: ReadMyCategories,
};
