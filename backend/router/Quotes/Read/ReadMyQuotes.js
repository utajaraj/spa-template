const { knex } = require("../../../database/connection");
const ReadMyQuotes = require("express").Router();



ReadMyQuotes.get("/mine", async (req, res) => {
  delete req.query.modified_by
  try {
    const quotes = await knex("quotes").where({ created_by: req.query.created_by, emitted: false })
    res.status(200).send(quotes)
  } catch (error) {
    res.status(200).send([])
  }
});

module.exports = {
  ReadMyQuotes: ReadMyQuotes,
};
