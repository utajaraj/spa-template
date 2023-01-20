const QuotesRouter = require("express").Router();
const { CreateQuotesRouter } = require("./Create/z-CreateQuotes");
const { ReadQuotesRouter } = require("./Read/z-ReadQuotes");

QuotesRouter.use("/quotes", [CreateQuotesRouter,ReadQuotesRouter]);

QuotesRouter.all("/quotes/*", (req, res) => {
  res.status(300).send("Unknown users route");
});

module.exports = {
  QuotesRouter: QuotesRouter,
};
