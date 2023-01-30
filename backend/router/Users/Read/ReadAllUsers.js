const { knex } = require("../../../database/connection");

const ReadAllUsers = require("express").Router();


ReadAllUsers.get("/all", async (req, res) => {
  try {
    const response = await knex("users").select()
    res.send(response);
  } catch (error) {
    res.status(400).send([])
  }
});

module.exports = {
  ReadAllUsers: ReadAllUsers,
};
