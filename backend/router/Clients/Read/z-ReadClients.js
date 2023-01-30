const ReadClientsRouter = require("express").Router();
const { ReadMyClients } = require("./ReadMyClients");

ReadClientsRouter.use("/read", [ReadMyClients]);

ReadClientsRouter.all("/read", (req, res) => {
  res.status(300).send("Unknown clientes create route");
});

module.exports = {
  ReadClientsRouter: ReadClientsRouter,
};
