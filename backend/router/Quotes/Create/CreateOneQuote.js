const { knex } = require("../../../database/connection");
const { respond } = require("../../../utlis/response");


const CreateOneQuote = require("express").Router();

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

CreateOneQuote.post("/one", async (req, res) => {
  try {
   
    console.log(req.body);
  } catch (error) {
    console.log(error);
  }
});

module.exports = {
  CreateOneQuote: CreateOneQuote,
};
