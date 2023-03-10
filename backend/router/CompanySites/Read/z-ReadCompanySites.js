const ReadCompanySitesRouter = require("express").Router();
const { ReadCompanySites } = require("./ReadCompanySites");

ReadCompanySitesRouter.use("/read", [ReadCompanySites]);

ReadCompanySitesRouter.all("/read", (req,res) => {
  res.status(300).send("Unknown company site create route");
});

module.exports = {
  ReadCompanySitesRouter: ReadCompanySitesRouter,
};
