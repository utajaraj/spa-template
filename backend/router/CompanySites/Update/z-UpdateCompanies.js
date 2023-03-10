const UpdateCompanySitesRouter = require("express").Router();
const { UpdateOneCompanySite } = require("./UpdateOneCompanySite");

UpdateCompanySitesRouter.use("/update", [UpdateOneCompanySite]);

UpdateCompanySitesRouter.all("/update", (req, res) => {
  res.status(300).send({status:false,message:"Unknown company sites update route"});
});

module.exports = {
  UpdateCompanySitesRouter: UpdateCompanySitesRouter,
};
