const CreateClientsRouter = require("express").Router();
const { CreateOneQuote } = require("./CreateOneClient");

CreateClientsRouter.use("/create", [CreateOneQuote]);

CreateClientsRouter.all("/create", (req, res) => {
  res.status(300).send("Unknown clients create route");
});

module.exports = {
  CreateClientsRouter: CreateClientsRouter,
};
