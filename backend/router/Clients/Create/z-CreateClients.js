const CreateClientsRouter = require("express").Router();
const { CreateOneClient } = require("./CreateOneClient");

CreateClientsRouter.use("/create", [CreateOneClient]);

CreateClientsRouter.all("/create", (req, res) => {
  res.status(300).send("Unknown clients create route");
});

module.exports = {
  CreateClientsRouter: CreateClientsRouter,
};
