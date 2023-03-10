const { knex } = require("../../../database/connection");

const ReadAllUsers = require("express").Router();


ReadAllUsers.get("/all", async (req, res) => {
  try {
    const response = await knex.select([
      "users.*",
      "companysites.company_site_name"
    ]).from("users")
    .leftJoin('companysites', 'users.company_siteID', '=', 'companysites.id')
    res.send(response);
  } catch (error) {
    res.status(400).send([])
  }
});

module.exports = {
  ReadAllUsers: ReadAllUsers,
};
