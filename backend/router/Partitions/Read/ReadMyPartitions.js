const { knex } = require("../../../database/connection");
const ReadMyPartitions = require("express").Router();



ReadMyPartitions.get("/quote", async (req, res) => {
  delete req.query.modified_by
  try {
    const partitions = await knex.select(["partitions.*", "categories.category_name", "brands.brand_name"]).from("partitions")
      .where({ "partitions.created_by": req.query.created_by, "partitions.quoteID": req.query.quoteID })
      .leftJoin('categories', 'partitions.categoryID', '=', 'categories.id')
      .leftJoin('brands', 'partitions.brandID', '=', 'brands.id')
    res.status(200).send(partitions)
  } catch (error) {
    res.status(200).send([])
  }
});


ReadMyPartitions.get("/mine", async (req, res) => {
  delete req.query.modified_by
  try {
    const partitions = await knex.select(["partitions.*", "categories.category_name", "brands.brand_name"]).from("partitions")
      .where({ "partitions.created_by": req.query.created_by })
      .leftJoin('categories', 'partitions.categoryID', '=', 'categories.id')
      .leftJoin('brands', 'partitions.brandID', '=', 'brands.id')
    res.status(200).send(partitions)
  } catch (error) {
    res.status(200).send([])
  }
});

module.exports = {
  ReadMyPartitions: ReadMyPartitions,
};
