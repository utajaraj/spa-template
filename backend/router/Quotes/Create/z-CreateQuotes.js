const CreateQuotesRouter = require("express").Router();
const { CreateOneQuote } = require("./CreateOneQuote");

CreateQuotesRouter.use("/create", [CreateOneQuote]);

CreateQuotesRouter.all("/create", (req, res) => {
  res.status(300).send("Unknown users create route");
});

module.exports = {
  CreateQuotesRouter: CreateQuotesRouter,
};
