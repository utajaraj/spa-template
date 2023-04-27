const UpdateClientsRouter = require("express").Router();
const { UpdateOneQuote } = require("./UpdateOneClient");

UpdateClientsRouter.use("/update", [UpdateOneQuote]);

UpdateClientsRouter.all("/update", (req, res) => {
  res.status(300).send("Unknown clients update route");
});

module.exports = {
  UpdateClientsRouter: UpdateClientsRouter,
};
