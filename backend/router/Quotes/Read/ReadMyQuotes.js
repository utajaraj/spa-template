const { knex } = require("../../../database/connection");
const ReadMyQuotes = require("express").Router();



ReadMyQuotes.get("/mine", async (req, res) => {
  try {
    const quotes = await knex("quotes").where({ created_by: req.query.created_by })
    res.status(200).send(quotes)
  } catch (error) {
    res.status(200).send([])
  }
});

module.exports = {
  ReadMyQuotes: ReadMyQuotes,
};
