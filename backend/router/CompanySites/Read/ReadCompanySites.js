const { knex } = require("../../../database/connection");
const ReadCompanySites = require("express").Router();



ReadCompanySites.get("/all", async (req, res) => {
  try {
    const companies = await knex("companysites")
    res.status(200).send(companies)
  } catch (error) {
    res.status(200).send([])
  }
});


ReadCompanySites.get("/id/:id", async (req, res) => {
  try {
    const companies = await knex("companysites").where({companyID:req.params.id})
    res.status(200).send(companies)
  } catch (error) {
    res.status(200).send([])
  }
});


module.exports = {
  ReadCompanySites: ReadCompanySites,
};
