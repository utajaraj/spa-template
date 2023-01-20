const ReadQuotesRouter = require("express").Router();
const { ReadMyQuotes } = require("./ReadMyQuotes");

ReadQuotesRouter.use("/read", [ReadMyQuotes]);

ReadQuotesRouter.all("/read", (req, res) => {
  res.status(300).send("Unknown users create route");
});

module.exports = {
  ReadQuotesRouter: ReadQuotesRouter,
};
