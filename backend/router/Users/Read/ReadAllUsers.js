const { knex } = require("../../../database/connection");

const ReadAllUsers = require("express").Router();

let columns = [
  "name",
  "middleName",
  "lastName",
  "email",
  "imei",
  "rfc",
  "curp",
  "city",
  "state",
  "country",
  "role",
  "created_at",
  "created_by",
  "modified_by",
  "modified_at",
  "id",
  "username",
  "transaction",
];

ReadAllUsers.get("/all", async (req, res) => {
  const response = await knex("users").select(columns)
  res.send(response);
});

module.exports = {
  ReadAllUsers: ReadAllUsers,
};
