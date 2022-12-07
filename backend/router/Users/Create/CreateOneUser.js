const { knex } = require("../../../database/connection");
const { respond } = require("../../../utlis/response");


const CreateOneUser = require("express").Router();

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

CreateOneUser.post("/one", async (req, res) => {
  try {
    req.body.password="password"
    req.body.created_by=req.body.sftjrzerptkn
    req.body.modified_by=req.body.sftjrzerptkn
    req.body.modified_at=new Date()
    req.body.created_at=new Date()
    delete req.body.sftjrzerptkn
    const user = await knex("users").insert(req.body);
    let response = respond(200,`Username added`)
    res.status(response.status).send(response)
  } catch (error) {
    let response = respond(400,`Username ${req.body.username} is already in use`)
    res.status(response.status).send(response)
  }
});

module.exports = {
  CreateOneUser: CreateOneUser,
};
