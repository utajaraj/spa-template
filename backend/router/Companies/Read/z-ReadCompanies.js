const ReadCompaniesRouter = require("express").Router();
const { ReadCompanies } = require("./ReadCompanies");

ReadCompaniesRouter.use("/read", [ReadCompanies]);

ReadCompaniesRouter.all("/read", (req, res) => {
  res.status(300).send("Unknown companies read route");
});

module.exports = {
  ReadCompaniesRouter: ReadCompaniesRouter,
};
