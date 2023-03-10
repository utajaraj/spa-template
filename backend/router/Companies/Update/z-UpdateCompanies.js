const UpdateCompaniesRouter = require("express").Router();
const { UpdateOneCompany } = require("./UpdateOneCompany");

UpdateCompaniesRouter.use("/update", [UpdateOneCompany]);

UpdateCompaniesRouter.all("/update", (req, res) => {
  res.status(300).send({status:false,message:"Unknown companies update route"});
});

module.exports = {
  UpdateCompaniesRouter: UpdateCompaniesRouter,
};
