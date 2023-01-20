const ClientsRouter = require("express").Router();
const { CreateClientsRouter } = require("./Create/z-CreateClients");
const { ReadClientsRouter } = require("./Read/z-ReadClients");

ClientsRouter.use("/clients", [CreateClientsRouter,ReadClientsRouter]);

ClientsRouter.all("/clients/*", (req, res) => {
  res.status(300).send("Unknown users route");
});

module.exports = {
  ClientsRouter: ClientsRouter,
};
