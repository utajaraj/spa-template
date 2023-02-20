const { knex } = require("../../../database/connection");
const { respond } = require("../../../utlis/response");


const CreateOneUser = require("express").Router();


CreateOneUser.post("/one", async (req, res) => {
  try {
  const isValid = await AddOneUserValidation(req.body)
  
    if(isValid.status===true){
      return null
    }
    
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
