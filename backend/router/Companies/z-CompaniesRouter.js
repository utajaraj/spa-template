const CompaniesRouter = require("express").Router();
const { CreateCompaniesRouter } = require("./Create/z-CreateCompanies");
const { ReadCompaniesRouter } = require("./Read/z-ReadCompanies");
const { UpdateCompaniesRouter } = require("./Update/z-UpdateCompanies");

CompaniesRouter.use("/companies", [CreateCompaniesRouter, ReadCompaniesRouter, UpdateCompaniesRouter]);

CompaniesRouter.all("/companies/*", (req, res) => {
  res.status(300).send({status:false,message:"Unknown users route"});
});

module.exports = {
  CompaniesRouter: CompaniesRouter,
};
