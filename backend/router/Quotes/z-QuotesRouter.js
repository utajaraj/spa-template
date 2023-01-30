const QuotesRouter = require("express").Router();
const { CreateQuotesRouter } = require("./Create/z-CreateQuotes");
const { DeleteQuotesRouter } = require("./Delete/z-DeleteQuotes");
const { ReadQuotesRouter } = require("./Read/z-ReadQuotes");
const { updateQuotesRouter } = require("./Update/z-UpdateQuotes");

QuotesRouter.use("/quotes", [CreateQuotesRouter, ReadQuotesRouter, updateQuotesRouter, DeleteQuotesRouter]);

QuotesRouter.all("/quotes/*", (req, res) => {
  res.status(300).send({ status: false, message: "Ruta de cotización desconocida" });
});

module.exports = {
  QuotesRouter: QuotesRouter,
};
