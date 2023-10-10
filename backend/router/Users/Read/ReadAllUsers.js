const { knex } = require("../../../database/connection");

const ReadAllUsers = require("express").Router();


ReadAllUsers.get("/all", async (req, res) => {
  try {
    const response = await knex.select([
      "users.*",
    ]).from("users")
    res.send(response);
  } catch (error) {
    res.status(400).send([])
  }
});

module.exports = {
  ReadAllUsers: ReadAllUsers,
};
