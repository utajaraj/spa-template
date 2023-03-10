const { knex } = require("../../../database/connection");
const ReadCompanies = require("express").Router();



ReadCompanies.get("/all", async (req, res) => {
  try {
    const companies = await knex("companies")
    res.status(200).send(companies)
  } catch (error) {
    res.status(200).send([])
  }
});


ReadCompanies.get("/id/:id", async (req, res) => {
  try {
    const companies = await knex("companies").where({id:req.params.id})
    res.status(200).send(companies)
  } catch (error) {
    res.status(200).send([])
  }
});

module.exports = {
  ReadCompanies: ReadCompanies,
};
