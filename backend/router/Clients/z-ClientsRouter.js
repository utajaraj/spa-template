const ClientsRouter = require("express").Router();
const { CreateClientsRouter } = require("./Create/z-CreateClients");
const { ReadClientsRouter } = require("./Read/z-ReadClients");
const { UpdateClientsRouter } = require("./Update/z-UpdateClients");

ClientsRouter.use("/clients", [CreateClientsRouter,ReadClientsRouter, UpdateClientsRouter]);

ClientsRouter.all("/clients/*", (req, res) => {
  res.status(300).send("Unknown clientes route");
});

module.exports = {
  ClientsRouter: ClientsRouter,
};
