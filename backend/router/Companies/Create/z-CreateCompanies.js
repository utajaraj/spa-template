const CreateCompaniesRouter = require("express").Router();
const { CreateOneCompany } = require("./CreateOneCompany");

CreateCompaniesRouter.use("/create", [CreateOneCompany]);

CreateCompaniesRouter.all("/create", (req, res) => {
  res.status(300).send("Unknown companies create route");
});

module.exports = {
  CreateCompaniesRouter: CreateCompaniesRouter,
};
