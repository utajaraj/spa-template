const QuotesRouter = require("express").Router();
const { CreateQuotesRouter } = require("./Create/z-CreateQuotes");

QuotesRouter.use("/users", [CreateQuotesRouter]);

QuotesRouter.all("/users/*", (req, res) => {
  res.status(300).send("Unknown users route");
});

module.exports = {
  QuotesRouter: QuotesRouter,
};
