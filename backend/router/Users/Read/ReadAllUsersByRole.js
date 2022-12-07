const { knex } = require("../../../database/connection");

const ReadAllUsersByRole = require("express").Router();

let columns = [
  "name",
  "middleName",
  "lastName"
];

ReadAllUsersByRole.get("/AllUsersByRole", async (req, res) => {
  const response = await knex("users").select(columns).where({role:req.query.id})
  res.send(response);
});

module.exports = {
  ReadAllUsersByRole: ReadAllUsersByRole,
};
