const CompanySitesRouter = require("express").Router();
const { CreateCompanySitesRouter } = require("./Create/z-CreateCompanySites");
const { ReadCompanySitesRouter } = require("./Read/z-ReadCompanySites");
const { UpdateCompanySitesRouter } = require("./Update/z-UpdateCompanies");


CompanySitesRouter.use("/companysites", [CreateCompanySitesRouter,ReadCompanySitesRouter, UpdateCompanySitesRouter]);

CompanySitesRouter.all("/companysites/*", (req, res) => {
  res.status(300).send("Unknown companies route");
});

module.exports = {
  CompanySitesRouter: CompanySitesRouter,
};
