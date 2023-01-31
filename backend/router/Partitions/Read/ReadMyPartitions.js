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
    const partitions = await knex.select(["partitions.*", "categories.category_name", "brands.brand_name",
      "quotes.reference",
      "quotes.currency",
      "quotes.buyerID",
      "quotes.agentID",
      "quotes.clientID",
      "quotes.emitted",
      "quotes.expiration_date",
      "users.user_name",
      "users.user_middle_name",
      "users.user_last_name",
      "buyers.buyer_name",
      "buyers.buyer_last_name",
      "clients.client_name",
    ]).from("partitions")
      .leftJoin('categories', 'partitions.categoryID', '=', 'categories.id')
      .leftJoin('brands', 'partitions.brandID', '=', 'brands.id')
      .leftJoin('quotes', 'partitions.quoteID', '=', 'quotes.id')
      .leftJoin('clients', 'quotes.clientID', '=', 'clients.id')
      .leftJoin('buyers', 'quotes.buyerID', '=', 'buyers.id')
      .leftJoin('users', 'quotes.agentID', '=', 'users.id')
    res.status(200).send(partitions)
  } catch (error) {
    res.status(200).send([])
  }
});

module.exports = {
  ReadMyPartitions: ReadMyPartitions,
};
