const CreateCompanySitesRouter = require("express").Router();
const { CreateOneCompanySite } = require("./CreateOneCompanySite");

CreateCompanySitesRouter.use("/create", [CreateOneCompanySite]);

CreateCompanySitesRouter.all("/create", (req, res) => {
  res.status(300).send("Unknown company site create route");
});

module.exports = {
  CreateCompanySitesRouter: CreateCompanySitesRouter,
};
